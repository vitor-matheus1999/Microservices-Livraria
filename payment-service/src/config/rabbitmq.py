import os
import time

import pika
from dotenv import load_dotenv

from utils.logger import get_logger

load_dotenv()

logger = get_logger("config.rabbitmq")

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672")
RABBITMQ_EXCHANGE = os.getenv("RABBITMQ_EXCHANGE", "orders.exchange")
RABBITMQ_ROUTING_KEY = os.getenv("RABBITMQ_ROUTING_KEY", "order.created")

ORDER_CREATED_QUEUE = "payment.process.order_created"
PAYMENT_RESULT_QUEUE = "payment.process.payment_results"
PAYMENT_CONFIRMED_ROUTING_KEY = "payment.confirmed"
PAYMENT_FAILED_ROUTING_KEY = "payment.failed"
EXCHANGE_TYPE = "topic"
MAX_RETRIES = 10
RETRY_DELAY_SECONDS = 5


def _build_parameters() -> pika.URLParameters:
    params = pika.URLParameters(RABBITMQ_URL)
    params.heartbeat = 60
    params.blocked_connection_timeout = 30
    return params


def create_connection() -> pika.BlockingConnection:
    params = _build_parameters()
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(f"Connecting to RabbitMQ (attempt {attempt}/{MAX_RETRIES})...")
            connection = pika.BlockingConnection(params)
            logger.info("Connected to RabbitMQ successfully.")
            return connection
        except Exception as exc:
            logger.warning(f"Connection failed: {exc}. Retrying in {RETRY_DELAY_SECONDS}s...")
            if attempt == MAX_RETRIES:
                raise
            time.sleep(RETRY_DELAY_SECONDS)
    raise RuntimeError("Failed to connect to RabbitMQ.")


def _declare_exchange(channel) -> None:
    channel.exchange_declare(exchange=RABBITMQ_EXCHANGE, exchange_type=EXCHANGE_TYPE, durable=True)
    logger.info(f"Exchange declared: '{RABBITMQ_EXCHANGE}' (type={EXCHANGE_TYPE})")


def _declare_order_created_queue(channel) -> None:
    channel.queue_declare(queue=ORDER_CREATED_QUEUE, durable=True)
    logger.info(f"Queue declared: '{ORDER_CREATED_QUEUE}'")


def _bind_order_created_queue(channel) -> None:
    channel.queue_bind(
        queue=ORDER_CREATED_QUEUE,
        exchange=RABBITMQ_EXCHANGE,
        routing_key=RABBITMQ_ROUTING_KEY,
    )
    logger.info(
        f"Queue '{ORDER_CREATED_QUEUE}' bound with routing key '{RABBITMQ_ROUTING_KEY}'"
    )


def _declare_payment_result_queue(channel) -> None:
    channel.queue_declare(queue=PAYMENT_RESULT_QUEUE, durable=True)
    logger.info(f"Queue declared: '{PAYMENT_RESULT_QUEUE}'")


def _bind_payment_result_queue(channel) -> None:
    channel.queue_bind(
        queue=PAYMENT_RESULT_QUEUE,
        exchange=RABBITMQ_EXCHANGE,
        routing_key=PAYMENT_CONFIRMED_ROUTING_KEY,
    )
    channel.queue_bind(
        queue=PAYMENT_RESULT_QUEUE,
        exchange=RABBITMQ_EXCHANGE,
        routing_key=PAYMENT_FAILED_ROUTING_KEY,
    )
    logger.info(
        f"Queue '{PAYMENT_RESULT_QUEUE}' bound with routing keys "
        f"'{PAYMENT_CONFIRMED_ROUTING_KEY}' and '{PAYMENT_FAILED_ROUTING_KEY}'"
    )


def setup_topology(channel) -> None:
    _declare_exchange(channel)
    _declare_order_created_queue(channel)
    _bind_order_created_queue(channel)
    _declare_payment_result_queue(channel)
    _bind_payment_result_queue(channel)
