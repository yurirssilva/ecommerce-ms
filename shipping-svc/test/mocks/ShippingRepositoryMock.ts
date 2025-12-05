import { Shipping } from "../../src/shipping/entities/shipping.entity";
import { IShippingRepository } from "../../src/shipping/repositories/IShippingRepository";

export const shippingRepositoryMock = (): jest.Mocked<IShippingRepository> => ({
    create: jest.fn<Promise<Shipping>, [Omit<Shipping, "id" | "createdAt" | "updatedAt">]>(),
    findById: jest.fn<Promise<Shipping | null>, [string]>(),
    findByCheckoutId: jest.fn<Promise<Shipping | null>, [string]>(),
    update: jest.fn<Promise<Shipping>, [Shipping]>(),
});
