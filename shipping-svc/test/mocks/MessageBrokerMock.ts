import { ConsumeMessage } from "amqplib";
import { IMessageBroker } from "../../src/events/IMessageBroker";

export const MessageBrokerMock = (): jest.Mocked<IMessageBroker> => ({
    publish: jest.fn<Promise<void>, [string, any]>(),
    consume: jest.fn<Promise<void>, [string, string, (msg: ConsumeMessage) => Promise<void>]>(),
    ack: jest.fn<void, [ConsumeMessage]>()
})