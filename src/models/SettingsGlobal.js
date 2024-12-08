// src/models/SettingsGlobal.js
import mongoose from 'mongoose';

const SettingsGlobalSchema = new mongoose.Schema({
    storagePath: { type: String, default: 'SysFile' },
    dateFormat: { type: String, default: 'DD-MM-YYYY' },
    whichFoldersToDeleteWhenStorageFull: { type: String, default: 'Delete the oldest folders among all users (Recommended)' },     //'Delete the oldest folder among all users'  || 'Delete the oldest folder for the current user'
    
}, { collection: 'settingsglobal' });

export default mongoose.models.SettingsGlobal || mongoose.model('SettingsGlobal', SettingsGlobalSchema);
