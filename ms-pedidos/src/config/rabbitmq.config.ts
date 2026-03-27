import { registerAs } from '@nestjs/config';

// Configuracoes do RabbitMQ para publicacao de eventos de dominio.
export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672',
  exchange: process.env.RABBITMQ_EXCHANGE ?? 'orders.exchange',
  routingKey: process.env.RABBITMQ_ROUTING_KEY ?? 'order.created',
}));
