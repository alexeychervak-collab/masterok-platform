"""
Payment API endpoints для STROYKA
Безопасные платежи через YooKassa с эскроу
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Literal
import logging

from backend.app.core.database import get_db
from backend.app.core.auth import get_current_user
from backend.app.core.models import User, Order, Payment
from backend.app.services.yookassa_service import (
    create_payment_by_token,
    get_payment,
    capture_payment,
    refund_payment,
    YooKassaError
)

router = APIRouter()
log = logging.getLogger(__name__)


class CreatePaymentRequest(BaseModel):
    """Запрос на создание платежа"""
    order_id: int
    payment_token: str
    payment_method: Literal["bank_card", "yoo_money", "sbp"] = "bank_card"
    return_url: Optional[str] = None


class CapturePaymentRequest(BaseModel):
    """Запрос на capture платежа"""
    payment_id: str
    order_id: int


class RefundPaymentRequest(BaseModel):
    """Запрос на возврат платежа"""
    payment_id: str
    order_id: int
    reason: str


class PaymentResponse(BaseModel):
    """Ответ с данными платежа"""
    payment_id: str
    status: str
    amount: str
    confirmation_url: Optional[str] = None


@router.post("/create", response_model=PaymentResponse)
async def create_payment(
    request: CreatePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Создание платежа с холдированием (эскроу).
    
    Схема:
    1. Клиент создаёт заказ
    2. Клиент оплачивает (деньги холдируются)
    3. Специалист выполняет работу
    4. Клиент подтверждает → capture → деньги специалисту
    """
    # Проверяем заказ
    order = db.query(Order).filter(Order.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Это не ваш заказ")
    
    if order.status != "pending":
        raise HTTPException(status_code=400, detail="Заказ уже оплачен или завершён")
    
    try:
        # Создаём платёж в YooKassa с холдированием
        payment_data = await create_payment_by_token(
            amount=str(order.budget),
            description=f"Заказ #{order.id}: {order.title}",
            payment_token=request.payment_token,
            metadata={
                "order_id": order.id,
                "client_id": current_user.id,
                "specialist_id": order.specialist_id
            },
            capture=False,  # Холдирование!
            customer_email=current_user.email,
            customer_phone=current_user.phone,
            return_url=request.return_url or "stroyka://payment/success"
        )
        
        # Сохраняем платёж в БД
        payment = Payment(
            order_id=order.id,
            yookassa_payment_id=payment_data["id"],
            amount=order.budget,
            status=payment_data["status"],
            payment_method=request.payment_method
        )
        db.add(payment)
        
        # Обновляем статус заказа
        order.status = "payment_pending"
        db.commit()
        
        log.info(f"Payment created: {payment_data['id']} for order {order.id}")
        
        return PaymentResponse(
            payment_id=payment_data["id"],
            status=payment_data["status"],
            amount=str(order.budget),
            confirmation_url=payment_data.get("confirmation", {}).get("confirmation_url")
        )
        
    except YooKassaError as e:
        log.error(f"YooKassa error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        log.error(f"Payment creation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка создания платежа")


@router.post("/capture", response_model=PaymentResponse)
async def capture_payment_endpoint(
    request: CapturePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Capture платежа после выполнения работ.
    
    Вызывается клиентом после подтверждения выполнения работ.
    Деньги переводятся специалисту.
    """
    # Проверяем заказ
    order = db.query(Order).filter(Order.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Только клиент может подтвердить выполнение")
    
    # Проверяем платёж
    payment = db.query(Payment).filter(
        Payment.order_id == order.id,
        Payment.yookassa_payment_id == request.payment_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Платёж не найден")
    
    if payment.status == "succeeded":
        raise HTTPException(status_code=400, detail="Платёж уже завершён")
    
    try:
        # Capture в YooKassa
        captured_data = await capture_payment(request.payment_id)
        
        # Обновляем статус
        payment.status = captured_data["status"]
        order.status = "paid"
        db.commit()
        
        log.info(f"Payment captured: {request.payment_id} for order {order.id}")
        
        # TODO: Отправить уведомление специалисту о получении оплаты
        
        return PaymentResponse(
            payment_id=captured_data["id"],
            status=captured_data["status"],
            amount=captured_data["amount"]["value"]
        )
        
    except YooKassaError as e:
        log.error(f"YooKassa capture error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        log.error(f"Payment capture error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка подтверждения платежа")


@router.post("/refund", response_model=PaymentResponse)
async def refund_payment_endpoint(
    request: RefundPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Возврат платежа при споре или отмене.
    
    Может вызвать:
    - Клиент (если специалист не выполнил работу)
    - Админ (при разрешении спора)
    """
    # Проверяем заказ
    order = db.query(Order).filter(Order.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    
    # Проверяем права
    is_client = order.client_id == current_user.id
    is_admin = current_user.role == "admin"
    
    if not (is_client or is_admin):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    # Проверяем платёж
    payment = db.query(Payment).filter(
        Payment.order_id == order.id,
        Payment.yookassa_payment_id == request.payment_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Платёж не найден")
    
    if payment.status == "refunded":
        raise HTTPException(status_code=400, detail="Платёж уже возвращён")
    
    try:
        # Возврат в YooKassa
        refund_data = await refund_payment(
            payment_id=request.payment_id,
            amount={"value": str(payment.amount), "currency": "RUB"},
            reason=request.reason
        )
        
        # Обновляем статус
        payment.status = "refunded"
        order.status = "cancelled"
        db.commit()
        
        log.info(f"Payment refunded: {request.payment_id} for order {order.id}")
        
        # TODO: Отправить уведомления клиенту и специалисту
        
        return PaymentResponse(
            payment_id=refund_data["payment_id"],
            status="refunded",
            amount=refund_data["amount"]["value"]
        )
        
    except YooKassaError as e:
        log.error(f"YooKassa refund error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        log.error(f"Payment refund error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка возврата платежа")


@router.get("/{payment_id}")
async def get_payment_status(
    payment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить статус платежа"""
    # Проверяем, что платёж принадлежит пользователю
    payment = db.query(Payment).filter(
        Payment.yookassa_payment_id == payment_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Платёж не найден")
    
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    
    is_client = order.client_id == current_user.id
    is_specialist = order.specialist_id == current_user.id
    is_admin = current_user.role == "admin"
    
    if not (is_client or is_specialist or is_admin):
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    try:
        # Получаем актуальный статус из YooKassa
        payment_data = await get_payment(payment_id)
        
        # Обновляем статус в БД
        payment.status = payment_data["status"]
        db.commit()
        
        return {
            "payment_id": payment_data["id"],
            "status": payment_data["status"],
            "amount": payment_data["amount"]["value"],
            "created_at": payment_data["created_at"],
            "captured_at": payment_data.get("captured_at"),
            "refunded_amount": payment_data.get("refunded_amount")
        }
        
    except YooKassaError as e:
        log.error(f"YooKassa get payment error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        log.error(f"Get payment error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Ошибка получения платежа")


@router.post("/webhook")
async def yookassa_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Webhook для обработки событий от YooKassa.
    
    События:
    - payment.succeeded - платёж успешен
    - payment.canceled - платёж отменён
    - refund.succeeded - возврат выполнен
    """
    try:
        data = await request.json()
        event_type = data.get("event")
        payment_data = data.get("object", {})
        payment_id = payment_data.get("id")
        
        log.info(f"YooKassa webhook: {event_type} for payment {payment_id}")
        
        # Находим платёж в БД
        payment = db.query(Payment).filter(
            Payment.yookassa_payment_id == payment_id
        ).first()
        
        if not payment:
            log.warning(f"Payment {payment_id} not found in database")
            return {"status": "ok"}
        
        # Обновляем статус
        if event_type == "payment.succeeded":
            payment.status = "succeeded"
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.status = "paid"
                
        elif event_type == "payment.canceled":
            payment.status = "canceled"
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.status = "cancelled"
                
        elif event_type == "refund.succeeded":
            payment.status = "refunded"
            order = db.query(Order).filter(Order.id == payment.order_id).first()
            if order:
                order.status = "cancelled"
        
        db.commit()
        
        # TODO: Отправить push-уведомление пользователю
        
        return {"status": "ok"}
        
    except Exception as e:
        log.error(f"Webhook processing error: {str(e)}", exc_info=True)
        return {"status": "error", "message": str(e)}

