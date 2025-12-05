import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentService {
    private readonly url = 'http://payment:3000/payments'
    constructor(private readonly http: HttpService) { }

    async getPaymentStatus(orderId: string) {
        const { data } = await this.http.axiosRef.get(
            `${this.url}/${orderId}`,
        );
        return data;
    }
    async health() {
        const start = Date.now();
        const { data } = await this.http.axiosRef.get(
            `${this.url}/health`,
        );
        return {
            name: 'payment',
            status: 'up',
            responseTime: `${Date.now() - start}ms`,
        };
    }
}
