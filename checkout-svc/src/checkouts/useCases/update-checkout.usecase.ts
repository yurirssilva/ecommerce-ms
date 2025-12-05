import { Inject, Injectable } from "@nestjs/common";
import { IMessageBroker } from "../../events/IMessageBroker";
import { ICheckoutRepository } from "../../repositories/ICheckoutRepository";
import { Checkout } from "../entities/checkout.entity";


@Injectable()
export class UpdateCheckoutUseCase {
    constructor(
        @Inject(ICheckoutRepository) private readonly checkoutRepository: ICheckoutRepository,
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker
    ) { }

    async execute(id: string, status: Checkout["status"]): Promise<void> {
        const checkout = await this.checkoutRepository.updateStatus(
            id, status
        );

        await this.messageBroker.publish('checkout.retry', checkout)
    }
}