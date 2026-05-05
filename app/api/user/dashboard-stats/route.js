import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';

/**
 * GET /api/user/dashboard-stats
 * Get dashboard metrics for the current user
 */
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const userId = new ObjectId(session.user.id);

    // Fetch all metrics in parallel
    const [
      qrCodeCount,
      profileCount,
      totalScans,
      nfcOrderCount,
      totalProfileVisits,
      recentQrs,
      recentProfiles,
    ] = await Promise.all([
      // Count QR codes
      db
        .collection('generated_codes')
        .countDocuments({ userId }),

      // Count business profiles
      db
        .collection('business_profiles')
        .countDocuments({ userId, isActive: true }),

      // Sum total scans from all QR codes
      db
        .collection('generated_codes')
        .aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: '$scanCount' } } },
        ])
        .toArray()
        .then((r) => r[0]?.total || 0),

      // Count NFC orders
      db
        .collection('nfc_orders')
        .countDocuments({ userId }),

      // Sum total profile visits from ALL active profiles
      db
        .collection('business_profiles')
        .aggregate([
          { $match: { userId, isActive: true } },
          { $group: { _id: null, total: { $sum: '$totalScans' } } }
        ])
        .toArray()
        .then((r) => r[0]?.total || 0),

      // Get recent QR codes (last 5)
      db
        .collection('generated_codes')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .project({
          _id: 1,
          name: 1,
          type: 1,
          scanCount: 1,
          createdAt: 1,
        })
        .toArray(),

      // Get recent business profiles (last 5)
      db
        .collection('business_profiles')
        .find({ userId, isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .project({
          _id: 1,
          businessName: 1,
          slug: 1,
          totalScans: 1,
          totalCalls: 1,
          createdAt: 1,
          theme: 1,
        })
        .toArray(),
    ]);


    return NextResponse.json({
      success: true,
      stats: {
        qrCodes: qrCodeCount,
        profiles: profileCount,
        totalScans,
        profileVisits: totalProfileVisits,
        nfcOrders: nfcOrderCount,
      },
      recent: {
        qrs: recentQrs,
        profiles: recentProfiles,
      },
    });
  } catch (error) {
    console.error('GET /api/user/dashboard-stats failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
