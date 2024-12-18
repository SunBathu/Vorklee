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
const activePlans = await purchaseRecords
  .find({
    adminEmail,
    planExpiryDate: { $gte: new Date() },
  })
  .select(
    'purchaseId appName planName planActivationDate planExpiryDate canUseInThisManyPC',
  );

// Define the desired order for plan names
const planOrder = ['Basic', 'Standard', 'Premium'];

// Sort by planName (custom order) and then by planExpiryDate (earlier dates first)
activePlans.sort((a, b) => {
  const planOrderA = planOrder.indexOf(a.planName);
  const planOrderB = planOrder.indexOf(b.planName);

  // First, compare by planName order
  if (planOrderA !== planOrderB) {
    return planOrderA - planOrderB;
  }

  // If planName is the same, compare by planExpiryDate (earlier first)
  return new Date(a.planExpiryDate).getTime() - new Date(b.planExpiryDate).getTime();
});

console.log('Sorted Active Plans:', activePlans);


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
