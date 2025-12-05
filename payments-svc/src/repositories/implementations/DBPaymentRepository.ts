import { Payment } from "../../payments/entities/payment.entity";
import { PaymentModel } from "../../payments/models/payment.model";
import { IPaymentRepository } from "../IPaymentRepository";

export class DBPaymentRepository implements IPaymentRepository {
    async create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
        const payment = await PaymentModel.create(data);
        return payment.toJSON() as Payment;
    }

    async findById(id: string): Promise<Payment | null> {
        const payment = await PaymentModel.findOne({ id });
        return payment ? payment.toJSON() as Payment : null;
    }

    async findByCheckoutId(checkoutId: string): Promise<Payment[]> {
        const payments = await PaymentModel.find({ checkoutId });

        return payments.map(
            (payment) => payment.toJSON() as Payment
        );
    }

    async update(payment: Payment): Promise<Payment> {
        await PaymentModel.updateOne(
            { id: payment.id },
            { $set: { status: payment.status, transactionId: payment.transactionId } }
        )
        const updated = await PaymentModel.findOne({ id: payment.id });
        return updated.toJSON() as Payment;
    }

}