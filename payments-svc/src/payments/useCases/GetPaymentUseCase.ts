import { Inject, Injectable } from "@nestjs/common";
import { IPaymentRepository } from "../../repositories/IPaymentRepository";
import { Payment } from "../entities/payment.entity";


@Injectable()
export class GetPaymentUseCase {
    constructor(
        @Inject(IPaymentRepository) private readonly paymentRepository: IPaymentRepository,
    ) { }

    async execute(id: string): Promise<Payment[]> {
        const payment = await this.paymentRepository.findByCheckoutId(id);
        return payment;
    }
}