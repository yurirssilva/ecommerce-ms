import { Payment } from "../src/payments/entities/payment.entity";
import { PaymentModel } from "../src/payments/models/payment.model";
import { DBPaymentRepository } from "../src/repositories/implementations/DBPaymentRepository";


jest.mock('../src/payments/models/payment.model');

describe('DBPaymentRepository', () => {
    let repository: DBPaymentRepository;

    const paymentMock: Payment = {
        id: 'pay-1',
        checkoutId: 'chk-123',
        total: 100,
        status: 'PENDING',
        transactionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        repository = new DBPaymentRepository();
        jest.clearAllMocks();
    });

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    describe('create', () => {
        it('deve criar e retornar o pagamento', async () => {
            (PaymentModel.create as any).mockResolvedValue({
                toJSON: () => paymentMock,
            });

            const result = await repository.create({
                checkoutId: 'chk-123',
                total: 100,
                status: 'PENDING',
                transactionId: null,
            });

            expect(PaymentModel.create).toHaveBeenCalledWith({
                checkoutId: 'chk-123',
                total: 100,
                status: 'PENDING',
                transactionId: null,
            });

            expect(result).toEqual(paymentMock);
        });
    });

    // ---------------------------------------------------------------------
    // FIND BY ID
    // ---------------------------------------------------------------------
    describe('findById', () => {
        it('deve retornar o pagamento quando encontrado', async () => {
            (PaymentModel.findOne as any).mockResolvedValue({
                toJSON: () => paymentMock,
            });

            const result = await repository.findById('pay-1');

            expect(PaymentModel.findOne).toHaveBeenCalledWith({ id: 'pay-1' });
            expect(result).toEqual(paymentMock);
        });

        it('deve retornar null quando não encontrado', async () => {
            (PaymentModel.findOne as any).mockResolvedValue(null);

            const result = await repository.findById('pay-1');

            expect(result).toBeNull();
        });
    });

    // ---------------------------------------------------------------------
    // FIND BY CHECKOUT ID
    // ---------------------------------------------------------------------
    describe('findByCheckoutId', () => {
        it('deve retornar uma lista de pagamentos', async () => {
            (PaymentModel.find as any).mockResolvedValue([
                { toJSON: () => paymentMock },
            ]);

            const result = await repository.findByCheckoutId('chk-123');

            expect(PaymentModel.find).toHaveBeenCalledWith({ checkoutId: 'chk-123' });
            expect(result).toEqual([paymentMock]);
        });

        it('deve retornar array vazio quando não houver pagamentos', async () => {
            (PaymentModel.find as any).mockResolvedValue([]);

            const result = await repository.findByCheckoutId('chk-123');

            expect(result).toEqual([]);
        });
    });

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    describe('update', () => {
        const updatedMock: Payment = {
            ...paymentMock,
            status: 'SUCCESS',
            transactionId: 'txn-123',
        };

        it('deve atualizar e retornar o pagamento atualizado', async () => {
            (PaymentModel.updateOne as any).mockResolvedValue({});
            (PaymentModel.findOne as any).mockResolvedValue({
                toJSON: () => updatedMock,
            });

            const result = await repository.update(updatedMock);

            expect(PaymentModel.updateOne).toHaveBeenCalledWith(
                { id: updatedMock.id },
                { $set: { status: updatedMock.status, transactionId: updatedMock.transactionId } }
            );

            expect(PaymentModel.findOne).toHaveBeenCalledWith({ id: updatedMock.id });
            expect(result).toEqual(updatedMock);
        });

        it('deve lançar erro se não encontrar o pagamento após update', async () => {
            (PaymentModel.updateOne as any).mockResolvedValue({});
            (PaymentModel.findOne as any).mockResolvedValue(null);

            await expect(repository.update(updatedMock)).rejects.toThrow();
        });
    });
});
