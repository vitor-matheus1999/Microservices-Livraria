
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { Order, OrderStatus } from '../src/orders/entities/order.entity';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  // Mock do repositório TypeORM para evitar conexão com banco de dados real
  const mockOrderRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOneBy: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Order))
      .useValue(mockOrderRepository)
      .compile();

    app = moduleFixture.createNestApplication();

    // Configura os mesmos pipes do main.ts para simular o ambiente real
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/orders', () => {
    it('deve retornar lista vazia quando não há pedidos', () => {
      mockOrderRepository.find.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get('/api/orders')
        .expect(200)
        .expect([]);
    });
  });

  describe('POST /api/orders', () => {
    it('deve retornar 400 quando o body está vazio', () => {
      return request(app.getHttpServer())
        .post('/api/orders')
        .send({})
        .expect(400);
    });

    it('deve retornar 400 quando os itens estão vazios', () => {
      return request(app.getHttpServer())
        .post('/api/orders')
        .send({
          customerName: 'João',
          deliveryAddress: 'Rua Teste, 1',
          items: [],
        })
        .expect(400);
    });

    it('deve criar um pedido com dados válidos', () => {
      const createdOrder: Order = {
        id: 'uuid-e2e-001',
        customerName: 'João Silva',
        deliveryAddress: 'Rua das Flores, 123',
        items: [
          {
            productId: 'p1',
            productName: 'Produto 1',
            quantity: 2,
            unitPrice: 30.0,
          },
        ],
        totalAmount: 60.0,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockOrderRepository.create.mockReturnValue(createdOrder);
      mockOrderRepository.save.mockResolvedValue(createdOrder);

      return request(app.getHttpServer())
        .post('/api/orders')
        .send({
          customerName: 'João Silva',
          deliveryAddress: 'Rua das Flores, 123',
          items: [
            {
              productId: 'p1',
              productName: 'Produto 1',
              quantity: 2,
              unitPrice: 30.0,
            },
          ],
        })
        .expect(201)
        .expect((res: { body: { customerName: string; id: string } }) => {
          expect(res.body.customerName).toBe('João Silva');
          expect(res.body.id).toBe('uuid-e2e-001');
        });
    });
  });

  describe('GET /api/orders/:id', () => {
    it('deve retornar 404 quando o pedido não existe', () => {
      mockOrderRepository.findOneBy.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/api/orders/id-inexistente')
        .expect(404);
    });
  });
});
