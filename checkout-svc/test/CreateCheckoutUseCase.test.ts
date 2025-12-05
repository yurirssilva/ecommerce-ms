import { CreateCheckoutDTO } from "../src/checkouts/dto/create-checkout.dto";
import { Checkout } from "../src/checkouts/entities/checkout.entity";
import { CreateCheckoutUseCase } from "../src/checkouts/useCases/create-checkout.usecase";
import { checkoutRepositoryMock } from "./mock/CheckoutRepositoryMock";
import { MessageBrokerMock } from "./mock/MessageBrokerMock";


describe('CreateCheckoutUseCase', () => {
    const repo = checkoutRepositoryMock();
    const broker = MessageBrokerMock();
    const useCase = new CreateCheckoutUseCase(repo, broker)
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar o checkout e publicar evento', async () => {
        let dto: CreateCheckoutDTO = {
            customerId: 'cust1',
            items: [{ productId: 'p1', quantity: 2 }],
            total: 100,
        };

        let createdCheckout: Checkout = {
            id: 'c1',
            ...dto,
            status: 'CREATED',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        repo.create.mockResolvedValue(createdCheckout);

        let result = await useCase.execute(dto);

        expect(repo.create).toHaveBeenCalledWith({
            ...dto,
            status: 'CREATED',
        });

        expect(broker.publish).toHaveBeenCalledWith('checkout.created', createdCheckout);

        expect(result).toEqual(createdCheckout);
    });
});
