import json

import pika
from pika.spec import Basic, BasicProperties

from config.rabbitmq import ORDER_CREATED_QUEUE, RABBITMQ_EXCHANGE
from producer.payment_publisher import publish_payment_result
from services.payment_processor import process_payment
from utils.logger import get_logger

logger = get_logger("consumer.order_consumer")

REQUIRED_FIELDS = {"orderId", "customerEmail", "amount"}


def _parse_body(body: bytes) -> dict | None:
    try:
        return json.loads(body)
    except json.JSONDecodeError as exc:
        logger.error(f"Invalid JSON — discarding message: {exc}")
        return None


def _validate_order(order: dict) -> bool:
    missing = REQUIRED_FIELDS - order.keys()
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
