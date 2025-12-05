import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PaymentController } from '../../src/controllers/payment.controller';
import { PaymentService } from '../../src/services/payment.service';

describe('PaymentController (E2E)', () => {
    let app: INestApplication;

    const paymentServiceMock = {
        getPaymentStatus: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentController],
            providers: [
                {
                    provide: PaymentService,
                    useValue: paymentServiceMock,
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /payments/:orderId — deve retornar o status de pagamento', async () => {
        const fakePayment = {
            id: 'pay-123',
            checkoutId: 'chk-111',
            total: 150,
            status: 'SUCCESS',
            transactionId: 'txn-xyz',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        paymentServiceMock.getPaymentStatus.mockResolvedValue(fakePayment);

        const res = await request(app.getHttpServer())
            .get('/payments/chk-111')
            .expect(200);

        expect(paymentServiceMock.getPaymentStatus).toHaveBeenCalledWith('chk-111');
        expect(res.body).toEqual(fakePayment);
    });

    it('GET /payments/:orderId — deve retornar lista vazia se nada encontrado', async () => {
        paymentServiceMock.getPaymentStatus.mockResolvedValue([]);

        const res = await request(app.getHttpServer())
            .get('/payments/unknown')
            .expect(200);

        expect(paymentServiceMock.getPaymentStatus).toHaveBeenCalledWith('unknown');
        expect(res.body).toEqual([]);
    });
});
