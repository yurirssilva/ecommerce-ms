import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    DatabaseModule, 
    PaymentsModule,
    HealthModule
  ],
})
export class AppModule { }