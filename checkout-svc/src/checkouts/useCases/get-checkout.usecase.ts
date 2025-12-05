import { Inject, Injectable } from "@nestjs/common";
import { ICheckoutRepository } from "../../repositories/ICheckoutRepository";
import { Checkout } from "../entities/checkout.entity";


@Injectable()
export class GetCheckoutUseCase {
    constructor(
        @Inject(ICheckoutRepository) private readonly checkoutRepository: ICheckoutRepository,
    ) { }

    async execute(id: string): Promise<Checkout> {
        const checkout = await this.checkoutRepository.findById(id);
        return checkout
    }
}