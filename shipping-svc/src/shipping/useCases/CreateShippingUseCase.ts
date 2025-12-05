import { Inject, Injectable } from "@nestjs/common";
import { IShippingRepository } from "../repositories/IShippingRepository";
import { IMessageBroker } from "../../events/IMessageBroker";
import { CreateShippingDTO } from "../dto/create-shipping.dto";

@Injectable()
export class CreateShippingUseCase {
    constructor(
        @Inject(IShippingRepository) private readonly shippingRepository: IShippingRepository,
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    ) { }

    async execute(data: CreateShippingDTO) {
        let shipping =  await this.shippingRepository.create({
            ...data,
            status: "SHIPPED"
        })
        await this.messageBroker.publish('shipping_events', shipping);
        
        return shipping;
    }
}
