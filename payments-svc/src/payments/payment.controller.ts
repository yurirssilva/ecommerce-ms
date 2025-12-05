import { Controller, Get, Param } from "@nestjs/common";
import { GetPaymentUseCase } from "./useCases/GetPaymentUseCase";

@Controller('payments')
export class PaymentController {
    constructor(private readonly getPaymentUseCase: GetPaymentUseCase) { }

    @Get(':id')
    async getPaymentById(@Param('id') id: string) {
        return this.getPaymentUseCase.execute(id);
    }
}