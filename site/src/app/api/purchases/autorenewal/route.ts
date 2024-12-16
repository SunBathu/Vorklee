import { NextRequest, NextResponse } from 'next/server';
import PurchaseRecord from '@/models/PurchaseRecords';
import dbConnect from '@/utils/dbConnect';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { purchaseId, autoRenewal } = await req.json();

    // Validate input
    if (!purchaseId) {
      return NextResponse.json(
        { error: 'Purchase ID is required' },
        { status: 400 },
      );
    }

    // Update the autoRenewal status
    const result = await PurchaseRecord.updateOne(
      { purchaseId },
      { autoRenewal },
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Purchase record not found or already updated' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: 'Auto-renewal status updated successfully',
    });
  } catch (error) {
    console.error('Error updating auto-renewal:', error);
    return NextResponse.json(
      { error: 'Failed to update auto-renewal status' },
      { status: 500 },
    );
  }
}
