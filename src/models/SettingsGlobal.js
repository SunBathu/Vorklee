// src/models/SettingsGlobal.js
import mongoose from 'mongoose';

const SettingsGlobalSchema = new mongoose.Schema(
  {
    storagePath: { type: String, default: 'SysFile' },
    dateFormat: { type: String, default: 'DD-MM-YYYY' },
    whichFoldersToDeleteWhenStorageFull: {
      type: String,
      default:
        'AmongAll: Delete the oldest folders among all users (Recommended)',
    }, //'Delete the oldest folder among all users'  || 'SameUser: Delete the oldest folder from the same user'
  },
  { collection: 'settingsglobal' },
);

export default mongoose.models.SettingsGlobal ||
  mongoose.model('SettingsGlobal', SettingsGlobalSchema);
