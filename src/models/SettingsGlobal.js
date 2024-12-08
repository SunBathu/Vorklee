// src/models/SettingsGlobal.js
import mongoose from 'mongoose';

const SettingsGlobalSchema = new mongoose.Schema({
    storagePath: { type: String, default: 'SysFile' },
    dateFormat: { type: String, default: 'DD-MM-YYYY' },
}, { collection: 'settingsglobal' });

export default mongoose.models.SettingsGlobal || mongoose.model('SettingsGlobal', SettingsGlobalSchema);
