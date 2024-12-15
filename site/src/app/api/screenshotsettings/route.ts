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

    if (!globalSettings && pcSettings.length === 0) {
      return NextResponse.json(
        { message: 'No settings found for this admin email.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ globalSettings, pcSettings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
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

    // Check if the admin exists in the database
    const existingUser = await SysFileSettingsGlobal.findOne({ adminEmail });
    if (!existingUser) {
      return NextResponse.json(
        {
          message:
            'Admin email not found. Please ensure you have purchased a product.',
        },
        { status: 404 },
      );
    }

    // Update global settings for the logged-in admin
    await SysFileSettingsGlobal.updateOne(
      { adminEmail },
      { ...globalSettings, adminEmail },
    );

    // Update PC settings concurrently for the logged-in admin
    // Also, handle the case where some records are missing
    await Promise.all(
      pcSettingsList.map(async (pcSetting: any) => {
        const existingPCSetting = await SysFileSettingsPCWise.findOne({
          uuid: pcSetting.uuid,
          adminEmail,
        });

        if (existingPCSetting) {
          await SysFileSettingsPCWise.updateOne(
            { uuid: pcSetting.uuid, adminEmail },
            { ...pcSetting, adminEmail },
          );
        } else {
          console.warn(`No record found for UUID: ${pcSetting.uuid}`);
        }
      }),
    );

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { message: 'Failed to save settings', error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const uuid = req.nextUrl.searchParams.get('uuid');
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');

    if (!uuid || !adminEmail) {
      return NextResponse.json(
        { message: 'UUID and admin email are required' },
        { status: 400 },
      );
    }

    const result = await SysFileSettingsPCWise.deleteOne({ uuid, adminEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'No matching record found to delete' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json(
      { message: 'Failed to delete record' },
      { status: 500 },
    );
  }
}