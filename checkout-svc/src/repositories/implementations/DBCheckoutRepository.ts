import { CheckoutModel } from "../../checkouts/models/checkout.model";
import { Checkout } from "../../checkouts/entities/checkout.entity";
import { ICheckoutRepository } from "../ICheckoutRepository";

export class DBCheckoutRepository implements ICheckoutRepository {
    async create(data: Omit<Checkout, "id" | "createdAt" | "updatedAt">): Promise<Checkout> {
        try {
            const checkout = await CheckoutModel.create(data);
            return checkout.toJSON() as Checkout;
        } catch (e) {

        }
    }

    async findById(id: string): Promise<Checkout | null> {
        const checkout = await CheckoutModel.findOne({ id });
        return checkout ? checkout.toJSON() as Checkout : null;
    }

    async updateStatus(id: string, status: Checkout["status"]): Promise<Checkout> {
        await CheckoutModel.updateOne(
            { id },
            { $set: { status } },
        );
        const checkout = await CheckoutModel.findOne({ id });
        return checkout.toJSON() as Checkout;
    }
}