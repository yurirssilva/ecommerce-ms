import { Checkout } from "../../src/checkouts/entities/checkout.entity";
import { ICheckoutRepository } from "../../src/repositories/ICheckoutRepository";

export const checkoutRepositoryMock = (): jest.Mocked<ICheckoutRepository> => ({
    create: jest.fn<Promise<Checkout>, [Omit<Checkout, "id" | "createdAt" | "updatedAt">]>(),
    findById: jest.fn<Promise<Checkout | null>, [string]>(),
    updateStatus: jest.fn<Promise<Checkout>, [string, Checkout["status"]]>()
});