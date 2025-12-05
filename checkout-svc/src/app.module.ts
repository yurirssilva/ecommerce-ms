import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { CheckoutModule } from './checkouts/checkout.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    DatabaseModule, 
    CheckoutModule,
    HealthModule
  ],
})
export class AppModule { }