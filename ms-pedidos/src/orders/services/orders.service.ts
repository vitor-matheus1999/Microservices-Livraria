import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrdersRepository } from '../repositories/orders.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { LoggerService } from '../../common/logger/logger.service';
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
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
        this.httpService.get(`http://localhost:8181/usuarios/${createOrderDto.customerID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }));
    const order = await this.ordersRepository.create(createOrderDto,  response.data.nome, totalAmount);

    this.logger.log(
        `Pedido criado com sucesso. ID: ${order.id}`,
        OrdersService.name,
    );

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
