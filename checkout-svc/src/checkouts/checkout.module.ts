import { Module } from "@nestjs/common";
import { CheckoutController } from "./checkout.controller";
import { CreateCheckoutUseCase } from "./useCases/create-checkout.usecase";
import { ICheckoutRepository } from "../repositories/ICheckoutRepository";
import { DBCheckoutRepository } from "../repositories/implementations/DBCheckoutRepository";
import { IMessageBroker } from "../events/IMessageBroker";
import { RabbitMQBroker } from "../events/implementations/RabbitMQBroker";
import { DatabaseModule } from "../database/database.module";
import { PaymentConsumer } from "./broker/PaymentConsumer";
import { ShippingConsumer } from "./broker/ShippingConsumer";
import { GetCheckoutUseCase } from "./useCases/get-checkout.usecase";
import { UpdateCheckoutUseCase } from "./useCases/update-checkout.usecase";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        CheckoutController
    ],
    providers: [
        {
            provide: ICheckoutRepository,
            useClass: DBCheckoutRepository,
        }, {
            provide: IMessageBroker,
            useClass: RabbitMQBroker
        }, {
            provide: CreateCheckoutUseCase,
            useFactory: (repo: ICheckoutRepository, broker: IMessageBroker) => {
                return new CreateCheckoutUseCase(repo, broker);
            },
            inject: [ICheckoutRepository, IMessageBroker],
        }, {
            provide: GetCheckoutUseCase,
            useFactory: (repo: ICheckoutRepository) => {
                return new GetCheckoutUseCase(repo);
            },
            inject: [ICheckoutRepository],
        }, {
            provide: UpdateCheckoutUseCase,
            useFactory: (repo: ICheckoutRepository, broker: IMessageBroker) => {
                return new UpdateCheckoutUseCase(repo, broker);
            },
            inject: [ICheckoutRepository, IMessageBroker],
        },
        PaymentConsumer,
        ShippingConsumer
    ]
})
export class CheckoutModule { }