import { Module } from "@nestjs/common";
import { ProcessPaymentUseCase } from "./useCases/ProcessPaymentUseCase";
import { CheckoutConsumer } from "./broker/CheckoutConsumer";
import { IPaymentGateway } from "../gateways/IPaymentGateway";
import { MockPaymentGateway } from "../gateways/implementations/MockPaymentGateway";
import { IMessageBroker } from "../events/IMessageBroker";
import { RabbitMQBroker } from "../events/implementations/RabbitMQBroker";
import { IPaymentRepository } from "../repositories/IPaymentRepository";
import { DBPaymentRepository } from "../repositories/implementations/DBPaymentRepository";
import { DatabaseModule } from "../database/database.module";
import { GetPaymentUseCase } from "./useCases/GetPaymentUseCase";
import { PaymentController } from "./payment.controller";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        PaymentController,
    ],
    providers: [
        {
            provide: IPaymentGateway,
            useClass: MockPaymentGateway,
        }, {
            provide: IMessageBroker,
            useClass: RabbitMQBroker,
        }, {
            provide: IPaymentRepository,
            useClass: DBPaymentRepository
        },
        {
            provide: ProcessPaymentUseCase,
            useFactory: (
                repo: IPaymentRepository,
                broker: IMessageBroker,
                gateway: IPaymentGateway,
            ) => {
                return new ProcessPaymentUseCase(repo, broker, gateway);
            },
            inject: [IPaymentRepository, IMessageBroker, IPaymentGateway],
        }, {
            provide: GetPaymentUseCase,
            useFactory: (repo: IPaymentRepository) => {
                return new GetPaymentUseCase(repo);
            },
            inject: [IPaymentRepository],
        },

        CheckoutConsumer,
    ],
})
export class PaymentsModule { }