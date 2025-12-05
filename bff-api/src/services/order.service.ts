import { Injectable } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { PaymentService } from './payment.service';
import { ShippingService } from './shipping.service';

@Injectable()
export class OrderService {
    constructor(
        private readonly checkoutService: CheckoutService,
        private readonly paymentService: PaymentService,
        private readonly shippingService: ShippingService,
    ) { }

    async getFullOrderStatus(orderId: string) {

        const [checkout, payment, shipping] = await Promise.allSettled([
            this.checkoutService.getCheckoutById(orderId),
            this.paymentService.getPaymentStatus(orderId),
            this.shippingService.getShippingStatus(orderId),
        ]);

        return {
            orderId,
            checkout: checkout.status === 'fulfilled' ? checkout.value : null,
            payment: payment.status === 'fulfilled' ? payment.value : { status: 'pending' },
            shipping: shipping.status === 'fulfilled' ? shipping.value : { status: 'pending' },
        };
    }

}
