import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ensureIndexes } from '@/lib/models/index';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    await ensureIndexes(db);
    return NextResponse.json({ ok: true, message: 'Indexes ensured successfully' });
  } catch (err) {
    console.error('ensureIndexes failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
