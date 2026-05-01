import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { shortIdExists } from '@/lib/models/qrCodes';

const SHORT_ID_RE = /^[a-zA-Z0-9_-]{3,32}$/;

// GET /api/qrcodes/check-slug?slug=xxx&exceptId=yyy
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug')?.trim() ?? '';
    const exceptId = searchParams.get('exceptId') ?? null;

    if (!SHORT_ID_RE.test(slug)) {
      return NextResponse.json({ available: false, reason: 'invalid' });
    }

    const client = await clientPromise;
    const db = client.db();

    const taken = await shortIdExists(db, slug, exceptId);
    return NextResponse.json({ available: !taken });
  } catch (error) {
    console.error('GET /api/qrcodes/check-slug error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
