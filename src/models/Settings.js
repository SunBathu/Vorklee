import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    storagePath: { type: String, default: "SysFile/Imgs" },
    imageType: { type: String, default: "jpg" },
    dateFormat: { type: String, default: "dd.MM.yyyy" },
}, { timestamps: true });

const settings = await Settings.findOne({});
if (!settings) {
    await Settings.create({
        storagePath: "C:\\storage\\path",
        imageType: "jpg",
        dateFormat: "dd.MM.yyyy",
    });
}

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
