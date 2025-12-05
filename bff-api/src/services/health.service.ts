import { Injectable } from "@nestjs/common";
import { CheckoutService } from "./checkout.service";
import { PaymentService } from "./payment.service";
import { ShippingService } from "./shipping.service";

@Injectable()
export class HealthService {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly paymentService: PaymentService,
    private readonly shippingService: ShippingService,
  ) { }

  async checkAll() {
    const results = await Promise.allSettled([
      this.checkoutService.health(),
      this.paymentService.health(),
      this.shippingService.health(),
    ]);

    const services = {
      checkout:
        results[0].status === 'fulfilled'
          ? results[0].value
          : { name: 'checkout', status: 'down' },

      payment:
        results[1].status === 'fulfilled'
          ? results[1].value
          : { name: 'payment', status: 'down' },

      shipping:
        results[2].status === 'fulfilled'
          ? results[2].value
          : { name: 'shipping', status: 'down' },
    };

    const allUp = Object.values(services).every(
      (s) => s.status === 'up',
    );

    return {
      status: allUp ? 'ok' : 'degraded',
      services,
      timestamp: new Date().toISOString(),
    };
  }
}
