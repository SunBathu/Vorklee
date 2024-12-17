import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import PurchaseRecords from '@/models/PurchaseRecords';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const adminEmail = req.nextUrl.searchParams.get('adminEmail');
    if (!adminEmail) {
      return NextResponse.json({ message: 'Admin email is required' }, { status: 400 });
    }

    // Fetch only active (non-expired) purchase records
    const activePlans = await PurchaseRecords.find({
      adminEmail,
      planExpiryDate: { $gte: new Date() }, // Only plans with future expiry date
    }).select('purchaseId planName planActivationDate planExpiryDate');

    return NextResponse.json({ plans: activePlans });
  } catch (error: any) {
    console.error('Error fetching active plans:', error);
    return NextResponse.json({ message: 'Failed to fetch plans', error: error.message }, { status: 500 });
  }
}
