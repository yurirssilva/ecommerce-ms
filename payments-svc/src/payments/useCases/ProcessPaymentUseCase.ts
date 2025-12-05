import { Inject, Injectable } from "@nestjs/common";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { ProcessPaymentDTO } from "../dto/process-payment.dto";
import { IMessageBroker } from "../../events/IMessageBroker";
import { IPaymentGateway } from "../../gateways/IPaymentGateway";

@Injectable()
export class ProcessPaymentUseCase {
    constructor(
        @Inject(IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
        @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
        @Inject(IPaymentGateway) private readonly paymentGateway: IPaymentGateway
    ) { }
    async execute(data: ProcessPaymentDTO) {
        let payment = await this.paymentRepository.create({
            ...data,
            status: "PENDING"
        });
        try {
            const result = await this.paymentGateway.charge(data.total);
            payment.status = result.success ? 'SUCCESS' : 'FAILED'
            payment.transactionId = result.transactionId ?? null;
            await this.paymentRepository.update(payment);
            await this.messageBroker.publish('payment_events', payment);
            return payment
        } catch (error) {
            payment.status = 'FAILED';
            payment.transactionId = payment.transactionId ?? null;
            await this.paymentRepository.update(payment);
            await this.messageBroker.publish('payment_events', payment);
            throw (error)
        }
    }
}