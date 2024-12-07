import mongoose from 'mongoose';

const SettingsPCWiseSchema = new mongoose.Schema({
    nickName: { type: String, default: '' },
    pcName: { type: String, required: true, unique: true },
    fileType: { type: String, default: 'Image' }, // Image or Video
    videoLength: { type: Number, default: 4 }, // Only applicable if fileType is 'mp4'
    screenshotInterval: { type: Number, default: 60 }, // Interval in seconds
    fileQuality: { type: Number, default: 50 }, // Quality percentage (0-100)
    updatedAt: { type: Date, default: Date.now },
    storageUsed: { type: Number, default: 100 }, // storage used in MB
    captureEnabled: { type: Boolean, default: true },
}, { collection: 'settingspcwise' }); // Collection name in MongoDB

export default mongoose.models.SettingsPCWise || mongoose.model('SettingsPCWise', SettingsPCWiseSchema);
