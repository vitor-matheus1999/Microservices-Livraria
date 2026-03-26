const {
  PAYMENT_CONFIRMED_ROUTING_KEY,
  PAYMENT_FAILED_ROUTING_KEY,
  buildEmailPayload
} = require('../services/emailTemplateService');
const { createRabbitConnectionAndChannel } = require('../config/rabbit');
const logger = require('../utils/logger');

async function startPaymentResultConsumer() {
  const exchangeName = process.env.RABBITMQ_EXCHANGE;
  const queueName = process.env.PAYMENT_RESULT_QUEUE || 'payment.process.payment_results';

  if (!exchangeName) {
    throw new Error('Variavel RABBITMQ_EXCHANGE nao configurada.');
  }

  const { connection, channel } = await createRabbitConnectionAndChannel();

  // Garante que a exchange existe antes de fazer o bind
  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchangeName, PAYMENT_CONFIRMED_ROUTING_KEY);
  await channel.bindQueue(queueName, exchangeName, PAYMENT_FAILED_ROUTING_KEY);

  logger.info(
    {
      queueName,
      exchangeName,
      routingKeys: [PAYMENT_CONFIRMED_ROUTING_KEY, PAYMENT_FAILED_ROUTING_KEY]
    },
    'Fila declarada e bindings configurados'
  );

  await channel.consume(queueName, async (message) => {
    if (!message) {
      return;
    }

    try {
      const routingKey = message.fields.routingKey;
      const content = message.content.toString();
      const payload = JSON.parse(content);

      logger.info(
        {
          queueName,
          exchangeName,
          routingKey,
          rawMessage: content
        },
        `Mensagem consumida da fila. Exchange: ${exchangeName}, Routing Key: ${routingKey}`
      );

      const emailPayload = buildEmailPayload(routingKey, payload);

      logger.info(
        {
          exchangeName,
          routingKey,
          emailPayload,
          prettyPayload: JSON.stringify(emailPayload, null, 2)
        },
        `Email payload gerado (pronto para envio). Exchange: ${exchangeName}, Routing Key: ${routingKey}`
      );
    } catch (error) {
      logger.error({ error }, 'Falha ao processar mensagem');
    } finally {
      channel.ack(message);
    }
  });

  logger.info({ queueName }, 'Consumer iniciado e aguardando mensagens');

  return { connection, channel };
}

module.exports = {
  startPaymentResultConsumer
};
