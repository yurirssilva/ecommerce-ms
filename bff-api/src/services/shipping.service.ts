import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ShippingService {
    private readonly url = 'http://shipping:3000/shippings'
    constructor(private readonly http: HttpService) { }

    async getShippingStatus(orderId: string) {
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
            name: 'shipping',
            status: 'up',
            responseTime: `${Date.now() - start}ms`,
        };
    }
}
