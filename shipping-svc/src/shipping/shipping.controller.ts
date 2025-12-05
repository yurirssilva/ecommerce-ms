import { Controller, Get, Param } from "@nestjs/common";
import { DBShippingRepository } from "./repositories/implementations/DBShippingRepository";
import { GetShippingUseCase } from "./useCases/GetShippingUseCase";

@Controller('shippings')
export class ShippingController {

    constructor(private readonly getShippingUseCase: GetShippingUseCase) { }

    @Get(':id')
    async getShippingById(@Param('id') id: string) {
        return this.getShippingUseCase.execute(id);
    }
}