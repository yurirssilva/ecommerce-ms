import { Payment } from "../../src/payments/entities/payment.entity";
import { IPaymentRepository } from "../../src/repositories/IPaymentRepository";

export const paymentRepositoryMock = (): jest.Mocked<IPaymentRepository> => ({
    create: jest.fn<Promise<Payment>, [Omit<Payment, "id" | "createdAt" | "updatedAt">]>(),
    findById: jest.fn<Promise<Payment | null>, [string]>(),
    findByCheckoutId: jest.fn<Promise<Payment[]>, [string]>(),
    update: jest.fn<Promise<Payment>, [Payment]>(),
});
