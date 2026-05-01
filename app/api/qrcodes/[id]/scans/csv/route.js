import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { findQrCodeById } from '@/lib/models/qrCodes';
import { COLLECTION as SCAN_COLLECTION } from '@/lib/models/scanEvents';

const HEADERS = [
  'timestamp', 'device', 'os', 'browser',
  'country', 'region', 'city', 'referrer',
];

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// GET /api/qrcodes/:id/scans/csv
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

    const client = await clientPromise;
    const db = client.db();

    const userScope = session.user.role === 'admin' ? null : session.user.id;
    const qr = await findQrCodeById(db, id, userScope);
    if (!qr) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    const filter = { qrCodeId: new ObjectId(id) };
    if (start || end) {
      filter.timestamp = {};
      if (start) filter.timestamp.$gte = new Date(start);
      if (end) filter.timestamp.$lte = new Date(end);
    }

    const events = await db.collection(SCAN_COLLECTION)
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(50000)
      .toArray();

    const lines = [HEADERS.join(',')];
    for (const e of events) {
      lines.push([
        e.timestamp instanceof Date ? e.timestamp.toISOString() : e.timestamp,
        e.device, e.os, e.browser,
        e.country, e.region, e.city, e.referrer,
      ].map(csvEscape).join(','));
    }

    const filename = `${(qr.name || qr.shortId || 'qr').replace(/[^a-z0-9_-]+/gi, '-').toLowerCase()}-scans.csv`;

    return new NextResponse(lines.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/qrcodes/[id]/scans/csv error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
