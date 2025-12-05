export interface Payment {
    id: string;
    checkoutId: string;
    total: number;
    transactionId?: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
}