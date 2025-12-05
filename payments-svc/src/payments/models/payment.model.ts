import { Schema, model, Document } from 'mongoose';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED';

export interface PaymentDocument extends Document {
  id: string;
  checkoutId: string;
  total: number;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentSchema = new Schema<PaymentDocument>(
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

    total: {
      type: Number,
      required: true,
    },

    transactionId: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentModel = model<PaymentDocument>(
  'Payment',
  PaymentSchema,
);
