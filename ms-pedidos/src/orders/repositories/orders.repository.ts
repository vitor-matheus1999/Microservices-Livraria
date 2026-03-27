import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Pedido com ID "${id}" não encontrado`);
    }

    return order;
  }

  async create(
    createOrderDto: CreateOrderDto,
    totalAmount: number,
    userName: string ,
  ): Promise<Order> {
    const order = this.orderRepository.create({
      customerName: userName,
      deliveryAddress: createOrderDto.deliveryAddress,
      items: createOrderDto.items,
      totalAmount,
    });

    return this.orderRepository.save(order);
  }
}
