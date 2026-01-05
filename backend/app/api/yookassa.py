"""
YooKassa (ЮKassa) Integration для безопасных платежей
Документация API: https://yookassa.ru/developers/api
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid
import os
import requests
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.models.payment import Payment, PaymentStatus
from app.models.escrow import EscrowTransaction

router = APIRouter(prefix="/api/payments", tags=["payments"])

# YooKassa credentials
YOOKASSA_SHOP_ID = os.getenv("YOOKASSA_SHOP_ID")
YOOKASSA_SECRET_KEY = os.getenv("YOOKASSA_SECRET_KEY")
YOOKASSA_API_URL = "https://api.yookassa.ru/v3"

class CreatePaymentRequest(BaseModel):
    order_id: str
    amount: float = Field(gt=0)
    description: str
    return_url: Optional[str] = None
    payment_method: Literal["bank_card", "yoo_money", "sbp"] = "bank_card"

class PaymentResponse(BaseModel):
    id: str
    status: str
    amount: float
    currency: str = "RUB"
    description: str
    confirmation_url: Optional[str] = None
    created_at: datetime

class PaymentWebhook(BaseModel):
    type: str
    event: str
    object: dict

@router.post("/create", response_model=PaymentResponse)
async def create_payment(
    request: CreatePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Создание платежа через ЮKassa для безопасной сделки
    
    1. Проверяем заказ
    2. Создаем платеж в ЮKassa
    3. Создаем escrow транзакцию
    4. Возвращаем URL для оплаты
    """
    
    # Проверяем заказ
    order = db.query(Order).filter(Order.id == request.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Проверяем что текущий пользователь - заказчик
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not the client of this order")
    
    # Проверяем что заказ в правильном статусе
    if order.status not in [OrderStatus.PENDING, OrderStatus.ACCEPTED]:
        raise HTTPException(status_code=400, detail="Order is not in a valid state for payment")
    
    # Создаем idempotency key для ЮKassa
    idempotency_key = str(uuid.uuid4())
    
    # Подготавливаем данные для ЮKassa
    yookassa_data = {
        "amount": {
            "value": f"{request.amount:.2f}",
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": request.return_url or f"{os.getenv('FRONTEND_URL')}/orders/{order.id}/payment-success"
        },
        "capture": False,  # Двухстадийный платеж (холдирование)
        "description": request.description,
        "metadata": {
            "order_id": order.id,
            "user_id": str(current_user.id)
        }
    }
    
    # Если указан способ оплаты
    if request.payment_method != "bank_card":
        yookassa_data["payment_method_data"] = {
            "type": request.payment_method
        }
    
    try:
        # Отправляем запрос в ЮKassa
        response = requests.post(
            f"{YOOKASSA_API_URL}/payments",
            json=yookassa_data,
            auth=(YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY),
            headers={
                "Idempotence-Key": idempotency_key,
                "Content-Type": "application/json"
            }
        )
        
        response.raise_for_status()
        payment_data = response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"YooKassa API error: {str(e)}")
    
    # Создаем запись о платеже в БД
    payment = Payment(
        id=payment_data["id"],
        order_id=order.id,
        user_id=current_user.id,
        amount=request.amount,
        currency="RUB",
        status=PaymentStatus.PENDING,
        payment_method=request.payment_method,
        description=request.description,
        yookassa_data=payment_data
    )
    db.add(payment)
    
    # Создаем escrow транзакцию
    escrow = EscrowTransaction(
        payment_id=payment.id,
        order_id=order.id,
        client_id=current_user.id,
        specialist_id=order.specialist_id,
        amount=request.amount,
        commission=request.amount * 0.05,  # 5% комиссия
        status="held",
        held_at=datetime.utcnow()
    )
    db.add(escrow)
    
    db.commit()
    
    # Возвращаем данные
    return PaymentResponse(
        id=payment.id,
        status=payment.status,
        amount=payment.amount,
        currency=payment.currency,
        description=payment.description,
        confirmation_url=payment_data.get("confirmation", {}).get("confirmation_url"),
        created_at=payment.created_at
    )

@router.post("/webhook")
async def yookassa_webhook(
    webhook: PaymentWebhook,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Webhook от ЮKassa для обработки событий платежа
    
    События:
    - payment.succeeded: Платеж успешно выполнен
    - payment.canceled: Платеж отменен
    - payment.waiting_for_capture: Платеж ожидает подтверждения (холд)
    """
    
    event = webhook.event
    payment_data = webhook.object
    
    payment_id = payment_data.get("id")
    
    # Находим платеж в БД
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Обрабатываем событие
    if event == "payment.succeeded":
        # Платеж успешен - деньги на холде
        payment.status = PaymentStatus.SUCCEEDED
        payment.paid_at = datetime.utcnow()
        
        # Обновляем escrow
        escrow = db.query(EscrowTransaction).filter(EscrowTransaction.payment_id == payment_id).first()
        if escrow:
            escrow.status = "held"
            escrow.held_at = datetime.utcnow()
        
        # Обновляем статус заказа
        order = db.query(Order).filter(Order.id == payment.order_id).first()
        if order:
            order.status = OrderStatus.PAID
            order.paid_at = datetime.utcnow()
            
            # Отправляем уведомление специалисту
            background_tasks.add_task(
                send_payment_notification,
                order.specialist_id,
                order.id,
                payment.amount
            )
    
    elif event == "payment.canceled":
        # Платеж отменен
        payment.status = PaymentStatus.CANCELED
        payment.canceled_at = datetime.utcnow()
        
        escrow = db.query(EscrowTransaction).filter(EscrowTransaction.payment_id == payment_id).first()
        if escrow:
            escrow.status = "canceled"
    
    elif event == "payment.waiting_for_capture":
        # Платеж ожидает подтверждения
        payment.status = PaymentStatus.WAITING_FOR_CAPTURE
    
    db.commit()
    
    return {"status": "ok"}

@router.post("/{payment_id}/capture")
async def capture_payment(
    payment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Подтверждение платежа (capture) - перевод денег специалисту
    Вызывается после того как заказчик подтверждает выполнение работы
    """
    
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Проверяем права
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized")
    
    # Проверяем статус
    if payment.status != PaymentStatus.WAITING_FOR_CAPTURE:
        raise HTTPException(status_code=400, detail="Payment is not in waiting_for_capture status")
    
    try:
        # Отправляем запрос на capture в ЮKassa
        response = requests.post(
            f"{YOOKASSA_API_URL}/payments/{payment_id}/capture",
            auth=(YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY),
            headers={"Content-Type": "application/json"}
        )
        
        response.raise_for_status()
        capture_data = response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"YooKassa API error: {str(e)}")
    
    # Обновляем статус платежа
    payment.status = PaymentStatus.CAPTURED
    payment.captured_at = datetime.utcnow()
    
    # Обновляем escrow - деньги переведены специалисту
    escrow = db.query(EscrowTransaction).filter(EscrowTransaction.payment_id == payment_id).first()
    if escrow:
        escrow.status = "released"
        escrow.released_at = datetime.utcnow()
        
        # Начисляем деньги специалисту
        specialist_amount = escrow.amount - escrow.commission
        
        # TODO: Обновить баланс специалиста
        # specialist = db.query(User).filter(User.id == escrow.specialist_id).first()
        # specialist.balance += specialist_amount
    
    # Обновляем статус заказа
    order.status = OrderStatus.COMPLETED
    order.completed_at = datetime.utcnow()
    
    db.commit()
    
    return {"status": "captured", "amount": payment.amount}

@router.post("/{payment_id}/refund")
async def refund_payment(
    payment_id: str,
    reason: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Возврат платежа
    Вызывается если работа не выполнена или есть спор
    """
    
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Проверяем права (заказчик или администратор)
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if order.client_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="You are not authorized")
    
    # Проверяем что платеж можно вернуть
    if payment.status not in [PaymentStatus.SUCCEEDED, PaymentStatus.WAITING_FOR_CAPTURE]:
        raise HTTPException(status_code=400, detail="Payment cannot be refunded")
    
    try:
        # Отправляем запрос на возврат в ЮKassa
        response = requests.post(
            f"{YOOKASSA_API_URL}/refunds",
            json={
                "payment_id": payment_id,
                "amount": {
                    "value": f"{payment.amount:.2f}",
                    "currency": "RUB"
                },
                "description": reason
            },
            auth=(YOOKASSA_SHOP_ID, YOOKASSA_SECRET_KEY),
            headers={
                "Idempotence-Key": str(uuid.uuid4()),
                "Content-Type": "application/json"
            }
        )
        
        response.raise_for_status()
        refund_data = response.json()
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"YooKassa API error: {str(e)}")
    
    # Обновляем статус платежа
    payment.status = PaymentStatus.REFUNDED
    payment.refunded_at = datetime.utcnow()
    
    # Обновляем escrow
    escrow = db.query(EscrowTransaction).filter(EscrowTransaction.payment_id == payment_id).first()
    if escrow:
        escrow.status = "refunded"
        escrow.refunded_at = datetime.utcnow()
    
    # Обновляем статус заказа
    order.status = OrderStatus.CANCELED
    
    db.commit()
    
    return {"status": "refunded", "amount": payment.amount}

@router.get("/{payment_id}")
async def get_payment(
    payment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить информацию о платеже"""
    
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Проверяем права
    order = db.query(Order).filter(Order.id == payment.order_id).first()
    if order.client_id != current_user.id and order.specialist_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized")
    
    return payment

async def send_payment_notification(specialist_id: str, order_id: str, amount: float):
    """Отправка уведомления специалисту о поступлении оплаты"""
    # TODO: Интеграция с Push Notifications
    print(f"Sending payment notification to specialist {specialist_id} for order {order_id}, amount {amount}")




