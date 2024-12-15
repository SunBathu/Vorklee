import { NextRequest, NextResponse } from 'next/server';
import PurchaseRecord from '@/models/PurchaseRecords';
import dbConnect from '@/utils/dbConnect';

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
