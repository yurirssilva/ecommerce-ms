import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IMessageBroker } from '../../events/IMessageBroker';
import { ProcessPaymentUseCase } from '../useCases/ProcessPaymentUseCase';


@Injectable()
export class CheckoutConsumer implements OnModuleInit {
  constructor(
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
  ) { }

  async onModuleInit() {
    await this.consumeCheckoutCreated();
    await this.consumePaymentRetry();

  }

  async consumeCheckoutCreated() {
    await this.messageBroker.consume('checkout.created', async (msg) => {
      const event = JSON.parse(msg.content.toString());

      if (event.status === 'CREATED') {
        try {
          await this.processPaymentUseCase.execute({ checkoutId: event.id, total: event.total });
        } catch (err) {
          console.error('Erro processando pagamento:', err);
        }
      }

      this.messageBroker.ack(msg);
    });
  }

  async consumePaymentRetry() {
    await this.messageBroker.consume('checkout.retry', async (msg) => {
      const event = JSON.parse(msg.content.toString());

      if (event.status === 'PAYMENT_RETRY') {
        try {
          await this.processPaymentUseCase.execute({ checkoutId: event.id, total: event.total });
        } catch (err) {
          console.error('Erro processando pagamento:', err);
        }
      }

      this.messageBroker.ack(msg);
    });
  }
}
