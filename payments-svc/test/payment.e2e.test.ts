import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { PaymentController } from '../src/payments/payment.controller';
import { ProcessPaymentUseCase } from '../src/payments/useCases/ProcessPaymentUseCase';
import { GetPaymentUseCase } from '../src/payments/useCases/GetPaymentUseCase';
import { paymentRepositoryMock } from './mocks/PaymentRepositoryMock';
import { paymentGatewayMock } from './mocks/PaymentGatewayMock';
import { MessageBrokerMock } from './mocks/MessageBrokerMock';
import { Payment } from '../src/payments/entities/payment.entity';

describe('Payments E2E - Mocks', () => {
    let processPaymentUseCase: ProcessPaymentUseCase;
    let app: INestApplication;

    const paymentRepo = paymentRepositoryMock();
    const gateway = paymentGatewayMock();
    const broker = MessageBrokerMock();

    processPaymentUseCase = new ProcessPaymentUseCase(paymentRepo, broker, gateway)

    const dto = { checkoutId: 'chk-123', total: 100 };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [PaymentController],
            providers: [
                {
                    provide: ProcessPaymentUseCase,
                    useFactory: () => new ProcessPaymentUseCase(paymentRepo, broker, gateway),
                },
                {
                    provide: GetPaymentUseCase,
                    useFactory: () => new GetPaymentUseCase(paymentRepo),
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('deve processar pagamento com sucesso', async () => {
        const createdPayment: Payment = {
            id: 'pay-1',
            checkoutId: dto.checkoutId,
            total: dto.total,
            transactionId: undefined,
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        paymentRepo.create.mockResolvedValue(createdPayment);
        processPaymentUseCase['paymentGateway'].charge = jest.fn().mockResolvedValue({ success: true, transactionId: 'txn-123' });
        paymentRepo.update.mockImplementation(async (p) => p);

        const result = await processPaymentUseCase.execute(dto);

        expect(paymentRepo.create).toHaveBeenCalledWith({ ...dto, status: 'PENDING' });
        expect(result.status).toBe('SUCCESS');
        expect(result.transactionId).toBe('txn-123');
        expect(paymentRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'SUCCESS' }));
        expect(broker.publish).toHaveBeenCalledWith('payment_events', expect.objectContaining({ status: 'SUCCESS' }));
    });

    it('deve processar pagamento com falha', async () => {
        const createdPayment: Payment = {
            id: 'pay-1',
            checkoutId: dto.checkoutId,
            total: dto.total,
            transactionId: undefined,
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        paymentRepo.create.mockResolvedValue(createdPayment);
        processPaymentUseCase['paymentGateway'].charge = jest.fn().mockRejectedValue(new Error('Falha no gateway'));
        paymentRepo.update.mockImplementation(async (p) => p);

        await expect(processPaymentUseCase.execute(dto)).rejects.toThrow('Falha no gateway');
        expect(paymentRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'FAILED' }));
        expect(broker.publish).toHaveBeenCalledWith('payment_events', expect.objectContaining({ status: 'FAILED' }));
    });

    const now = new Date().toISOString();
    it('/payments/:id (GET) deve retornar pagamento', async () => {
        const fakePayment = [{
            id: 'pay-1',
            checkoutId: 'chk-123',
            total: 100,
            status: 'SUCCESS' as 'SUCCESS',
            transactionId: 'txn-123',
            createdAt: now,
            updatedAt: now,
        }];

        paymentRepo.findByCheckoutId.mockResolvedValue([{
            ...fakePayment[0],
            createdAt: new Date(now),
            updatedAt: new Date(now),
        }]);

        const res = await request(app.getHttpServer())
            .get('/payments/chk-123')
            .expect(200);

        expect(res.body).toEqual(fakePayment);
    });
});
