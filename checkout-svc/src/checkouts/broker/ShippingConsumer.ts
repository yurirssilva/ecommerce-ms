import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IMessageBroker } from '../../events/IMessageBroker';
import { ICheckoutRepository } from '../../repositories/ICheckoutRepository';

@Injectable()
export class ShippingConsumer implements OnModuleInit {
    constructor(
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
        @Inject(ICheckoutRepository) private readonly checkoutRepository: ICheckoutRepository,
    ) { }
    async onModuleInit() {
        await this.messageBroker.consume('shipping_events_exchange', 'shipping_events.checkout', async (msg) => {
            const event = JSON.parse(msg.content.toString());
            const { checkoutId, status } = event;

            if (status === 'SHIPPED') {
                await this.checkoutRepository.updateStatus(checkoutId, 'SHIPPED');
            }

            this.messageBroker.ack(msg);
        });
    }
}