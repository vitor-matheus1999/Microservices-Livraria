import { Injectable, Inject } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { LoggerService } from '../../common/logger/logger.service';
import { OrderEventsPublisher, ORDER_EVENTS_PUBLISHER } from '../contracts/order-events.publisher';
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    @Inject(ORDER_EVENTS_PUBLISHER)
    private readonly orderEventsPublisher: OrderEventsPublisher
  ) {}

  async findAll(): Promise<Order[]> {
    this.logger.log('Buscando todos os pedidos', OrdersService.name);
    return this.ordersRepository.findAll();
  }

  async findById(id: string): Promise<Order> {
    this.logger.log(`Buscando pedido com ID: ${id}`, OrdersService.name);
    return this.ordersRepository.findById(id);
  }

  async create(createOrderDto: CreateOrderDto, token: string): Promise<Order> {
    this.logger.log(
        `Criando novo pedido para: ${createOrderDto.customerID}`,
        OrdersService.name,
    );

    const totalAmount = this.calculateTotal(createOrderDto);
    const response = await firstValueFrom(
        this.httpService.get(`http://ms-customers:8080/api/customer?id=${createOrderDto.customerID}`));


    this.logger.log(`response: ${response}`);

    const order = await this.ordersRepository.create(createOrderDto, totalAmount,  response.data.firstName);

    this.logger.log(
        `Pedido criado com sucesso. ID: ${order.id}`,
        OrdersService.name,
    );

    // Envia evento para o RabbitMQ após gravar o pedido
    const paymentToken = 'token-teste'; // Substitua por lógica real se necessário
    try {
      await this.orderEventsPublisher.publishOrderCreated(order, paymentToken);
    } catch (err) {
      this.logger.error('Falha ao publicar evento order.created', String(err), OrdersService.name);
    }

    return order;
  }

  async findBook(token: string) {
    const response = await fetch('https://localhost:8080/book/1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return data.title;
  }

  private calculateTotal(createOrderDto: CreateOrderDto): number {
    return createOrderDto.items.reduce((total, item) => {
      return total + item.quantity * item.unitPrice;
    }, 0);
  }
}
