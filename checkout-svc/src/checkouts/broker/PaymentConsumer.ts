import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IMessageBroker } from '../../events/IMessageBroker';
import { ICheckoutRepository } from '../../repositories/ICheckoutRepository';


@Injectable()
export class PaymentConsumer implements OnModuleInit {
    constructor(
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
        @Inject(ICheckoutRepository) private readonly checkoutRepository: ICheckoutRepository,
    ) { }

    async onModuleInit() {
        await this.messageBroker.consume('payment_events_exchange', 'payment_events.checkout', async (msg) => {
            const event = JSON.parse(msg.content.toString());
            const { checkoutId, status } = event;

            if (status === 'SUCCESS') {
                await this.checkoutRepository.updateStatus(checkoutId, 'PAID');
            } else if (status === 'FAILED') {
                await this.checkoutRepository.updateStatus(checkoutId, 'REJECTED');
            }

            this.messageBroker.ack(msg);
        });
    }
}