import { Checkout } from "../src/checkouts/entities/checkout.entity";
import { GetCheckoutUseCase } from "../src/checkouts/useCases/get-checkout.usecase";
import { checkoutRepositoryMock } from "./mock/CheckoutRepositoryMock";
import { MessageBrokerMock } from "./mock/MessageBrokerMock";

describe('GetCheckoutUseCase', () => {
    const repo = checkoutRepositoryMock();
    const useCase = new GetCheckoutUseCase(repo)

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar um checkout existente', async () => {
        const checkout: Checkout = {
            id: 'c1',
            customerId: 'cust1',
            items: [{ productId: 'p1', quantity: 2 }],
            total: 100,
            status: 'CREATED',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        repo.findById.mockResolvedValue(checkout);

        const result = await useCase.execute('c1');

        expect(repo.findById).toHaveBeenCalledWith('c1');
        expect(result).toEqual(checkout);
    });

    it('deve retornar null se não encontrar o checkout', async () => {
        repo.findById.mockResolvedValue(null);

        const result = await useCase.execute('c1');

        expect(repo.findById).toHaveBeenCalledWith('c1');
        expect(result).toBeNull();
    });
});
