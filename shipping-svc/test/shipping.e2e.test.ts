import { Test, TestingModule } from '@nestjs/testing';
import { CreateShippingUseCase } from '../src/shipping/useCases/CreateShippingUseCase';
import { GetShippingUseCase } from '../src/shipping/useCases/GetShippingUseCase';
import { ShippingController } from '../src/shipping/shipping.controller';
import { shippingRepositoryMock } from './mocks/ShippingRepositoryMock';
import { MessageBrokerMock } from './mocks/MessageBrokerMock';
import { Shipping } from '../src/shipping/entities/shipping.entity';

describe('ShippingService E2E', () => {
    let createUseCase: CreateShippingUseCase;
    let getUseCase: GetShippingUseCase;
    let controller: ShippingController;
    let shippingRepo: ReturnType<typeof shippingRepositoryMock>;
    let broker: ReturnType<typeof MessageBrokerMock>;

    const dto = { checkoutId: 'chk-123', address: 'Rua A, 123' };

    beforeEach(async () => {
        shippingRepo = shippingRepositoryMock();
        broker = MessageBrokerMock();

        createUseCase = new CreateShippingUseCase(shippingRepo, broker);
        getUseCase = new GetShippingUseCase(shippingRepo);

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShippingController],
            providers: [
                { provide: CreateShippingUseCase, useValue: createUseCase },
                { provide: GetShippingUseCase, useValue: getUseCase },
            ],
        }).compile();

        controller = module.get<ShippingController>(ShippingController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar shipping quando checkout pago', async () => {
        const createdShipping: Shipping = {
            id: 'ship-1',
            checkoutId: dto.checkoutId,
            address: dto.address,
            status: 'SHIPPED',
            createdAt: new Date(),
            updatedAt: new Date(),
            trackingCode: undefined,
        };

        shippingRepo.create.mockResolvedValue(createdShipping);

        const result = await createUseCase.execute(dto);

        expect(shippingRepo.create).toHaveBeenCalledWith({
            ...dto,
            status: 'SHIPPED',
        });

        expect(result).toEqual(createdShipping);
        expect(broker.publish).toHaveBeenCalledWith('shipping_events', createdShipping);
    });

    it('deve retornar shipping via controller GET', async () => {
        const shipping: Shipping = {
            id: 'ship-1',
            checkoutId: dto.checkoutId,
            address: dto.address,
            status: 'SHIPPED',
            createdAt: new Date(),
            updatedAt: new Date(),
            trackingCode: 'TRK-123',
        };

        shippingRepo.findByCheckoutId.mockResolvedValue(shipping);

        const result = await controller.getShippingById(dto.checkoutId);

        expect(shippingRepo.findByCheckoutId).toHaveBeenCalledWith(dto.checkoutId);
        expect(result).toEqual(shipping);
    });

    it('deve lidar com shipping não encontrado', async () => {
        shippingRepo.findByCheckoutId.mockResolvedValue(null);

        const result = await controller.getShippingById('non-existent');

        expect(shippingRepo.findByCheckoutId).toHaveBeenCalledWith('non-existent');
        expect(result).toBeNull();
    });
});
