// src/models/SettingsPCWise.js
import mongoose from 'mongoose';

const SettingsPCWiseSchema = new mongoose.Schema(
  {
    uuid: { type: String },
    adminId: { type: String, default: '' },
    adminEmail: { type: String, required: true },
    nickName: { type: String, default: 'PC' },
    pcName: { type: String, required: true },
    planName: { type: String, required: true },
    fileType: { type: String, default: 'Image' }, // 'image' or 'video'
    videoLength: { type: Number, default: 4 }, // Applicable if fileType is 'video'
    captureInterval: { type: Number, default: 60 },
    fileQuality: { type: Number, default: 80 },
    clientNotificationInterval: { type: String, default: 'NoUploadMsg' },
    lastCapturedTime: { type: Date, default: Date.now },
    storageUsed: { type: Number, default: 0 },
    captureEnabledByDeveloper: { type: Boolean, default: true },
    captureEnabledByAdmin: { type: Boolean, default: true },
    sessions: { type: String, default: '' },
    registrationTimestamp: { type: String, required: true },
    osVersion: { type: String, required: true },
    ipAddress: { type: String, required: true },
    devInfo: { type: String, default: '' },
  },
  { collection: 'sysFileSettingsPcwise' },
);

export default mongoose.models.SettingsPCWise ||
  mongoose.model('SettingsPCWise', SettingsPCWiseSchema);
