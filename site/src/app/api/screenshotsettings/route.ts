import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import SysFileSettingsGlobal from '@/models/SysFileSettingsGlobal';
import SysFileSettingsPCWise from '@/models/SysFileSettingsPCWise';
import PurchaseRecords from '@/models/PurchaseRecords';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');
    if (!adminEmail) {
      return NextResponse.json({ message: 'Admin email is required' }, { status: 400 });
    }

    // Fetch global settings, PC settings, and active purchase plans
    const [globalSettings, pcSettings, activePlans] = await Promise.all([
      SysFileSettingsGlobal.findOne({ adminEmail }),
      SysFileSettingsPCWise.find({ adminEmail }),
      PurchaseRecords.find({ adminEmail, planExpiryDate: { $gte: new Date() } }),
    ]);

    if (!globalSettings && pcSettings.length === 0) {
      return NextResponse.json({ message: 'No settings found for this admin email.' }, { status: 404 });
    }

    return NextResponse.json({ globalSettings, pcSettings, purchasedPlans: activePlans });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Failed to fetch settings', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { globalSettings, pcSettingsList, adminEmail } = await req.json();

    if (!adminEmail) {
      return NextResponse.json({ message: 'Admin email is required' }, { status: 400 });
    }

    await Promise.all(
  pcSettingsList.map(async (pcSetting: any) => {
    const {
      uuid,
      adminEmail,
      nickName,
      planName,
      fileType,
      videoLength,
      captureInterval,
      fileQuality,
      clientNotificationInterval,
      lastCapturedTime,
      storageUsed,
      captureEnabledByDeveloper,
      captureEnabledByAdmin,
      sessions,
      registrationTimestamp,
      osVersion,
      ipAddress,
      devInfo,
    } = pcSetting;

    await SysFileSettingsPCWise.updateOne(
      { uuid, adminEmail },
      {
        uuid,
        adminEmail,
        nickName,
        planName,
        fileType,
        videoLength,
        captureInterval,
        fileQuality,
        clientNotificationInterval,
        lastCapturedTime,
        storageUsed,
        captureEnabledByDeveloper,
        captureEnabledByAdmin,
        sessions,
        registrationTimestamp,
        osVersion,
        ipAddress,
        devInfo,
      }
    );
  })
);


    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ message: 'Failed to save settings', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const uuid = req.nextUrl.searchParams.get('uuid');
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');

    if (!uuid || !adminEmail) {
      return NextResponse.json({ message: 'UUID and admin email are required' }, { status: 400 });
    }

    const result = await SysFileSettingsPCWise.deleteOne({ uuid, adminEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'No matching record found to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting record:', error);
    return NextResponse.json({ message: 'Failed to delete record', error: error.message }, { status: 500 });
  }
}
