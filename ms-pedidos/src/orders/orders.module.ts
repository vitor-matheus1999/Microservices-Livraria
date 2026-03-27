import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { LoggerService } from '../common/logger/logger.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OrdersEventsProducer } from './producers/orders-events.producer';
import { ORDER_EVENTS_PUBLISHER } from './contracts/order-events.publisher';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), HttpModule, ConfigModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository,
    LoggerService,
    {
      provide: ORDER_EVENTS_PUBLISHER,
      useClass: OrdersEventsProducer,
    },
  ],
})
export class OrdersModule {}
