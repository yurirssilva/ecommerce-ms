import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CheckoutController } from '../../src/controllers/checkout.controller';
import { CheckoutService } from '../../src/services/checkout.service';
import request from 'supertest';

describe('CheckoutController (E2E)', () => {
    let app: INestApplication;

    const checkoutServiceMock = {
        getCheckoutById: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [CheckoutController],
            providers: [
                { provide: CheckoutService, useValue: checkoutServiceMock },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /checkout/:id → deve retornar checkout (200)', async () => {
        const fakeCheckout = {
            id: 'chk-123',
            customerId: 'cust1',
            total: 100,
            status: 'CREATED',
        };

        checkoutServiceMock.getCheckoutById.mockResolvedValue(fakeCheckout);

        const res = await request(app.getHttpServer())
            .get('/checkout/chk-123')
            .expect(200);

        expect(checkoutServiceMock.getCheckoutById).toHaveBeenCalledWith('chk-123');
        expect(res.body).toEqual(fakeCheckout);
    });
});
