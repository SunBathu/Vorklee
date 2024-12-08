// src/models/SettingsPCWise.js
import mongoose from 'mongoose';

const SettingsPCWiseSchema = new mongoose.Schema({
    nickName: { type: String, default: '' },
    pcName: { type: String, required: true },
    fileType: { type: String, default: 'image' }, // 'image' or 'video'
    videoLength: { type: Number, default: 4 },    // Applicable if fileType is 'video'
    screenshotInterval: { type: Number, default: 10 },
    fileQuality: { type: Number, default: 80 },
    updatedAt: { type: Date, default: Date.now },
    storageUsed: { type: String, default: '0 MB' },
    captureEnabled: { type: Boolean, default: true },
}, { collection: 'settingspcwise' });

export default mongoose.models.SettingsPCWise || mongoose.model('SettingsPCWise', SettingsPCWiseSchema);
