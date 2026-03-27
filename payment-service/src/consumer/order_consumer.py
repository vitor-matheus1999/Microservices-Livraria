import json

import pika
from pika.spec import Basic, BasicProperties

from config.rabbitmq import ORDER_CREATED_QUEUE, RABBITMQ_EXCHANGE
from models.order_created_event import OrderCreatedEvent
from producer.payment_publisher import publish_payment_result
from services.payment_processor import process_payment
from utils.logger import get_logger

logger = get_logger("consumer.order_consumer")


def _parse_body(body: bytes) -> dict | None:
    try:
        raw = json.loads(body)
        event = OrderCreatedEvent.from_dict(raw)
        return {
            "orderId": event.data.orderId,
            "customerName": event.data.customerName,
            "amount": event.data.amount,
            "status": event.data.status,
            "paymentToken": event.data.paymentToken,
            "items": [vars(i) for i in event.data.items],
        }
    except (json.JSONDecodeError, KeyError) as exc:
        logger.error(f"Invalid message — discarding: {exc}")
        return None


def _validate_order(order: dict) -> bool:
    required = {"orderId", "amount"}
    missing = required - order.keys()
    if missing:
        logger.error(f"Missing fields {missing} — discarding message")
        return False
    return True


def _process_and_publish(channel, order: dict) -> None:
    routing_key, result = process_payment(order)
    publish_payment_result(channel, RABBITMQ_EXCHANGE, routing_key, result)


def _on_message(channel, method: Basic.Deliver, properties: BasicProperties, body: bytes) -> None:
    order = _parse_body(body)
    if order is None:
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        return

    logger.info(f"Message received: orderId={order.get('orderId')}, routing_key={method.routing_key}")

    if not _validate_order(order):
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        return

    try:
        _process_and_publish(channel, order)
        channel.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as exc:
        logger.error(f"Error processing orderId={order.get('orderId')}: {exc}", exc_info=True)
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def start_consuming(channel) -> None:
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=ORDER_CREATED_QUEUE, on_message_callback=_on_message)
    logger.info(
        f"Waiting for messages on queue '{ORDER_CREATED_QUEUE}'. Press CTRL+C to exit."
    )
    channel.start_consuming()
