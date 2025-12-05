import { ConsumeMessage } from "amqplib";
import { IMessageBroker } from "../../src/events/IMessageBroker";
const callbacks: Record<string, (msg: ConsumeMessage) => Promise<void>> = {};

export const MessageBrokerMock = (): jest.Mocked<IMessageBroker> => ({
    publish: jest.fn<Promise<void>, [string, any]>(),
    consume: jest.fn().mockImplementation(async (exchange: string, queue: string, cb: (msg: ConsumeMessage) => Promise<void>) => {
        callbacks[queue] = cb;
    }),
    ack: jest.fn<void, [ConsumeMessage]>()
})