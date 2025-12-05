import { Payment } from "../payments/entities/payment.entity";

export interface IPaymentRepository {
    create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findByCheckoutId(id: string): Promise<Payment[]>;
    update(payment: Payment): Promise<Payment>;
}

export const IPaymentRepository = Symbol('IPaymentRepository')