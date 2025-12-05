import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { CheckoutController } from '../src/checkouts/checkout.controller';
import { CreateCheckoutUseCase } from '../src/checkouts/useCases/create-checkout.usecase';
import { GetCheckoutUseCase } from '../src/checkouts/useCases/get-checkout.usecase';
import { UpdateCheckoutUseCase } from '../src/checkouts/useCases/update-checkout.usecase';

describe('CheckoutController (e2e)', () => {
  let app: INestApplication;
  let createCheckoutUseCase: CreateCheckoutUseCase;
  let getCheckoutUseCase: GetCheckoutUseCase;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [
        {
          provide: CreateCheckoutUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetCheckoutUseCase,
          useValue: {
            execute: jest.fn(),
          },
        }, {
          provide: UpdateCheckoutUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    createCheckoutUseCase = moduleFixture.get(CreateCheckoutUseCase);
    getCheckoutUseCase = moduleFixture.get(GetCheckoutUseCase);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST checkouts (deve criar um checkout)', async () => {
    const mockCheckout = { id: 'abc123', status: 'PENDING' };
    (createCheckoutUseCase.execute as jest.Mock).mockResolvedValue(mockCheckout);

    return request(app.getHttpServer())
      .post('/checkouts')
      .send({ amount: 100 })
      .expect(201)
      .expect({
        checkoutId: 'abc123',
        status: 'PENDING',
      });
  });

  it('/GET checkouts/:id (deve retornar um checkout)', async () => {
    const mockCheckout = { id: 'abc123', status: 'PENDING' };
    (getCheckoutUseCase.execute as jest.Mock).mockResolvedValue(mockCheckout);

    return request(app.getHttpServer())
      .get('/checkouts/abc123')
      .expect(200)
      .expect(mockCheckout);
  });
});
