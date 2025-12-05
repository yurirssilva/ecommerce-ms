import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsUUID } from 'class-validator';

export class CreateCheckoutDto {
    @ApiProperty({ example: 'b6f3b6b0-1234-4567-8901-abcdef123456' })
    @IsUUID()
    customerId: string;

    @ApiProperty({
        type: Array,
        example: [
            { productId: '123', quantity: 2, price: 100 },
            { productId: '456', quantity: 1, price: 50 },
        ],
    })
    @IsArray()
    items: any[];

    @ApiProperty({ example: 250 })
    @IsNumber()
    total: number;
}
