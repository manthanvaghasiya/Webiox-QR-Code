import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { recordBlockClick } from '@/lib/models/biolinks';

/**
 * POST /api/biolinks/:id/track-click — Record a click on a block
 */
export async function POST(request, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { blockId } = body;
  if (!blockId) {
    return NextResponse.json({ error: 'blockId is required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    await recordBlockClick(db, id, blockId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/biolinks/:id/track-click error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
