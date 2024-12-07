import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    storagePath: { type: String, default: '' },
    imageType: { type: String, default: 'jpg' },
    dateFormat: { type: String, default: 'dd.MM.yyyy' },
    maxFileSize: { type: Number, default: 5 },
    theme: { type: String, default: 'light' },
}, { collection: 'settingsglobal' }); // Explicitly specify the collection name

// Correct the model name to match convention (Settings)
export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
