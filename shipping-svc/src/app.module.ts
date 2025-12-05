import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ShippingModule } from './shipping/shipping.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    DatabaseModule,
    ShippingModule,
    HealthModule
  ],
})
export class AppModule { }