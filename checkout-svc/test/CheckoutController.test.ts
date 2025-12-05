import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from '../src/checkouts/checkout.controller';
import { CreateCheckoutUseCase } from '../src/checkouts/useCases/create-checkout.usecase';
import { GetCheckoutUseCase } from '../src/checkouts/useCases/get-checkout.usecase';
import { UpdateCheckoutUseCase } from '../src/checkouts/useCases/update-checkout.usecase';


describe('CheckoutController', () => {
    let controller: CheckoutController;
    let createCheckoutUseCase: CreateCheckoutUseCase;
    let getCheckoutUseCase: GetCheckoutUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
                },{
                    provide: UpdateCheckoutUseCase,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<CheckoutController>(CheckoutController);
        createCheckoutUseCase = module.get<CreateCheckoutUseCase>(CreateCheckoutUseCase);
        getCheckoutUseCase = module.get<GetCheckoutUseCase>(GetCheckoutUseCase);
    });

    it('deve criar um checkout com sucesso', async () => {
        const mockCheckout = { id: '123', status: 'PENDING' };
        (createCheckoutUseCase.execute as jest.Mock).mockResolvedValue(mockCheckout);

        const result = await controller.create({ amount: 100 });

        expect(createCheckoutUseCase.execute).toHaveBeenCalledWith({ amount: 100 });
        expect(result).toEqual({ checkoutId: '123', status: 'PENDING' });
    });

    it('deve buscar um checkout pelo id', async () => {
        const mockCheckout = { id: '123', status: 'PENDING' };
        (getCheckoutUseCase.execute as jest.Mock).mockResolvedValue(mockCheckout);

        const result = await controller.getCheckoutById('123');

        expect(getCheckoutUseCase.execute).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockCheckout);
    });
});
