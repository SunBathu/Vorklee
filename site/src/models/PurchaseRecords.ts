import mongoose, { Schema, Document } from 'mongoose';

export interface PurchaseRecord extends Document {
  purchaseId: string;
  adminEmail: string;
  adminId: string;
  isAllowedUser: boolean;
  productId: number;
  productName: string;
  productVersion: number;
  planName: string;
  planTiers: string;
  quantity: number;
  canUseInThisManyPC: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: string;
  vendorId: string;
  vendorName: string;
  orderStatus: string;
  planPurchaseDate: Date;
  planActivationDate: Date;
  planExpiryDate: Date;
  autoRenewal: boolean;
  remarks: string;
}

const PurchaseRecordSchema: Schema = new Schema({
  purchaseId: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminId: { type: String, required: true },
  isAllowedUser: { type: Boolean, default: true },
  productId: { type: Number, required: true },
  productName: { type: String, required: true },
  productVersion: { type: Number, required: true },
  planName: { type: String, required: true },
  planTiers: { type: String, required: true },
  quantity: { type: Number, required: true },
  canUseInThisManyPC: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  orderStatus: { type: String, required: true },
  planPurchaseDate: { type: Date, default: Date.now },
  planActivationDate: { type: Date, required: true },
  planExpiryDate: { type: Date, required: true },
  autoRenewal: { type: Boolean, default: false },
  remarks: { type: String, default: '' },
});

// Explicitly specify the collection name 'purchaseRecords'
export default mongoose.models.PurchaseRecord ||
  mongoose.model<PurchaseRecord>(
    'PurchaseRecord',
    PurchaseRecordSchema,
    'purchaseRecords',
  );
