import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersRepository } from '../repositories/orders.repository';
import { LoggerService } from '../../common/logger/logger.service';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: jest.Mocked<OrdersRepository>;


  const mockOrder: Order = {
    id: 'uuid-123',
    customerName: 'João Silva',
    deliveryAddress: 'Rua das Flores, 123 - São Paulo/SP',
    items: [
      {
        productId: 'prod-001',
        productName: 'Produto Teste',
        quantity: 2,
        unitPrice: 50.0,
      },
    ],
    totalAmount: 100.0,
    status: OrderStatus.PENDING,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const createOrderDto: CreateOrderDto = {
    customerName: 'João Silva',
    deliveryAddress: 'Rua das Flores, 123 - São Paulo/SP',
    items: [
      {
        productId: 'prod-001',
        productName: 'Produto Teste',
        quantity: 2,
        unitPrice: 50.0,
      },
    ],
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,

          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get(OrdersRepository);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de pedidos', async () => {

      repository.findAll.mockResolvedValue([mockOrder]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockOrder);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar uma lista vazia quando não há pedidos', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve retornar um pedido quando encontrado', async () => {
      repository.findById.mockResolvedValue(mockOrder);

      const result = await service.findById('uuid-123');

      expect(result).toEqual(mockOrder);
      expect(repository.findById).toHaveBeenCalledWith('uuid-123');
    });

    it('deve lançar NotFoundException quando o pedido não existe', async () => {
      repository.findById.mockRejectedValue(
        new NotFoundException('Pedido não encontrado'),
      );

      await expect(service.findById('id-invalido')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('deve criar um pedido e calcular o valor total corretamente', async () => {
      repository.create.mockResolvedValue(mockOrder);

      const result = await service.create(createOrderDto);

      expect(repository.create).toHaveBeenCalledWith(createOrderDto, 100.0);
      expect(result).toEqual(mockOrder);
    });

    it('deve calcular o total corretamente com múltiplos itens', async () => {
      const dtoComMultiplosItens: CreateOrderDto = {
        customerName: 'Maria',
        deliveryAddress: 'Av. Paulista, 1000',
        items: [
          { productId: 'p1', productName: 'Item 1', quantity: 3, unitPrice: 10.0 },
          { productId: 'p2', productName: 'Item 2', quantity: 1, unitPrice: 25.0 },
        ],
      };

      repository.create.mockResolvedValue({ ...mockOrder, totalAmount: 55.0 });

      await service.create(dtoComMultiplosItens);

      expect(repository.create).toHaveBeenCalledWith(dtoComMultiplosItens, 55.0);
    });
  });
});
