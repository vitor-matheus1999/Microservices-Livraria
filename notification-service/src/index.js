require('dotenv').config();

const logger = require('./utils/logger');
const { startPaymentResultConsumer } = require('./consumers/paymentResultConsumer');

let rabbitConnection;
let rabbitChannel;

async function bootstrap() {
  try {
    const rabbitResources = await startPaymentResultConsumer();
    rabbitConnection = rabbitResources.connection;
    rabbitChannel = rabbitResources.channel;

    logger.info('Servico de consumo de resultados de pagamento iniciado');
  } catch (error) {
    logger.fatal({ error }, 'Erro ao iniciar aplicacao');
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info({ signal }, 'Encerrando aplicacao');

  try {
    if (rabbitChannel) {
      await rabbitChannel.close();
    }

    if (rabbitConnection) {
      await rabbitConnection.close();
    }

    logger.info('Aplicacao encerrada com sucesso');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Erro durante encerramento da aplicacao');
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

bootstrap();
