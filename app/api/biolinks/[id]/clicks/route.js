import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { getBlockClicks } from '@/lib/models/biolinks';

/**
 * GET /api/biolinks/:id/clicks — Get click analytics for a bio-link
 */
export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const analytics = await getBlockClicks(db, id);
    if (!analytics) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    // Enrich with per-block details
    const blockAnalytics = (analytics.blocks || []).map((block) => ({
      ...block,
      clicks: analytics.blockClicks[block.id] || 0,
    }));

    const result = {
      _id: analytics._id,
      totalClicks: analytics.totalClicks,
      blocks: blockAnalytics,
    };

    const serialized = JSON.parse(JSON.stringify(result));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('GET /api/biolinks/:id/clicks error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
