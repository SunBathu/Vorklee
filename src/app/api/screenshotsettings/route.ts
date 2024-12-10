import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import SysFileSettingsGlobal from '@/models/SysFileSettingsGlobal';
import SysFileSettingsPCWise from '@/models/SysFileSettingsPCWise';

export async function GET() {
  await dbConnect();

  try {
    const globalSettings = await SysFileSettingsGlobal.findOne({});
    const pcSettings = await SysFileSettingsPCWise.find({});

    return NextResponse.json({ globalSettings, pcSettings });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to fetch settings', error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { globalSettings, pcSettingsList } = await req.json();

    // Update global settings
    await SysFileSettingsGlobal.updateOne({}, globalSettings, { upsert: true });

    // Update PC settings concurrently
    await Promise.all(
      pcSettingsList.map((pcSetting: any) =>
        SysFileSettingsPCWise.updateOne(
          { pcName: pcSetting.pcName },
          pcSetting,
          {
            upsert: true,
          },
        ),
      ),
    );

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to save settings', error: error.message },
      { status: 500 },
    );
  }
}
