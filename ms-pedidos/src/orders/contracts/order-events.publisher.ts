import { Order } from '../entities/order.entity';

// Token de injeção para desacoplar o service da implementação RabbitMQ.
export const ORDER_EVENTS_PUBLISHER = 'ORDER_EVENTS_PUBLISHER';

// Contrato da porta de eventos de pedidos (arquitetura limpa).
export interface OrderEventsPublisher {
  publishOrderCreated(order: Order, paymentToken: string): Promise<void>;
}
