import { Controller, Post, Get, Param } from '@nestjs/common';
import { ShippingService } from '../services/shipping.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Shipping')
@Controller('shippings')
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) { }

    @Get(':orderId')
    @ApiOperation({ summary: 'Consulta o status de envio (shipping)' })
    @ApiResponse({ status: 200, description: 'Status de envio encontrado' })
    async getShippingStatus(@Param('orderId') orderId: string) {
        return this.shippingService.getShippingStatus(orderId);
    }
}
