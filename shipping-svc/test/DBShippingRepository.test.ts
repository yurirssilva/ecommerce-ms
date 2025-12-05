import { Shipping } from "../src/shipping/entities/shipping.entity";
import { ShippingModel } from "../src/shipping/models/shipping.model";
import { DBShippingRepository } from "../src/shipping/repositories/implementations/DBShippingRepository";


jest.mock('../src/shipping/models/shipping.model');

describe('DBShippingRepository', () => {
    let repository: DBShippingRepository;

    const shippingMock: Shipping = {
        id: 'ship-1',
        checkoutId: 'chk-123',
        address: 'Rua Teste, 123',
        status: 'PENDING',
        trackingCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(() => {
        repository = new DBShippingRepository();
        jest.clearAllMocks();
    });

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    describe('create', () => {
        it('deve criar e retornar o shipping', async () => {
            (ShippingModel.create as any).mockResolvedValue({
                toJSON: () => shippingMock,
            });

            const result = await repository.create({
                checkoutId: 'chk-123',
                address: 'Rua Teste, 123',
                status: 'PENDING',
                trackingCode: null,
            });

            expect(ShippingModel.create).toHaveBeenCalledWith({
                checkoutId: 'chk-123',
                address: 'Rua Teste, 123',
                status: 'PENDING',
                trackingCode: null,
            });

            expect(result).toEqual(shippingMock);
        });
    });

    // ---------------------------------------------------------------------
    // FIND BY ID
    // ---------------------------------------------------------------------
    describe('findById', () => {
        it('deve retornar o shipping quando encontrado', async () => {
            (ShippingModel.findOne as any).mockResolvedValue({
                toJSON: () => shippingMock,
            });

            const result = await repository.findById('ship-1');

            expect(ShippingModel.findOne).toHaveBeenCalledWith({ id: 'ship-1' });
            expect(result).toEqual(shippingMock);
        });

        it('deve retornar null quando não encontrado', async () => {
            (ShippingModel.findOne as any).mockResolvedValue(null);

            const result = await repository.findById('ship-1');

            expect(result).toBeNull();
        });
    });

    // ---------------------------------------------------------------------
    // FIND BY CHECKOUT ID
    // ---------------------------------------------------------------------
    describe('findByCheckoutId', () => {
        it('deve retornar o shipping correspondente ao checkout', async () => {
            (ShippingModel.findOne as any).mockResolvedValue({
                toJSON: () => shippingMock,
            });

            const result = await repository.findByCheckoutId('chk-123');

            expect(ShippingModel.findOne).toHaveBeenCalledWith({ checkoutId: 'chk-123' });
            expect(result).toEqual(shippingMock);
        });

        it('deve retornar null se não existir', async () => {
            (ShippingModel.findOne as any).mockResolvedValue(null);

            const result = await repository.findByCheckoutId('chk-123');

            expect(result).toBeNull();
        });
    });

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    describe('update', () => {
        const updatedMock: Shipping = {
            ...shippingMock,
            status: 'SHIPPED',
            trackingCode: 'TRK-999',
        };

        it('deve atualizar e retornar o shipping atualizado', async () => {
            (ShippingModel.updateOne as any).mockResolvedValue({});
            (ShippingModel.findOne as any).mockResolvedValue({
                toJSON: () => updatedMock,
            });

            const result = await repository.update(updatedMock);

            expect(ShippingModel.updateOne).toHaveBeenCalledWith(
                { id: updatedMock.id },
                {
                    $set: {
                        status: updatedMock.status,
                        trackingCode: updatedMock.trackingCode,
                    },
                }
            );

            expect(ShippingModel.findOne).toHaveBeenCalledWith({ id: updatedMock.id });

            expect(result).toEqual(updatedMock);
        });

        it('deve lançar erro se o documento não existir após update', async () => {
            (ShippingModel.updateOne as any).mockResolvedValue({});
            (ShippingModel.findOne as any).mockResolvedValue(null);

            await expect(repository.update(updatedMock)).rejects.toThrow();
        });
    });
});
