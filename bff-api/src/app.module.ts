import { Module } from '@nestjs/common';
import { CheckoutController } from './controllers/checkout.controller';
import { OrderController } from './controllers/order.controller';
import { PaymentController } from './controllers/payment.controller';
import { ShippingController } from './controllers/shipping.controller';
import { OrderService } from './services/order.service';
import { CheckoutService } from './services/checkout.service';
import { PaymentService } from './services/payment.service';
import { ShippingService } from './services/shipping.service';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    })
  ],
  controllers: [
    OrderController,
    CheckoutController,
    PaymentController,
    ShippingController,
    HealthController
  ],
  providers: [
    OrderService,
    CheckoutService,
    PaymentService,
    ShippingService,
    HealthService
  ],
})
export class AppModule { }