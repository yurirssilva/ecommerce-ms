import { Checkout } from "../src/checkouts/entities/checkout.entity";
import { CheckoutModel } from "../src/checkouts/models/checkout.model";
import { DBCheckoutRepository } from "../src/repositories/implementations/DBCheckoutRepository";


jest.mock('../src/checkouts/models/checkout.model');

describe('DBCheckoutRepository', () => {
    let repository: DBCheckoutRepository;

    const checkoutMock: Checkout = {
        id: 'abc-123',
        customerId: 'cust-1',
        total: 300,
        items: [],
        status: 'CREATED',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        repository = new DBCheckoutRepository();

        jest.clearAllMocks();
    });

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    describe('create', () => {
        it('deve criar e retornar o checkout', async () => {
            (CheckoutModel.create as any).mockResolvedValue({
                toJSON: () => checkoutMock,
            });

            const result = await repository.create({
                customerId: 'cust-1',
                total: 300,
                items: [],
                status: 'CREATED',
            });

            expect(CheckoutModel.create).toHaveBeenCalledWith({
                customerId: 'cust-1',
                total: 300,
                items: [],
                status: 'CREATED',
            });

            expect(result).toEqual(checkoutMock);
        });

        it('deve retornar undefined se ocorrer erro', async () => {
            (CheckoutModel.create as any).mockRejectedValue(new Error('DB error'));

            const result = await repository.create({
                customerId: 'cust-1',
                total: 300,
                items: [],
                status: 'CREATED',
            });

            expect(result).toBeUndefined();
        });
    });

    // ---------------------------------------------------------------------
    // FIND BY ID
    // ---------------------------------------------------------------------
    describe('findById', () => {
        it('deve retornar o checkout quando encontrado', async () => {
            (CheckoutModel.findOne as any).mockResolvedValue({
                toJSON: () => checkoutMock,
            });

            const result = await repository.findById('abc-123');

            expect(CheckoutModel.findOne).toHaveBeenCalledWith({ id: 'abc-123' });
            expect(result).toEqual(checkoutMock);
        });

        it('deve retornar null quando não encontrado', async () => {
            (CheckoutModel.findOne as any).mockResolvedValue(null);

            const result = await repository.findById('abc-123');

            expect(result).toBeNull();
        });
    });

    // ---------------------------------------------------------------------
    // UPDATE STATUS
    // ---------------------------------------------------------------------
    describe('updateStatus', () => {
        it('deve atualizar o status e retornar o checkout atualizado', async () => {
            const updatedCheckout = {
                ...checkoutMock,
                status: 'PAID',
            };

            (CheckoutModel.updateOne as any).mockResolvedValue({});
            (CheckoutModel.findOne as any).mockResolvedValue({
                toJSON: () => updatedCheckout,
            });

            const result = await repository.updateStatus('abc-123', 'PAID');

            expect(CheckoutModel.updateOne).toHaveBeenCalledWith(
                { id: 'abc-123' },
                { $set: { status: 'PAID' } },
            );

            expect(CheckoutModel.findOne).toHaveBeenCalledWith({ id: 'abc-123' });
            expect(result).toEqual(updatedCheckout);
        });

        it('deve falhar se updateOne lançar erro', async () => {
            (CheckoutModel.updateOne as any).mockRejectedValue(new Error('DB error'));

            await expect(repository.updateStatus('abc-123', 'REJECTED'))
                .rejects
                .toThrow('DB error');
        });

        it('deve falhar se o checkout não existir após update', async () => {
            (CheckoutModel.updateOne as any).mockResolvedValue({});
            (CheckoutModel.findOne as any).mockResolvedValue(null);

            await expect(repository.updateStatus('abc-123', 'REJECTED'))
                .rejects
                .toThrow();
        });
    });
});
