import mongoose, { Schema, model, models } from 'mongoose';

// Define the schema for the dashboard settings
const DashboardSettingsSchema = new Schema({
  adminEmail: { type: String, required: true },
  adminId: { type: String, default: '' },
  nickName: { type: String, default: 'PC' },
  fileType: { type: String, default: 'Image' }, // 'image' or 'video'
  videoLength: { type: Number, default: 4 },
  captureInterval: { type: Number, default: 60 },
  fileQuality: { type: Number, default: 80 },
  clientNotificationInterval: { type: String, default: 'NoUploadMsg' },
  lastCapturedTime: { type: Date, default: Date.now },
  storageUsed: { type: Number, default: 0 },
  captureEnabledByAdmin: { type: Boolean, default: true },
  pcName: { type: String, required: true },
  sessions: { type: String, default: '' },
  registrationTimestamp: { type: String, required: true },
  osVersion: { type: String, required: true },
  ipAddress: { type: String, required: true },
  captureEnabledByDeveloper: { type: Boolean, default: true },
  devInfo: { type: String, default: '' },
  storagePath: { type: String, default: 'SysFile' },
  dateFormat: { type: String, default: 'DD-MM-YYYY' },
  whichFoldersToDeleteWhenStorageFull: { type: [String], default: [] },
});

// Export the model, preventing model re-registration issues
const DashboardSettings =
  models.DashboardSettings ||
  model('DashboardSettings', DashboardSettingsSchema);

export default DashboardSettings;
