from dotenv import load_dotenv

load_dotenv()

from config.rabbitmq import create_connection, setup_topology
from consumer.order_consumer import start_consuming
from utils.logger import get_logger

logger = get_logger("main")


def main() -> None:
    logger.info("payment-service starting up...")
    connection = create_connection()
    channel = connection.channel()
    setup_topology(channel)
    start_consuming(channel)


if __name__ == "__main__":
    main()
