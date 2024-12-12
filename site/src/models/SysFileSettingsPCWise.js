// src/models/SettingsPCWise.js
import mongoose from 'mongoose';

const SettingsPCWiseSchema = new mongoose.Schema({
    adminEmail: { type: String, required: true }, 
    adminId: { type: String, default: '' },    
    nickName: { type: String, default: 'PC' },   
    fileType: { type: String, default: 'Image' }, // 'image' or 'video'
    videoLength: { type: Number, default: 4 },    // Applicable if fileType is 'video'
    captureInterval: { type: Number, default: 60 },
    fileQuality: { type: Number, default: 80 },
    clientNotificationInterval: { type: String, default: 'NoUploadMsg' },
    lastCapturedTime: { type: Date, default: Date.now },    
    storageUsed: { type: Number, default: 0 },
    captureEnabled: { type: Boolean, default: true },
    pcName: { type: String, required: true },
    sessions: { type: String, default: '' },
    registrationTimestamp: { type: String, required: true },
    osVersion: { type: String, required: true },
    ipAddress: { type: String, required: true },
    devAllowToRun: { type: Boolean, default: true },
    devInfo: { type: String, default: '' },
}, { collection: 'sysFileSettingsPcwise' });

export default mongoose.models.SettingsPCWise || mongoose.model('SettingsPCWise', SettingsPCWiseSchema);
