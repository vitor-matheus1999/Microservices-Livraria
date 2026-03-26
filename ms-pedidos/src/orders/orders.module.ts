import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { LoggerService } from '../common/logger/logger.service';
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [TypeOrmModule.forFeature([Order]), HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, LoggerService],
})
export class OrdersModule {}
