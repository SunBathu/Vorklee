import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    return NextResponse.json({ message: 'Database connected successfully!' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to connect to the database.' },
      { status: 500 },
    );
  }
}
