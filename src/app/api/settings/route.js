// Used for backend logic.
// It is in the correct location: src/app/api/settings/route.js

import dbConnect from '@/utils/dbConnect';
import SysFileSettingsGlobal from '@/models/SysFileSettingsGlobal';
import SysFileSettingsPCWise from '@/models/SysFileSettingsPCWise';

export async function GET() {
    await dbConnect();

    try {
        const globalSettings = await SettingsGlobal.findOne({});
        const pcSettings = await SettingsPCWise.find({});

        return Response.json({ globalSettings, pcSettings });
    } catch (error) {
        return Response.json({ message: 'Failed to fetch settings', error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { globalSettings, pcSettingsList } = await req.json();

    // Update global settings
    await SettingsGlobal.updateOne({}, globalSettings, { upsert: true });

    // Update PC settings concurrently
    await Promise.all(
      pcSettingsList.map((pcSetting) =>
        SettingsPCWise.updateOne({ pcName: pcSetting.pcName }, pcSetting, {
          upsert: true,
        }),
      ),
    );

    return Response.json({ message: 'Settings saved successfully' });
  } catch (error) {
    return Response.json(
      { message: 'Failed to save settings', error: error.message },
      { status: 500 },
    );
  }
}
