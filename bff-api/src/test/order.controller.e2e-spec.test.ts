import { Test, TestingModule } from '@nestjs/testing';

import { CheckoutService } from '../services/checkout.service';
import { OrderService } from '../services/order.service';
import { OrderController } from '../controllers/order.controller';
import { OrderStatus } from '../dto/order-status.enum';

describe('OrderController', () => {
    let controller: OrderController;

    const checkoutServiceMock = {
        createCheckout: jest.fn(),
        updateStatus: jest.fn(),
    };

    const orderServiceMock = {
        getFullOrderStatus: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [
                { provide: CheckoutService, useValue: checkoutServiceMock },
                { provide: OrderService, useValue: orderServiceMock },
            ],
        }).compile();

        controller = module.get<OrderController>(OrderController);
        jest.clearAllMocks();
    });

    // --------------------------
    // CREATE CHECKOUT
    // --------------------------
    describe('createCheckout', () => {
        it('deve chamar checkoutService.createCheckout com o DTO correto', async () => {
            const dto = {
                customerId: 'b6f3b6b0-1234-4567-8901-abcdef123456',
                items: [
                    { productId: '123', quantity: 2, price: 100 },
                    { productId: '456', quantity: 1, price: 50 },
                ],
                total: 250,
            };

            const response = { id: 'checkout123', ...dto };

            checkoutServiceMock.createCheckout.mockResolvedValue(response);

            const result = await controller.createCheckout(dto);

            expect(checkoutServiceMock.createCheckout).toHaveBeenCalledWith(dto);
            expect(result).toEqual(response);
        });
    });

    // --------------------------
    // GET FULL ORDER STATUS
    // --------------------------
    describe('getFullOrder', () => {
        it('deve chamar orderService.getFullOrderStatus', async () => {
            const orderId = 'order123';
            const expected = { orderId, status: 'PAID' };

            orderServiceMock.getFullOrderStatus.mockResolvedValue(expected);

            const result = await controller.getFullOrder(orderId);

            expect(orderServiceMock.getFullOrderStatus).toHaveBeenCalledWith(orderId);
            expect(result).toEqual(expected);
        });
    });

    // --------------------------
    // UPDATE ORDER STATUS
    // --------------------------
    describe('updateStatus', () => {
        it('deve chamar checkoutService.updateStatus', async () => {
            const orderId = 'order123';
            const body = { status: OrderStatus.CANCELED };
            const expected = { id: orderId, status: 'CANCELED' };

            checkoutServiceMock.updateStatus.mockResolvedValue(expected);

            const result = await controller.updateStatus(orderId, body);

            expect(checkoutServiceMock.updateStatus).toHaveBeenCalledWith(orderId, body.status);
            expect(result).toEqual(expected);
        });
    });
});
