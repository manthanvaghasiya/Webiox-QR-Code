import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { findProfileById } from '@/lib/models/businessProfiles';
import { ObjectId } from 'mongodb';

const SCAN_EVENTS = 'scan_events';

/**
 * GET /api/business-profiles/:id/analytics — Aggregated analytics data
 */
export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const client = await clientPromise;
  const db = client.db();

  try {
    // Verify ownership
    const profile = await findProfileById(db, id, session.user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const profileOid = new ObjectId(id);
    const { searchParams } = new URL(request.url);
    const days = Math.min(Number(searchParams.get('days')) || 30, 365);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const col = db.collection(SCAN_EVENTS);

    // Run all aggregation pipelines in parallel
    const [dailyVisits, eventBreakdown, topCountries, totalUnique] = await Promise.all([
      // Daily visits
      col.aggregate([
        { $match: { profileId: profileOid, timestamp: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
            unique: { $addToSet: '$ip' },
          },
        },
        { $project: { _id: 1, count: 1, uniqueCount: { $size: '$unique' } } },
        { $sort: { _id: 1 } },
      ]).toArray(),

      // Event type breakdown
      col.aggregate([
        { $match: { profileId: profileOid, timestamp: { $gte: since } } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      // Top countries
      col.aggregate([
        { $match: { profileId: profileOid, timestamp: { $gte: since }, country: { $ne: null } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),

      // Total unique visitors
      col.aggregate([
        { $match: { profileId: profileOid, ip: { $ne: null } } },
        { $group: { _id: null, unique: { $addToSet: '$ip' } } },
        { $project: { count: { $size: '$unique' } } },
      ]).toArray(),
    ]);

    return NextResponse.json({
      profile: {
        _id: profile._id,
        businessName: profile.businessName,
        slug: profile.slug,
        totalScans: profile.totalScans,
        totalCalls: profile.totalCalls,
        totalDirectionClicks: profile.totalDirectionClicks,
        totalContactSaves: profile.totalContactSaves,
      },
      uniqueVisitors: totalUnique[0]?.count ?? 0,
      dailyVisits,
      eventBreakdown,
      topCountries,
      days,
    });

  } catch (err) {
    console.error(`GET /api/business-profiles/${id}/analytics failed:`, err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
