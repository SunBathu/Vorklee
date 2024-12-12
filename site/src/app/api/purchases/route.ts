import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import PurchaseRecord from '@/models/PurchaseRecords';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const data = await req.json();
    const newPurchase = new PurchaseRecord(data);
    await newPurchase.save();
    return NextResponse.json(
      { message: 'Purchase record created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating purchase record:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase record' },
      { status: 500 },
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const records = await PurchaseRecord.find();
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching purchase records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase records' },
      { status: 500 },
    );
  }
}
