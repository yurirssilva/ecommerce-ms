import { Controller, Get, Param } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Get(':orderId')
    @ApiOperation({ summary: 'Consulta o status de pagamento' })
    @ApiResponse({ status: 200, description: 'Status do pagamento encontrado' })
    async getPaymentStatus(@Param('orderId') orderId: string) {
        return this.paymentService.getPaymentStatus(orderId);
    }
}
