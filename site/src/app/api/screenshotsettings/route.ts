import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import SysFileSettingsGlobal from '@/models/SysFileSettingsGlobal';
import SysFileSettingsPCWise from '@/models/SysFileSettingsPCWise';
import purchaseRecords from '@/models/PurchaseRecords';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');
    if (!adminEmail) {
      return NextResponse.json({ message: 'Admin email is required' }, { status: 400 });
    }

    // Fetch global settings, PC settings (sorted by nickName), and active purchase plans
    const [globalSettings, pcSettings, activePlans] = await Promise.all([
      SysFileSettingsGlobal.findOne({ adminEmail }),
      SysFileSettingsPCWise.find({ adminEmail }).sort({ nickName: 1 }), // Sort in ascending order by nickName
      purchaseRecords.find({ adminEmail, planExpiryDate: { $gte: new Date() } }),
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

       // Update or insert the global settings
    await SysFileSettingsGlobal.updateOne(
      { adminEmail },           // Filter by adminEmail
      { $set: globalSettings }, // Update fields
      //{ upsert: true }          // Insert if not exists. YOU MUST NOT ENABLE THIS. We will create only when the first time admin purchase the plan. Not only that it prevents globalsettings save.
    );
    
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
  } catch (error) {
  let errorMessage = 'An unexpected error occurred.';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = JSON.stringify(error); // Log the entire error object if it's not a string or Error
  }

  console.error('Error saving settings:', error);
  console.error('Detailed error message:', errorMessage);

  return NextResponse.json(
    { message: 'Failed to save settings', error: errorMessage },
    { status: 500 }
  );
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
