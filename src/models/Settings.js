import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    storagePath: { type: String, default: 'SysFile' },
    imageType: { type: String, default: 'jpg' },
    dateFormat: { type: String, default: 'DD-MM-YYYY' },
}, { collection: 'settingsglobal' });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
