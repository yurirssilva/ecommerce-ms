export interface Shipping {
    id: string;
    checkoutId: string;
    address: string;
    status: 'PENDING' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'FAILED';
    createdAt: Date;
    updatedAt: Date;
    trackingCode?: string;
}