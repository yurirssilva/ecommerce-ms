export interface Checkout {
    id: string;
    customerId: string;
    items: any[];
    total: number;
    status: 'CREATED' | 'PAID' | 'REJECTED' | 'PAYMENT_RETRY' | 'SHIPPED' | 'CANCELED';
    createdAt: Date;
    updatedAt: Date;
}