import { Schema, model, Document } from 'mongoose';

export type ShippingStatus =
    | 'PENDING'
    | 'PREPARING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'FAILED';

export interface ShippingDocument extends Document {
    id: string;
    checkoutId: string;
    address: string;
    trackingCode?: string;
    status: ShippingStatus;
    createdAt: Date;
    updatedAt: Date;
}

export const ShippingSchema = new Schema<ShippingDocument>(
    {
        id: {
            type: String,
            required: true,
            default: () => crypto.randomUUID(),
            unique: true,
        },

        checkoutId: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        trackingCode: {
            type: String,
            required: false,
        },

        status: {
            type: String,
            enum: ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'FAILED'],
            default: 'PENDING',
        },
    },
    {
        timestamps: true,
    },
);

export const ShippingModel = model<ShippingDocument>(
    'Shipping',
    ShippingSchema,
);
