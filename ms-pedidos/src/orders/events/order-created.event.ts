import { Order } from '../entities/order.entity';

export type OrderCreatedEvent = {
  eventType: 'order.created';
  source: 'livraria-online.order-service';
  occurredAt: string;
  data: {
    orderId: string;
    customerName: string;
    items: Order['items'];
    totalAmount: number;
    status: 'PENDING_PAYMENT';
    paymentToken: string;
  };
};

export function buildOrderCreatedEvent(
  order: Order,
  paymentToken: string,
): OrderCreatedEvent {
  return {
    eventType: 'order.created',
    source: 'livraria-online.order-service',
    occurredAt: new Date().toISOString(),
    data: {
      orderId: order.id,
      customerName: order.customerName,
      items: order.items,
      totalAmount: Number(order.totalAmount),
      status: 'PENDING_PAYMENT',
      paymentToken,
    },
  };
}
