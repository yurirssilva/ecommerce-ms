import { ConsumeMessage } from 'amqplib';
export interface IMessageBroker {
    publish(queue: string, message: any): Promise<void>;
    consume(exchange: string, queue: string, onMessage: (msg: ConsumeMessage) => Promise<void>): Promise<void>;
    ack(msg: ConsumeMessage): void; 
}

export const IMessageBroker = Symbol('IMessageBroker');
