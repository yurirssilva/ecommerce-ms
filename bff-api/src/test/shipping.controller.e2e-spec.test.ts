import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ShippingController } from '../../src/controllers/shipping.controller';
import { ShippingService } from '../../src/services/shipping.service';

describe('ShippingController (E2E)', () => {
    let app: INestApplication;

    const shippingServiceMock = {
        getShippingStatus: jest.fn(),
    };

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ShippingController],
            providers: [
                {
                    provide: ShippingService,
                    useValue: shippingServiceMock,
                },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /shippings/:orderId — deve retornar o shipping', async () => {
        const fakeShipping = {
            id: 'ship-123',
            orderId: 'ord-1',
            status: 'IN_TRANSIT',
            company: 'Correios',
            trackingCode: 'BR123456',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        shippingServiceMock.getShippingStatus.mockResolvedValue(fakeShipping);

        const res = await request(app.getHttpServer())
            .get('/shippings/ord-1')
            .expect(200);

        expect(shippingServiceMock.getShippingStatus).toHaveBeenCalledWith('ord-1');
        expect(res.body).toEqual(fakeShipping);
    });
});
