import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { findQrCodesByUser, countQrCodesByUser } from '@/lib/models/qrCodes';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100', 10), 200);
    const skip = Math.max(parseInt(searchParams.get('skip') ?? '0', 10), 0);
    const folderId = searchParams.get('folderId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const search = searchParams.get('search') ?? undefined;
    const sort = searchParams.get('sort') ?? 'recent';

    const client = await clientPromise;
    const db = client.db();

    const [codes, total] = await Promise.all([
      findQrCodesByUser(db, session.user.id, { folderId, status, search, sort, limit, skip }),
      countQrCodesByUser(db, session.user.id),
    ]);

    return NextResponse.json(
      { success: true, data: codes, total, limit, skip },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user QR codes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
