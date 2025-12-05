import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { shippingRepositoryMock } from "./mocks/ShippingRepositoryMock";
import { GetShippingUseCase } from "../src/shipping/useCases/GetShippingUseCase";
import { ShippingController } from "../src/shipping/shipping.controller";

describe("ShippingController E2E", () => {
    let app: INestApplication;
    const shippingRepo = shippingRepositoryMock();
    const getShippingUseCase = new GetShippingUseCase(shippingRepo);

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [ShippingController],
            providers: [
                { provide: GetShippingUseCase, useValue: getShippingUseCase },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => await app.close());

    it("GET /shippings/:id - deve retornar shipping existente", async () => {
        const fakeShipping = {
            id: "ship-1",
            checkoutId: "chk-123",
            address: "Rua A, 123",
            status: "SHIPPED" as "SHIPPED",
            createdAt: new Date(),
            updatedAt: new Date(),
            trackingCode: "TRACK123",
        };

        shippingRepo.findByCheckoutId.mockResolvedValue(fakeShipping);

        const res = await request(app.getHttpServer())
            .get("/shippings/chk-123")
            .expect(200);

        res.body.createdAt = new Date(res.body.createdAt);
        res.body.updatedAt = new Date(res.body.updatedAt);

        expect(res.body).toEqual(fakeShipping);
    });

    it("GET /shippings/:id - shipping não encontrado", async () => {
        shippingRepo.findByCheckoutId.mockResolvedValue(null);

        const res = await request(app.getHttpServer())
            .get("/shippings/unknown-id")
            .expect(200);

        expect(res.body).toEqual({});
    });
});
