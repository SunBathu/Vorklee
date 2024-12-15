import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import SysFileSettingsGlobal from '@/models/SysFileSettingsGlobal';
import SysFileSettingsPCWise from '@/models/SysFileSettingsPCWise';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');
    if (!adminEmail) {
      return NextResponse.json(
        { message: 'Admin email is required' },
        { status: 400 },
      );
    }

    const globalSettings = await SysFileSettingsGlobal.findOne({ adminEmail });
    const pcSettings = await SysFileSettingsPCWise.find({ adminEmail });

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
    const { globalSettings, pcSettingsList, adminEmail } = await req.json();

    if (!adminEmail) {
      return NextResponse.json(
        { message: 'Admin email is required' },
        { status: 400 },
      );
    }

    // Update global settings for the logged-in admin
    await SysFileSettingsGlobal.updateOne(
      { adminEmail },
      { ...globalSettings, adminEmail },
      { upsert: true },
    );

    // Update PC settings concurrently for the logged-in admin
    await Promise.all(
      pcSettingsList.map((pcSetting: any) =>
        SysFileSettingsPCWise.updateOne(
          { uuid: pcSetting.uuid, adminEmail },
          { ...pcSetting, adminEmail },
          { upsert: true },
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
