import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
    storagePath: { type: String, default: "" },
    imageType: { type: String, default: "jpg" },
    dateFormat: { type: String, default: "dd.MM.yyyy" },
    maxFileSize: { type: Number, default: 5 },
    theme: { type: String, default: "light" },
});

// Explicitly specify the collection name
export default mongoose.models.SettingsGlobal || mongoose.model("SettingsGlobal", SettingsSchema, "settings_global");
