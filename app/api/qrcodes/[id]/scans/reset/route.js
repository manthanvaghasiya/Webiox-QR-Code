import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { resetScanCount, findQrCodeById } from '@/lib/models/qrCodes';
import { COLLECTION as SCAN_COLLECTION } from '@/lib/models/scanEvents';

// POST /api/qrcodes/:id/scans/reset
export async function POST(_request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const userScope = session.user.role === 'admin' ? null : session.user.id;
    const qr = await findQrCodeById(db, id, userScope);
    if (!qr) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    await Promise.all([
      resetScanCount(db, id, session.user.id),
      db.collection(SCAN_COLLECTION).deleteMany({ qrCodeId: new ObjectId(id) }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/qrcodes/[id]/scans/reset error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
