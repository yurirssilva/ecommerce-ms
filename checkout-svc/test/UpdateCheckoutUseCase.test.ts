import { UpdateCheckoutUseCase } from "../src/checkouts/useCases/update-checkout.usecase";
import { checkoutRepositoryMock } from "./mock/CheckoutRepositoryMock";
import { MessageBrokerMock } from "./mock/MessageBrokerMock";
import { Checkout } from "../src/checkouts/entities/checkout.entity";

describe('UpdateCheckoutUseCase', () => {
    const repo = checkoutRepositoryMock();
    const broker = MessageBrokerMock();
    const useCase = new UpdateCheckoutUseCase(repo, broker);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar o checkout e publicar evento', async () => {
        const updatedCheckout: Checkout = {
            id: 'c1',
            customerId: 'cust1',
            items: [{ productId: 'p1', quantity: 2 }],
            total: 100,
            status: 'PAYMENT_RETRY',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        repo.updateStatus.mockResolvedValue(updatedCheckout);

        await useCase.execute('c1', 'PAYMENT_RETRY');

        expect(repo.updateStatus).toHaveBeenCalledWith('c1', 'PAYMENT_RETRY');

        expect(broker.publish).toHaveBeenCalledWith(
            'checkout.retry',
            updatedCheckout,
        );
    });

    it('deve repassar erros do repositório', async () => {
        repo.updateStatus.mockRejectedValue(new Error('DB error'));

        await expect(
            useCase.execute('c1', 'PAID')
        ).rejects.toThrow('DB error');
    });
});
