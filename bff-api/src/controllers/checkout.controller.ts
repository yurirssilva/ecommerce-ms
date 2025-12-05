import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um checkout pelo ID' })
    @ApiResponse({ status: 200, description: 'Checkout encontrado' })
    @ApiResponse({ status: 404, description: 'Checkout não encontrado' })
    async getCheckoutById(@Param('id') id: string) {
        return this.checkoutService.getCheckoutById(id);
    }
}
