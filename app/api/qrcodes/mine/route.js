import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { findQrCodesByUser } from '@/lib/models/qrCodes';

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100);
    const skip = Math.max(parseInt(searchParams.get('skip') ?? '0', 10), 0);
    const folderId = searchParams.get('folderId') ?? undefined;

    const client = await clientPromise;
    const db = client.db();

    const codes = await findQrCodesByUser(db, session.user.id, { folderId, limit, skip });

    return NextResponse.json({ success: true, data: codes, limit, skip }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user QR codes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
