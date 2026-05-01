import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { findQrCodeById } from '@/lib/models/qrCodes';
import {
  aggregateEventsByDay,
  aggregateBy,
  uniqueScanCount,
  totalScanCount,
} from '@/lib/models/scanEvents';

// GET /api/qrcodes/:id/analytics?start=...&end=...
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const days = parseInt(searchParams.get('days') ?? '30', 10);

    const client = await clientPromise;
    const db = client.db();

    const userScope = session.user.role === 'admin' ? null : session.user.id;
    const qr = await findQrCodeById(db, id, userScope);
    if (!qr) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    const range = { start, end };

    const [byDay, osBreakdown, deviceBreakdown, browserBreakdown, countryBreakdown, cityBreakdown, totalScans, uniqueScans] = await Promise.all([
      aggregateEventsByDay(db, { qrCodeId: id }, days),
      aggregateBy(db, id, 'os', range),
      aggregateBy(db, id, 'device', range),
      aggregateBy(db, id, 'browser', range),
      aggregateBy(db, id, 'country', range),
      aggregateBy(db, id, 'city', range),
      totalScanCount(db, id, range),
      uniqueScanCount(db, id, range),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        qr,
        byDay,
        osBreakdown,
        deviceBreakdown,
        browserBreakdown,
        countryBreakdown,
        cityBreakdown,
        totalScans,
        uniqueScans,
      },
    });
  } catch (error) {
    console.error('GET /api/qrcodes/[id]/analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
