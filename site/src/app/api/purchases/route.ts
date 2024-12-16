// site/src/app/api/purchases/route.ts

import { NextRequest, NextResponse } from 'next/server';
import PurchaseRecord from '@/models/PurchaseRecords';
import dbConnect from '@/utils/dbConnect';

// Handle GET and POST requests
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

    const records = await PurchaseRecord.find({ adminEmail });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching purchase records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase records' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const purchaseData = await req.json();
    const newPurchase = new PurchaseRecord(purchaseData);
    await newPurchase.save();

    return NextResponse.json({ message: 'Purchase saved successfully' });
  } catch (error) {
    console.error('Error saving purchase record:', error);
    return NextResponse.json(
      { error: 'Failed to save purchase record'  },
      { status: 500 },
    );
  }
}
