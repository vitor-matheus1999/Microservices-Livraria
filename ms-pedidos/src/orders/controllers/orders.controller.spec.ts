import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from '../services/orders.service';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  const mockOrder: Order = {
    id: 'uuid-456',
    customerName: 'Ana Costa',
    deliveryAddress: 'Rua Verde, 456 - Curitiba/PR',
    items: [
      {
        productId: 'prod-002',
        productName: 'Produto B',
        quantity: 1,
        unitPrice: 200.0,
      },
    ],
    totalAmount: 200.0,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  };

  const createOrderDto: CreateOrderDto = {
    customerID: 1,
    deliveryAddress: 'Rua Verde, 456 - Curitiba/PR',
    items: [
      {
        productId: 'prod-002',
        productName: 'Produto B',
        quantity: 1,
        unitPrice: 200.0,
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get(OrdersService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /orders - create', () => {
    it('deve criar um pedido e retorná-lo', async () => {
      service.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto, '');

      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('GET /orders - findAll', () => {
    it('deve retornar a lista de pedidos', async () => {
      service.findAll.mockResolvedValue([mockOrder]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockOrder);
    });
  });

  describe('GET /orders/:id - findOne', () => {
    it('deve retornar um pedido pelo ID', async () => {
      service.findById.mockResolvedValue(mockOrder);

      const result = await controller.findOne('uuid-456');

      expect(service.findById).toHaveBeenCalledWith('uuid-456');
      expect(result).toEqual(mockOrder);
    });
  });
});
