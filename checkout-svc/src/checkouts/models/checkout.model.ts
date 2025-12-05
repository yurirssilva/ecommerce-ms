import { Schema, model, Document } from 'mongoose';

export type CheckoutStatus =
    | 'CREATED'
    | 'PAID'
    | 'REJECTED'
    | 'PAYMENT_RETRY'
    | 'SHIPPED'
    | 'CANCELED';

export interface CheckoutDocument extends Document {
    id: string;
    customerId: string;
    items: any;
    total: number;
    status: CheckoutStatus;
    createdAt: Date;
    updatedAt: Date;
}

export const CheckoutSchema = new Schema<CheckoutDocument>(
    {
        id: {
            type: String,
            required: true,
            default: () => crypto.randomUUID(),
            unique: true,
        },

        customerId: {
            type: String,
            required: true,
        },

        items: {
            type: Schema.Types.Mixed,
            required: true,
        },

        total: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ['CREATED', 'PAID', 'REJECTED', 'PAYMENT_RETRY', 'SHIPPED', 'CANCELED'],
            default: 'CREATED',
        },
    },
    {
        timestamps: true,
    },
);

export const CheckoutModel = model<CheckoutDocument>(
    'Checkout',
    CheckoutSchema,
);