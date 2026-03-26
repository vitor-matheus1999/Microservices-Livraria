import json

import pika

from utils.logger import get_logger

logger = get_logger("producer.payment_publisher")


def publish_payment_result(channel, exchange: str, routing_key: str, payload: dict) -> None:
    logger.info(
        f"[PRE-PUBLISH] Enviando mensagem para exchange='{exchange}', routing_key='{routing_key}', payload={json.dumps(payload)}"
    )
    channel.basic_publish(
        exchange=exchange,
        routing_key=routing_key,
        body=json.dumps(payload),
        properties=pika.BasicProperties(
            content_type="application/json",
            delivery_mode=2,
        ),
    )
    logger.info(
        f"[POST-PUBLISH] Mensagem publicada com sucesso: exchange='{exchange}', routing_key='{routing_key}', payload={json.dumps(payload)}"
    )
