import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateCheckoutUseCase } from "./useCases/create-checkout.usecase";
import { GetCheckoutUseCase } from "./useCases/get-checkout.usecase";
import { UpdateCheckoutUseCase } from "./useCases/update-checkout.usecase";
import { UpdateOrderStatusDto } from "./dto/update-orderStatus.dto";

@Controller('checkouts')
export class CheckoutController {
    constructor(
        private readonly createCheckout: CreateCheckoutUseCase,
        private readonly getCheckout: GetCheckoutUseCase,
        private readonly updateCheckout: UpdateCheckoutUseCase,
    ) { }

    @Post()
    async create(@Body() body: any) {
        const checkout = await this.createCheckout.execute(body);
        return { checkoutId: checkout.id, status: checkout.status };
    }

    @Get(':id')
    async getCheckoutById(@Param('id') id: string) {
        return this.getCheckout.execute(id);
    }

    @Patch(':orderId/status')
    async updateStatus(@Param('orderId') id: string,
        @Body() body: UpdateOrderStatusDto,) {
        return this.updateCheckout.execute(id, body.status);
    }
}