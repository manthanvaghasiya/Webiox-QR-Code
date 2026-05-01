import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { countQrCodesByUser } from '@/lib/models/qrCodes';
import { countScansForUser } from '@/lib/models/scanEvents';

const PLAN_LIMITS = {
  free: { dynamicLimit: 5, label: 'Free' },
  pro: { dynamicLimit: 250, label: 'Pro' },
  business: { dynamicLimit: null, label: 'Business' },
};

// GET /api/user/summary — counts for sidebar widgets
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const userId = new ObjectId(session.user.id);
    const [qrCount, dynamicCount, weeklyScans] = await Promise.all([
      countQrCodesByUser(db, session.user.id),
      db.collection('qr_codes').countDocuments({ userId, isDynamic: true }),
      countScansForUser(db, session.user.id, 7),
    ]);

    const plan = session.user.plan || 'free';
    const planInfo = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

    const since = new Date();
    since.setDate(since.getDate() - 7);

    return NextResponse.json({
      success: true,
      data: {
        qrCount,
        dynamicCount,
        weeklyScans,
        plan,
        planLabel: planInfo.label,
        dynamicLimit: planInfo.dynamicLimit,
        weeklyScansSince: since.toISOString(),
      },
    });
  } catch (error) {
    console.error('GET /api/user/summary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
