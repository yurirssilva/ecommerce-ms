import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { OrderStatus } from '../dto/order-status.enum';

@Injectable()
export class CheckoutService {
    private readonly url = 'http://checkout:3000/checkouts'
    constructor(private readonly http: HttpService) { }

    async createCheckout(dto: any) {
        const { data } = await this.http.axiosRef.post(
            this.url,
            dto,
        );
        return data;
    }

    async getCheckoutById(id: string) {
        const { data } = await this.http.axiosRef.get(
            `${this.url}/${id}`,
        );
        return data;
    }

    async updateStatus(orderId: string, status: OrderStatus) {
        const { data } = await this.http.axiosRef.patch(
            `${this.url + '/' + orderId + '/status'}`,
            { status },
        );
        return data;
    }

    async health() {
        const start = Date.now();
        const { data } = await this.http.axiosRef.get(
            `${this.url}/health`,
        );
        return {
            name: 'checkout',
            status: 'up',
            responseTime: `${Date.now() - start}ms`,
        };
    }
}