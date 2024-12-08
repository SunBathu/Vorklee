// src/app/api/settings/route.js
import dbConnect from '@/utils/dbConnect';
import SettingsGlobal from '@/models/SettingsGlobal';
import SettingsPCWise from '@/models/SettingsPCWise';

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

        await SettingsGlobal.updateOne({}, globalSettings, { upsert: true });

        for (const pcSetting of pcSettingsList) {
            await SettingsPCWise.updateOne(
                { pcName: pcSetting.pcName },
                pcSetting,
                { upsert: true }
            );
        }

        return Response.json({ message: 'Settings saved successfully' });
    } catch (error) {
        return Response.json({ message: 'Failed to save settings', error: error.message }, { status: 500 });
    }
}
