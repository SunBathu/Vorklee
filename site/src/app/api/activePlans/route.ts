import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import PurchaseRecords from '@/models/PurchaseRecords';

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

    // Fetch only active (non-expired) purchase records
    const activePlans = await PurchaseRecords.find({
      adminEmail,
      planExpiryDate: { $gte: new Date() },
    }).select(
      'purchaseId appName planName planActivationDate planExpiryDate canUseInThisManyPC',
    );

    console.log('Fetched Active Plans:', activePlans);

    // Aggregate the total usable PCs for each unique combination of appName and planName
    const aggregatedPlans = activePlans.reduce((acc, plan) => {
      const {
        appName,
        planName,
        planActivationDate,
        planExpiryDate,
        canUseInThisManyPC,
      } = plan;
      const key = `${appName}-${planName}`;

      if (!acc[key]) {
        acc[key] = {
          appName,
          planName,
          totalUsablePCs: 0,
          activationDates: [],
          expiryDates: [],
        };
      }

      acc[key].totalUsablePCs += canUseInThisManyPC;
      acc[key].activationDates.push(planActivationDate);
      acc[key].expiryDates.push(planExpiryDate);

      return acc;
    }, {} as Record<string, { appName: string; planName: string; totalUsablePCs: number; activationDates: Date[]; expiryDates: Date[] }>);

    // Convert the aggregated object to an array
    const plansWithTotalUsage = Object.values(aggregatedPlans);

    console.log('Aggregated Plans with Total Usable PCs:', plansWithTotalUsage);

    return NextResponse.json({ plans: plansWithTotalUsage });
  } catch (error: any) {
    console.error('Error fetching active plans:', error);
    return NextResponse.json(
      { message: 'Failed to fetch active plans', error: error.message },
      { status: 500 },
    );
  }
}
