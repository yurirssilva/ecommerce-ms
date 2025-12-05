import { Shipping } from "../../entities/shipping.entity";
import { ShippingModel } from "../../models/shipping.model";
import { IShippingRepository } from "../IShippingRepository";

export class DBShippingRepository implements IShippingRepository {
    async create(data: Omit<Shipping, "id" | "createdAt" | "updatedAt">): Promise<Shipping> {
        const shipping = await ShippingModel.create(data);
        return shipping.toJSON() as Shipping;
    }

    async findById(id: string): Promise<Shipping | null> {
        const shipping = await ShippingModel.findOne({ id });
        return shipping ? shipping.toJSON() as Shipping : null;
    }

    async findByCheckoutId(id: string): Promise<Shipping | null> {
        const payment = await ShippingModel.findOne({ checkoutId: id });
        return payment ? payment.toJSON() as Shipping : null;
    }

    async update(shipping: Shipping): Promise<Shipping> {
        await ShippingModel.updateOne(
            { id: shipping.id },
            { $set: { status: shipping.status, trackingCode: shipping.trackingCode, } }
        );
        const updated = await ShippingModel.findOne({ id: shipping.id });
        return updated.toJSON() as Shipping;
    }
}