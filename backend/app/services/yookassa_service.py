"""
YooKassa Payment Service для STROYKA
Полная интеграция эскроу-платежей из D:\Пиица
"""

import asyncio
import functools
import json
import logging
from uuid import uuid4
from typing import Optional, Dict, Any

import requests
from requests.exceptions import HTTPError as RequestsHTTPError
from yookassa import Payment as YKPayment, Configuration, Refund

from backend.settings import settings

log = logging.getLogger("yookassa")

# Конфигурация YooKassa
Configuration.account_id = settings.YOOKASSA_SHOP_ID
Configuration.secret_key = settings.YOOKASSA_SECRET_KEY


class YooKassaError(Exception):
    """Базовый класс для ошибок YooKassa."""
    def __init__(
        self, 
        message: str, 
        code: Optional[str] = None,
        status_code: Optional[int] = None, 
        response: Optional[requests.Response] = None
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.response = response


def _safe_yk_create(payload: dict, idempotency_key: str) -> dict:
    """
    Синхронная обёртка над YKPayment.create с полным перехватом ошибок.
    
    YooKassa SDK может выбросить HTTPError из requests при логировании ответа,
    поэтому нужно перехватывать исключения на этом уровне.
    """
    try:
        obj = YKPayment.create(payload, idempotency_key=idempotency_key)
        # Используем json() для получения правильной структуры ответа
        if hasattr(obj, 'json'):
            return json.loads(obj.json())
        elif hasattr(obj, 'dict'):
            return obj.dict()
        else:
            return obj.__dict__
    except requests.exceptions.HTTPError as e:
        response = getattr(e, 'response', None)
        status_code = response.status_code if response is not None else None
        
        error_code = None
        error_message = str(e)
        if response is not None:
            try:
                error_data = response.json()
                error_code = error_data.get('code') or error_data.get('type')
                error_message = error_data.get('description') or error_data.get('message') or str(e)
            except (ValueError, AttributeError):
                error_message = response.text[:500] if response.text else str(e)
        
        log.error(f"YooKassa HTTP error: status={status_code}, code={error_code}, message={error_message}")
        raise YooKassaError(
            message=error_message,
            code=error_code,
            status_code=status_code,
            response=response
        ) from e
    except Exception as e:
        error_type = type(e).__name__
        
        if hasattr(e, 'code') and hasattr(e, 'description'):
            raise YooKassaError(
                message=getattr(e, 'description', None) or str(e),
                code=getattr(e, 'code', None),
                status_code=getattr(getattr(e, 'response', None), 'status_code', None),
                response=getattr(e, 'response', None)
            ) from e
        
        log.error(f"Unexpected error in YooKassa SDK ({error_type}): {str(e)}", exc_info=True)
        raise YooKassaError(message=f"Ошибка платежной системы: {str(e)}", code="SDK_ERROR") from e


def _safe_yk_find_one(payment_id: str) -> dict:
    """Синхронная обёртка над YKPayment.find_one с полным перехватом ошибок."""
    try:
        obj = YKPayment.find_one(payment_id)
        if hasattr(obj, 'json'):
            return json.loads(obj.json())
        elif hasattr(obj, 'dict'):
            return obj.dict()
        else:
            return obj.__dict__
    except requests.exceptions.HTTPError as e:
        response = getattr(e, 'response', None)
        status_code = response.status_code if response is not None else None
        
        error_code = None
        error_message = str(e)
        if response is not None:
            try:
                error_data = response.json()
                error_code = error_data.get('code') or error_data.get('type')
                error_message = error_data.get('description') or error_data.get('message') or str(e)
            except (ValueError, AttributeError):
                error_message = response.text[:500] if response.text else str(e)
        
        log.error(f"YooKassa HTTP error (find_one): status={status_code}, code={error_code}, message={error_message}")
        raise YooKassaError(
            message=error_message,
            code=error_code,
            status_code=status_code,
            response=response
        ) from e
    except Exception as e:
        error_type = type(e).__name__
        
        if hasattr(e, 'code') and hasattr(e, 'description'):
            raise YooKassaError(
                message=getattr(e, 'description', None) or str(e),
                code=getattr(e, 'code', None),
                status_code=getattr(getattr(e, 'response', None), 'status_code', None),
                response=getattr(e, 'response', None)
            ) from e
        
        log.error(f"Unexpected error in YooKassa SDK find_one ({error_type}): {str(e)}", exc_info=True)
        raise YooKassaError(message=f"Ошибка платежной системы: {str(e)}", code="SDK_ERROR") from e


def _safe_yk_capture(payment_id: str, amount: Optional[Dict[str, str]] = None) -> dict:
    """Синхронная обёртка над YKPayment.capture."""
    try:
        payload = {}
        if amount:
            payload["amount"] = amount
            
        obj = YKPayment.capture(payment_id, payload)
        if hasattr(obj, 'json'):
            return json.loads(obj.json())
        elif hasattr(obj, 'dict'):
            return obj.dict()
        else:
            return obj.__dict__
    except Exception as e:
        log.error(f"Error capturing payment {payment_id}: {str(e)}", exc_info=True)
        raise YooKassaError(message=f"Ошибка capture платежа: {str(e)}") from e


def _safe_yk_refund(payment_id: str, amount: Dict[str, str], reason: str) -> dict:
    """Синхронная обёртка над Refund.create."""
    try:
        payload = {
            "payment_id": payment_id,
            "amount": amount,
            "description": reason
        }
        
        obj = Refund.create(payload, idempotency_key=str(uuid4()))
        if hasattr(obj, 'json'):
            return json.loads(obj.json())
        elif hasattr(obj, 'dict'):
            return obj.dict()
        else:
            return obj.__dict__
    except Exception as e:
        log.error(f"Error refunding payment {payment_id}: {str(e)}", exc_info=True)
        raise YooKassaError(message=f"Ошибка возврата платежа: {str(e)}") from e


async def create_payment_by_token(
    *,
    amount: str,
    description: str,
    payment_token: str,
    metadata: Optional[dict] = None,
    capture: bool = False,  # False = холдирование (эскроу)
    receipt: Optional[dict] = None,
    customer_email: Optional[str] = None,
    customer_phone: Optional[str] = None,
    return_url: Optional[str] = None
) -> dict:
    """
    Создать платёж по payment_token (мобильные SDK).
    
    Args:
        amount: Сумма в рублях (строка, например "1500.00")
        description: Описание платежа
        payment_token: Токен от мобильного SDK
        metadata: Дополнительные данные (order_id, user_id и т.д.)
        capture: False = холдирование, True = сразу списать
        receipt: Чек (обязателен по 54-ФЗ)
        customer_email: Email клиента
        customer_phone: Телефон клиента
        return_url: URL возврата после оплаты
        
    Returns:
        dict: Данные платежа из YooKassa
    """
    payload = {
        "payment_token": payment_token,
        "amount": {"value": amount, "currency": "RUB"},
        "capture": capture,  # False = эскроу (холдирование)
        "description": description,
        "metadata": metadata or {},
    }
    
    # Добавляем confirmation для redirect (нужен для СБП)
    if return_url:
        payload["confirmation"] = {
            "type": "redirect",
            "return_url": return_url
        }
    
    # Добавляем чек (receipt) — ОБЯЗАТЕЛЬНО по 54-ФЗ
    if receipt:
        payload["receipt"] = receipt
    else:
        # Создаём минимальный чек с одной позицией
        customer_data = {}
        if customer_phone:
            customer_data["phone"] = customer_phone
        if customer_email:
            customer_data["email"] = customer_email
        if not customer_data:
            customer_data["email"] = "customer@stroyka.ru"
        
        payload["receipt"] = {
            "customer": customer_data,
            "items": [
                {
                    "description": description[:128] if description else "Услуга специалиста",
                    "quantity": "1.00",
                    "amount": {"value": amount, "currency": "RUB"},
                    "vat_code": 1,  # НДС не облагается
                    "payment_subject": "service",  # услуга
                    "payment_mode": "full_payment",
                }
            ]
        }
    
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        functools.partial(_safe_yk_create, payload, str(uuid4()))
    )


async def get_payment(payment_id: str) -> dict:
    """Получить информацию о платеже из YooKassa."""
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        functools.partial(_safe_yk_find_one, payment_id)
    )


async def capture_payment(payment_id: str, amount: Optional[Dict[str, str]] = None) -> dict:
    """
    Capture (списание) холдированного платежа.
    Вызывается после выполнения работ специалистом.
    
    Args:
        payment_id: ID платежа в YooKassa
        amount: Сумма для списания (если None, списывается вся сумма)
        
    Returns:
        dict: Обновлённые данные платежа
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        functools.partial(_safe_yk_capture, payment_id, amount)
    )


async def refund_payment(payment_id: str, amount: Dict[str, str], reason: str) -> dict:
    """
    Возврат платежа (при споре или отмене).
    
    Args:
        payment_id: ID платежа в YooKassa
        amount: Сумма возврата {"value": "1500.00", "currency": "RUB"}
        reason: Причина возврата
        
    Returns:
        dict: Данные возврата
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        functools.partial(_safe_yk_refund, payment_id, amount, reason)
    )


# Пример использования:
"""
# 1. Создание платежа с холдированием (эскроу)
payment = await create_payment_by_token(
    amount="5000.00",
    description="Ремонт квартиры - заказ #123",
    payment_token="token_from_mobile_sdk",
    metadata={"order_id": 123, "user_id": 456},
    capture=False,  # Холдирование!
    customer_email="client@example.com",
    return_url="stroyka://payment/success"
)

# 2. После выполнения работ - capture
captured = await capture_payment(payment["id"])

# 3. Или возврат при споре
refunded = await refund_payment(
    payment["id"],
    {"value": "5000.00", "currency": "RUB"},
    "Работы не выполнены"
)
"""

