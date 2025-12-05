import { Shipping } from "../entities/shipping.entity";

export interface IShippingRepository {
    create(data: Omit<Shipping, "id" | "createdAt" | "updatedAt">): Promise<Shipping>;
    findById(id: string): Promise<Shipping | null>;
    findByCheckoutId(id: string): Promise<Shipping | null>;
    update(shipping: Shipping): Promise<Shipping>;
}

export const IShippingRepository = Symbol('IShippingRepository')