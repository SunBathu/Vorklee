import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import DashboardSettings from '@/models/dashboardSettings';

export async function GET() {
  try {
    await dbConnect();
    const settings = await DashboardSettings.findOne();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 },
    );
  }
}
