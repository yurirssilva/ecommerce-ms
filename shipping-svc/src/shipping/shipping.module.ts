import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { CreateShippingUseCase } from "./useCases/CreateShippingUseCase";
import { IMessageBroker } from "../events/IMessageBroker";
import { RabbitMQBroker } from "../events/implementations/RabbitMQBroker";
import { IShippingRepository } from "./repositories/IShippingRepository";
import { DBShippingRepository } from "./repositories/implementations/DBShippingRepository";
import { PaymentConsumer } from "./broker/PaymentConsumer";
import { ShippingController } from "./shipping.controller";
import { GetShippingUseCase } from "./useCases/GetShippingUseCase";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        ShippingController,
    ],
    providers: [
        {
            provide: IMessageBroker,
            useClass: RabbitMQBroker,
        }, {
            provide: IShippingRepository,
            useClass: DBShippingRepository
        }, {
            provide: CreateShippingUseCase,
            useFactory: (repo: IShippingRepository, broker: IMessageBroker) => {
                return new CreateShippingUseCase(repo, broker)
            },
            inject: [IShippingRepository, IMessageBroker]
        }, {
            provide: GetShippingUseCase,
            useFactory: (repo: IShippingRepository) => {
                return new GetShippingUseCase(repo)
            },
            inject: [IShippingRepository]
        },
        PaymentConsumer,
    ],
})
export class ShippingModule { }