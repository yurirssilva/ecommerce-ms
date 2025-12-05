import { GetShippingUseCase } from "../src/shipping/useCases/GetShippingUseCase";
import { shippingRepositoryMock } from "./mocks/ShippingRepositoryMock";

describe("GetShippingUseCase", () => {
    const shippingRepo = shippingRepositoryMock();
    const useCase = new GetShippingUseCase(shippingRepo);

    const checkoutId = "chk-123";

    beforeEach(() => jest.clearAllMocks());

    it("deve retornar o shipping pelo checkoutId", async () => {
        const fakeShipping = {
            id: "ship-1",
            checkoutId,
            address: "Rua A, 123",
            status: "SHIPPED" as "SHIPPED",
            createdAt: new Date(),
            updatedAt: new Date(),
            trackingCode: "TRACK123",
        };

        shippingRepo.findByCheckoutId.mockResolvedValue(fakeShipping);

        const result = await useCase.execute(checkoutId);

        expect(result).toEqual(fakeShipping);
        expect(shippingRepo.findByCheckoutId).toHaveBeenCalledWith(checkoutId);
    });
});
