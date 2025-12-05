
import { Payment } from "../src/payments/entities/payment.entity";
import { ProcessPaymentUseCase } from "../src/payments/useCases/ProcessPaymentUseCase";
import { MessageBrokerMock } from "./mocks/MessageBrokerMock";
import { paymentGatewayMock } from "./mocks/PaymentGatewayMock";
import { paymentRepositoryMock } from "./mocks/PaymentRepositoryMock";

describe("ProcessPaymentUseCase", () => {
    const paymentRepo = paymentRepositoryMock();
    const broker = MessageBrokerMock();
    const gateway = paymentGatewayMock();
    const useCase = new ProcessPaymentUseCase(paymentRepo, broker, gateway);
    const dto = { checkoutId: "chk-123", total: 100 };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve processar o pagamento com sucesso", async () => {
        const createdPayment: Payment = {
            id: "pay-1",
            checkoutId: dto.checkoutId,
            total: dto.total,
            transactionId: undefined,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        paymentRepo.create.mockResolvedValue(createdPayment);
        gateway.charge.mockResolvedValue({ success: true, transactionId: "txn-123" });
        paymentRepo.update.mockImplementation(async (p) => p);

        const result = await useCase.execute(dto);

        expect(result.status).toBe("SUCCESS");
        expect(result.transactionId).toBe("txn-123");
        expect(paymentRepo.create).toHaveBeenCalledWith({ ...dto, status: "PENDING" });
        expect(paymentRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: "SUCCESS" }));
        expect(broker.publish).toHaveBeenCalledWith("payment_events", expect.objectContaining({ status: "SUCCESS" }));
    });

    it("deve processar pagamento com falha", async () => {
        const createdPayment: Payment = {
            id: "pay-1",
            checkoutId: dto.checkoutId,
            total: dto.total,
            transactionId: undefined,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        paymentRepo.create.mockResolvedValue(createdPayment);
        gateway.charge.mockRejectedValue(new Error("Falha no gateway"));
        paymentRepo.update.mockImplementation(async (p) => p);

        await expect(useCase.execute(dto)).rejects.toThrow("Falha no gateway");

        expect(paymentRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: "FAILED" }));
        expect(broker.publish).toHaveBeenCalledWith("payment_events", expect.objectContaining({ status: "FAILED" }));
    });

    it("deve processar pagamento com falha de sucesso=false", async () => {
        const createdPayment: Payment = {
            id: "pay-1",
            checkoutId: dto.checkoutId,
            total: dto.total,
            transactionId: undefined,
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        paymentRepo.create.mockResolvedValue(createdPayment);
        gateway.charge.mockResolvedValue({ success: false, transactionId: "txn-456" });
        paymentRepo.update.mockImplementation(async (p) => p);

        const result = await useCase.execute(dto);

        expect(result.status).toBe("FAILED");
        expect(result.transactionId).toBe("txn-456");
        expect(paymentRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: "FAILED" }));
        expect(broker.publish).toHaveBeenCalledWith("payment_events", expect.objectContaining({ status: "FAILED" }));
    });
});
