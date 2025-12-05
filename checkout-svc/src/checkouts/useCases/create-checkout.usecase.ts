import { Inject, Injectable } from "@nestjs/common";
import { IMessageBroker } from "../../events/IMessageBroker";
import { ICheckoutRepository } from "../../repositories/ICheckoutRepository";
import { CreateCheckoutDTO } from "../dto/create-checkout.dto";
import { Checkout } from "../entities/checkout.entity";


@Injectable()
export class CreateCheckoutUseCase {
    constructor(
        @Inject(ICheckoutRepository) private readonly checkoutRepository: ICheckoutRepository,
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker
    ) { }

    async execute(data: CreateCheckoutDTO): Promise<Checkout> {
        const checkout = await this.checkoutRepository.create({
            ...data,
            status: "CREATED",
        });

        await this.messageBroker.publish('checkout.created', checkout)

        return checkout
    }
}