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

    const today = new Date();

    // Fetch global settings and PC settings
    const [globalSettings, pcSettings, purchaseRecords] = await Promise.all([
      SysFileSettingsGlobal.findOne({ adminEmail }),
      SysFileSettingsPCWise.find({ adminEmail }),
      PurchaseRecords.find({
        adminEmail,
        isAllowedUser: true,
        appName: 'Screenshot Capture App',
        planExpiryDate: { $gte: today },
      }),
    ]);

    // Get the purchase IDs
    const purchaseIds = purchaseRecords.map((record) => record.purchaseId);

    // Aggregate to count the usage of each purchaseId in SysFileSettingsPCWise
    const usageCounts = await SysFileSettingsPCWise.aggregate([
      { $match: { planName: { $in: purchaseIds } } },
      { $group: { _id: '$planName', count: { $sum: 1 } } },
    ]);

    // Create a lookup map for usage counts
    const usageMap = usageCounts.reduce((map, { _id, count }) => {
      map[_id] = count;
      return map;
    }, {} as Record<string, number>);

    // Filter purchase records based on usage counts
    const filteredPurchaseRecords = purchaseRecords.filter((record) => {
      const assignedCount = usageMap[record.purchaseId] || 0;
      return assignedCount < record.canUseInThisManyPC;
    });

    return NextResponse.json({ globalSettings, pcSettings, availablePlans: filteredPurchaseRecords });
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

    // Conditionally update global settings if present
    if (globalSettings) {
      await SysFileSettingsGlobal.updateOne(
        { adminEmail },
        { $set: globalSettings }
      );
    }

    // Update PC settings
    if (pcSettingsList && pcSettingsList.length > 0) {
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
    }

    return NextResponse.json({ message: 'Settings saved successfully' });
  } catch (error) {
  let errorMessage = 'An unexpected error occurred.';

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String(error.message);
  }

  console.error('Error saving settings:', error);
  return NextResponse.json({ message: 'Failed to save settings', error: errorMessage }, { status: 500 });}
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
