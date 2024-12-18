// src/app/api/activePlans/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import purchaseRecords from '@/models/PurchaseRecords';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    console.log('Entrypoint: /api/activePlans');
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');

    if (!adminEmail) {
      return NextResponse.json(
        { message: 'Admin email is required' },
        { status: 400 },
      );
    }

    console.log('Admin Email:', adminEmail);
    console.log('Current Date:', new Date());

    // Fetch only active (non-expired) purchase records
    const activePlans = await purchaseRecords.find({
      adminEmail,
      planExpiryDate: { $gte: new Date() },
    }).select(
      'purchaseId appName planName planActivationDate planExpiryDate canUseInThisManyPC',
    );

    if (!activePlans.length) {
      console.log('No active plans found.');
    }

    console.log('Fetched Active Plans:', activePlans);

    return NextResponse.json({ plans: activePlans });
  } catch (error: any) {
    console.error('Error fetching active plans:', error);
    return NextResponse.json(
      { message: 'Failed to fetch active plans', error: error.message },
      { status: 500 },
    );
  }
}
