import { Injectable, OnModuleInit } from "@nestjs/common";
import ampq, { connect, Channel, ConsumeMessage, Connection } from "amqplib";
import { IMessageBroker } from "../IMessageBroker";

@Injectable()
export class RabbitMQBroker implements IMessageBroker, OnModuleInit {
    private connection: Connection;
    private channel: Channel;

    async onModuleInit() {
        await this.connectGlobalChannel();
    }

    private async connectGlobalChannel() {
        this.connection = await ampq.connect(process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672");
        this.channel = await this.connection.createChannel();
        console.log("[RabbitMQ] Connected");
    }

    async publish(queue: string, message: any): Promise<void> {
        let publishChannel: Channel;

        if (!this.channel) {
            const connection = await connect(process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672");
            publishChannel = await connection.createChannel();
            console.log("[RabbitMQ] Connected");
            await publishChannel.assertQueue(queue, { durable: true });
            publishChannel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            await publishChannel.close();
            await connection.close();
        } else {
            await this.channel.assertQueue(queue, { durable: true });
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        }
    }

    async consume(exchange: string, queue: string, onMessage: (msg: ConsumeMessage) => Promise<void>) {
        if (!this.channel) {
            await this.connectGlobalChannel();
        }
        await this.channel.assertExchange(exchange, 'fanout', { durable: true });
        await this.channel.assertQueue(queue, { durable: true });
        await this.channel.bindQueue(queue, exchange, '');
        this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    await onMessage(msg);
                } catch (err) {
                    console.error('Erro processando mensagem', err);
                }
            }
        });
    }
    
    ack(msg: ConsumeMessage) {
        if (!this.channel) {
            throw new Error('RabbitMQ channel not initialized');
        }
        this.channel.ack(msg);
    }
}