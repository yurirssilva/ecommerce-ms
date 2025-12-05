import { Payment } from "../src/payments/entities/payment.entity";
import { GetPaymentUseCase } from "../src/payments/useCases/GetPaymentUseCase";
import { paymentRepositoryMock } from "./mocks/PaymentRepositoryMock";


describe("GetPaymentUseCase", () => {
    const repo = paymentRepositoryMock();
    const useCase = new GetPaymentUseCase(repo);

    const fakePayment: Payment[] = [{
        id: "pay-123",
        checkoutId: "chk-456",
        total: 100,
        transactionId: "txn-789",
        status: "SUCCESS",
        createdAt: new Date(),
        updatedAt: new Date(),
    }];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve retornar um pagamento quando encontrado", async () => {
        repo.findByCheckoutId.mockResolvedValue(fakePayment);

        const result = await useCase.execute("chk-456");

        expect(result).toEqual(fakePayment);
        expect(repo.findByCheckoutId).toHaveBeenCalledWith("chk-456");
    });

    it("deve retornar null quando pagamento não encontrado", async () => {
        repo.findByCheckoutId.mockResolvedValue(null);

        const result = await useCase.execute("not-found");

        expect(result).toBeNull();
        expect(repo.findByCheckoutId).toHaveBeenCalledWith("not-found");
    });
});
