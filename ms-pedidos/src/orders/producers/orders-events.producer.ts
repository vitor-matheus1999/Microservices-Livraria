import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelModel, connect } from 'amqplib';
import { OrderEventsPublisher } from '../contracts/order-events.publisher';
import { Order } from '../entities/order.entity';
import { buildOrderCreatedEvent } from '../events/order-created.event';

// Producer responsavel por publicar eventos do dominio de pedidos no RabbitMQ.
@Injectable()
export class OrdersEventsProducer implements OrderEventsPublisher, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrdersEventsProducer.name);
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const rabbitUrl = this.configService.get<string>('rabbitmq.url');

    if (!rabbitUrl) {
      this.logger.warn('RabbitMQ URL nao configurada. Eventos nao serao publicados.');
      return;
    }

    try {
      this.connection = await connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      const exchange = this.getExchange();
      await this.channel.assertExchange(exchange, 'topic', { durable: true });

      this.logger.log(`Conectado ao RabbitMQ. Exchange: ${exchange}`);
    } catch (error) {
      this.logger.error('Falha ao conectar no RabbitMQ. O fluxo HTTP continuara funcionando.', String(error));
      this.connection = null;
      this.channel = null;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  async publishOrderCreated(order: Order, paymentToken: string): Promise<void> {
    if (!this.channel) {
      this.logger.warn('Canal do RabbitMQ indisponivel. Evento order.created nao publicado.');
      return;
    }

    const exchange = this.getExchange();
    const routingKey = this.getRoutingKey();
    const event = buildOrderCreatedEvent(order, paymentToken);

    // Log detalhado antes do envio
    this.logger.log('[RabbitMQ] Preparando envio de mensagem', OrdersEventsProducer.name);
    this.logger.log(`[RabbitMQ] Exchange: ${exchange}`, OrdersEventsProducer.name);
    this.logger.log(`[RabbitMQ] Routing Key: ${routingKey}`, OrdersEventsProducer.name);
    this.logger.log(`[RabbitMQ] Payload: ${JSON.stringify(event)}`, OrdersEventsProducer.name);

    try {
      this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        {
          contentType: 'application/json',
          persistent: true,
        }
      );
      this.logger.log(`[RabbitMQ] Mensagem publicada com sucesso para pedido ${order.id}`, OrdersEventsProducer.name);
    } catch (error) {
      this.logger.error(`[RabbitMQ] Falha ao publicar mensagem para pedido ${order.id}: ${String(error)}`, undefined, OrdersEventsProducer.name);
    }
  }

  private getExchange(): string {
    return this.configService.get<string>('rabbitmq.exchange') ?? 'orders.exchange';
  }

  private getRoutingKey(): string {
    return this.configService.get<string>('rabbitmq.routingKey') ?? 'order.created';
  }
}
