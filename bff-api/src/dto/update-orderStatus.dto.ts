import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from './order-status.enum';

export class UpdateOrderStatusDto {
    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.PAYMENT_RETRY,
    })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}