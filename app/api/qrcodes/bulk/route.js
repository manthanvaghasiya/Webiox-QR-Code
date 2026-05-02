import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { createQrCode } from '@/lib/models/qrCodes';

const MAX_ROWS = 500;

// POST /api/qrcodes/bulk
// body: { rows: [{ name, destination, isDynamic }, ...], design }
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows, design } = await request.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'rows is required.' }, { status: 400 });
    }
    if (rows.length > MAX_ROWS) {
      return NextResponse.json({ error: `Too many rows (max ${MAX_ROWS}).` }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;

    const created = [];
    const failed = [];

    for (const row of rows) {
      const dest = String(row.destination || row.url || '').trim();
      if (!dest) {
        failed.push({ row, reason: 'empty destination' });
        continue;
      }
      try {
        const isDynamic = row.isDynamic !== false;
        const shortId = isDynamic
          ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
          : null;

        const qr = await createQrCode(db, {
          userId: session.user.id,
          type: 'url',
          isDynamic,
          shortId,
          destination: dest,
          staticContent: isDynamic ? null : dest,
          design: design || {},
          name: row.name?.trim() || null,
        });

        created.push({
          id: qr._id,
          shortId,
          encodedContent: isDynamic ? `${baseUrl}/r/${shortId}` : dest,
        });
      } catch (e) {
        failed.push({ row, reason: e.message });
      }
    }

    return NextResponse.json(
      { success: true, created: created.length, failed: failed.length, results: { created, failed } },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/qrcodes/bulk error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
