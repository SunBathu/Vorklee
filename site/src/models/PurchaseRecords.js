import mongoose from 'mongoose';

const PurchaseRecordsSchema = new mongoose.Schema({
  purchaseId: { type: String, required: true },
  adminEmail: { type: String, required: true },
  adminId: { type: String, required: true },
  isAllowedUser: { type: Boolean, required: true, default: false },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productVersion: { type: String, default: '1' },
  quantity: { type: Number, required: true, default: 1 },
  canUseInThisManyPC: { type: Number, required: true, default: 0 },
  unitPriceUSD: { type: Number, required: true, default: 0 },
  totalPriceUSD: { type: Number, required: true, default: 0 },
  purchaseDate: { type: Date, required: true, default: Date.now },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true, default: 'Pending' },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  orderStatus: { type: String, required: true, default: 'Pending' },
  deliveryDate: { type: Date },
  remarks: { type: String, default: '' },
},
  { collection: 'purchaseRecords' },
);

export default mongoose.models.PurchaseRecords ||
  mongoose.model('PurchaseRecords', PurchaseRecordsSchema);
