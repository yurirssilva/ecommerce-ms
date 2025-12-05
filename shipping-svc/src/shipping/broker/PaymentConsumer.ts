import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { IMessageBroker } from "../../events/IMessageBroker";
import { CreateShippingUseCase } from "../useCases/CreateShippingUseCase";

@Injectable()
export class PaymentConsumer implements OnModuleInit {
    constructor(
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
        private readonly createShippingUseCase: CreateShippingUseCase,
    ) { }

    async onModuleInit() {
        await this.messageBroker.consume('payment_events_exchange', 'payment_events.shipping', async (msg) => {
            const event = JSON.parse(msg.content.toString());
            const { checkoutId, status } = event;
            if (status === 'SUCCESS') {
                await this.createShippingUseCase.execute({checkoutId, address: 'fake_address'});
            } 

            this.messageBroker.ack(msg);
        });
    }
}