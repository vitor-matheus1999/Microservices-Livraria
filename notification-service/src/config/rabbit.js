const amqp = require('amqplib');
const logger = require('../utils/logger');

const RETRY_INTERVAL_MS = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createRabbitConnectionAndChannel() {
  const rabbitmqUrl = process.env.RABBITMQ_URL;

  if (!rabbitmqUrl) {
    throw new Error('Variavel RABBITMQ_URL nao configurada.');
  }

  while (true) {
    try {
      logger.info({ rabbitmqUrl }, 'Conectando ao RabbitMQ');

      const connection = await amqp.connect(rabbitmqUrl);
      const channel = await connection.createChannel();

      connection.on('error', (error) => {
        logger.error({ error }, 'Erro na conexao com RabbitMQ');
      });

      connection.on('close', () => {
        logger.warn('Conexao com RabbitMQ encerrada');
      });

      logger.info('Conexao com RabbitMQ estabelecida com sucesso');
      return { connection, channel };
    } catch (error) {
      logger.warn(
        { error, retryInMs: RETRY_INTERVAL_MS },
        'RabbitMQ indisponivel. Tentando novamente...'
      );

      await sleep(RETRY_INTERVAL_MS);
    }
  }
}

module.exports = {
  createRabbitConnectionAndChannel
};
