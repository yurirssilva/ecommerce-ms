import { CreateShippingUseCase } from "../src/shipping/useCases/CreateShippingUseCase";
import { MessageBrokerMock } from "./mocks/MessageBrokerMock";
import { shippingRepositoryMock } from "./mocks/ShippingRepositoryMock";


describe("CreateShippingUseCase", () => {
    const shippingRepo = shippingRepositoryMock();
    const broker = MessageBrokerMock();
    const useCase = new CreateShippingUseCase(shippingRepo, broker);

    const dto = { checkoutId: "chk-123", address: "Rua A, 123" };

    beforeEach(() => jest.clearAllMocks());

    it("deve criar um shipping e publicar evento", async () => {
        const fakeShipping = {
            id: "ship-1",
            checkoutId: dto.checkoutId,
            address: dto.address,
            status: "SHIPPED" as "SHIPPED",
            createdAt: new Date(),
            updatedAt: new Date(),
            trackingCode: "TRACK123",
        };

        shippingRepo.create.mockResolvedValue(fakeShipping);

        const result = await useCase.execute(dto);

        expect(result).toEqual(fakeShipping);
        expect(shippingRepo.create).toHaveBeenCalledWith(expect.objectContaining({ ...dto, status: "SHIPPED" }));
        expect(broker.publish).toHaveBeenCalledWith("shipping_events", fakeShipping);
    });
});
