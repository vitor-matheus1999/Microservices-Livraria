import random
from datetime import datetime, timezone

from utils.logger import get_logger

logger = get_logger("services.payment_processor")

PAYMENT_METHODS = ["Pix", "PayPal", "Credit Card", "Debit Card"]
SUCCESS_RATE = 0.80


def _pick_method() -> str:
    return random.choice(PAYMENT_METHODS)


def _determine_status() -> str:
    return "confirmed" if random.random() < SUCCESS_RATE else "failed"


def process_payment(order: dict) -> tuple[str, dict]:
    order_id = order["orderId"]
    method = _pick_method()
    status = _determine_status()

    result = {
        "orderId": order_id,
        "paymentMethod": method,
        "status": status,
        "processedAt": datetime.now(timezone.utc).isoformat(),
    }

    logger.info(f"Payment processed: orderId={order_id}, method={method}, status={status}")
    return f"payment.{status}", result
