import { Checkout } from "../checkouts/entities/checkout.entity";

export interface ICheckoutRepository {
    create(data: Omit<Checkout, "id" | "createdAt" | "updatedAt">): Promise<Checkout>;
    findById(id: string): Promise<Checkout | null>;
    updateStatus(id: string, status: Checkout["status"]): Promise<Checkout>;
}

export const ICheckoutRepository = Symbol('ICheckoutRepository');