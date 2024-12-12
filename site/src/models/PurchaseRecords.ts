import mongoose, { Schema, Document } from 'mongoose';

export interface PurchaseRecord extends Document {
  purchaseId: string;
  adminEmail: string;
  adminId: string;
  isAllowedUser: boolean;
  productId: string;
  productName: string;
  productVersion: string;
  planName: string;
  quantity: number;
  canUseInThisManyPC: number;
  unitPriceUSD: number;
  totalPriceUSD: number;
  paymentMethod: string;
  paymentStatus: string;
  vendorId: string;
  vendorName: string;
  orderStatus: string;
  planPurchaseDate: Date;
  planStartDate: Date;
  planExpiryDate: Date;
  autoRenewal: boolean;
  remarks: string;
}

const PurchaseRecordSchema: Schema = new Schema({
  purchaseId: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminId: { type: String, required: true },
  isAllowedUser: { type: Boolean, default: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productVersion: { type: String, required: true },
  planName: { type: String, required: true },
  quantity: { type: Number, required: true },
  canUseInThisManyPC: { type: Number, required: true },
  unitPriceUSD: { type: Number, required: true },
  totalPriceUSD: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  orderStatus: { type: String, required: true },
  planPurchaseDate: { type: Date, default: Date.now },
  planStartDate: { type: Date, required: true },
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
