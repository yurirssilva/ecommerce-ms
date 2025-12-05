import { Inject, Injectable } from "@nestjs/common";
import { IShippingRepository } from "../repositories/IShippingRepository";
import { Shipping } from "../entities/shipping.entity";

@Injectable()
export class GetShippingUseCase {
    constructor(
        @Inject(IShippingRepository) private readonly shippingRepository: IShippingRepository,
    ) { }

    async execute(id: string): Promise<Shipping> {
        const shipping = await this.shippingRepository.findByCheckoutId(id);
        return shipping
    }
}