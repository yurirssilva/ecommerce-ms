import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../src/payments/payment.controller';
import { GetPaymentUseCase } from '../src/payments/useCases/GetPaymentUseCase';
import { Payment } from '../src/payments/entities/payment.entity';
import { paymentRepositoryMock } from './mocks/PaymentRepositoryMock';


describe('PaymentController', () => {
  let controller: PaymentController;
  let getPaymentUseCase: GetPaymentUseCase;

  const fakePayment: Payment[] = [{
    id: 'pay-123',
    checkoutId: 'chk-456',
    total: 100,
    transactionId: 'txn-789',
    status: 'SUCCESS',
    createdAt: new Date(),
    updatedAt: new Date(),
  }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: GetPaymentUseCase,
          useFactory: () => {
            const repo = paymentRepositoryMock();
            return new GetPaymentUseCase(repo);
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    getPaymentUseCase = module.get<GetPaymentUseCase>(GetPaymentUseCase);
  });

  it('deve retornar um pagamento existente', async () => {
    jest
      .spyOn(getPaymentUseCase, 'execute')
      .mockResolvedValue(fakePayment);

    const result = await controller.getPaymentById('chk-456');

    expect(result).toEqual(fakePayment);
    expect(getPaymentUseCase.execute).toHaveBeenCalledWith('chk-456');
  });

  it('deve retornar null quando pagamento não encontrado', async () => {
    jest
      .spyOn(getPaymentUseCase, 'execute')
      .mockResolvedValue(null);

    const result = await controller.getPaymentById('not-found');

    expect(result).toBeNull();
    expect(getPaymentUseCase.execute).toHaveBeenCalledWith('not-found');
  });
});
