import { NextResponse } from 'next/server';
import PurchaseRecord from '@/models/PurchaseRecords';
import dbConnect from '@/utils/dbConnect';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    console.log('Received data:', data);

    const newPurchase = new PurchaseRecord(data);
    await newPurchase.save();

    return NextResponse.json(
      { message: 'Purchase record created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error saving purchase record:', error);

    if (error instanceof Error) {
      // Handle generic errors
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'errors' in error
    ) {
      // Handle Mongoose validation errors
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 },
      );
    } else {
      // Handle unknown errors
      return NextResponse.json(
        { error: 'Unknown error occurred' },
        { status: 500 },
      );
    }
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
