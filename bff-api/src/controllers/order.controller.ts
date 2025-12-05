import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CheckoutService } from '../services/checkout.service';
import { UpdateOrderStatusDto } from '../dto/update-orderStatus.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCheckoutDto } from '../dto/create-checkout.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(
        private readonly checkoutService: CheckoutService,
        private readonly orderService: OrderService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo checkout (ordem)' })
    @ApiResponse({ status: 201, description: 'Checkout criado com sucesso' })
    async createCheckout(@Body() dto: CreateCheckoutDto) {
        return this.checkoutService.createCheckout(dto);
    }

    @Get(':orderId')
    @ApiOperation({ summary: 'Retorna o status completo da ordem' })
    @ApiResponse({ status: 200, description: 'Status da ordem encontrado' })
    async getFullOrder(@Param('orderId') orderId: string) {
        return this.orderService.getFullOrderStatus(orderId);
    }

    @Patch(':orderId/status')
    @ApiOperation({ summary: 'Atualiza o status de uma ordem' })
    @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
    async updateStatus(@Param('orderId') id: string,
        @Body() body: UpdateOrderStatusDto,) {
        return this.checkoutService.updateStatus(id, body.status);
    }
}