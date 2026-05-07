// ─────────────────────────────────────────────────────────────────────────────
// AI ANALYTICS INSIGHTS — Generate Claude-powered insights from user analytics.
//
// POST /api/ai/analytics-insights — Aggregate QR/profile/biolink stats and ask
//   the AI for insights; results cached for 6h per user.
// (Auth required: yes  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { generateAnalyticsInsightsAI } from '@/lib/ai/client';

const INSIGHTS_CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * POST /api/ai/analytics-insights
 * Generate AI insights from user's analytics data
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const userId = new ObjectId(session.user.id);

    // Check for cached insights
    const cacheCollection = db.collection('analytics_insights_cache');
    const cached = await cacheCollection.findOne({
      userId,
      createdAt: { $gt: new Date(Date.now() - INSIGHTS_CACHE_TTL) },
    });

    if (cached) {
      return NextResponse.json({
        success: true,
        insights: cached.insights,
        cached: true,
      });
    }

    // Fetch analytics data
    const qrCodes = await db
      .collection('generated_codes')
      .find({ userId })
      .project({ _id: 1, name: 1, type: 1, scanCount: 1, createdAt: 1 })
      .sort({ scanCount: -1 })
      .limit(10)
      .toArray();

    const profiles = await db
      .collection('business_profiles')
      .find({ userId, isActive: true })
      .project({
        _id: 1,
        businessName: 1,
        totalScans: 1,
        totalCalls: 1,
        totalDirectionClicks: 1,
        createdAt: 1,
      })
      .limit(10)
      .toArray();

    const biolinks = await db
      .collection('biolinks')
      .find({ userId })
      .project({
        _id: 1,
        slug: 1,
        totalClicks: 1,
        blockClicks: 1,
        createdAt: 1,
      })
      .limit(10)
      .toArray();

    // Compile analytics data for AI
    const analyticsData = {
      qrCodes: {
        total: qrCodes.length,
        topPerformers: qrCodes.slice(0, 5).map((q) => ({
          name: q.name,
          scans: q.scanCount,
        })),
        totalScans: qrCodes.reduce((sum, q) => sum + (q.scanCount || 0), 0),
      },
      profiles: {
        total: profiles.length,
        totalScans: profiles.reduce((sum, p) => sum + (p.totalScans || 0), 0),
        totalCalls: profiles.reduce((sum, p) => sum + (p.totalCalls || 0), 0),
        totalDirections: profiles.reduce(
          (sum, p) => sum + (p.totalDirectionClicks || 0),
          0
        ),
      },
      biolinks: {
        total: biolinks.length,
        totalClicks: biolinks.reduce((sum, b) => sum + (b.totalClicks || 0), 0),
      },
      accountAge: profiles.length > 0
        ? Math.floor((Date.now() - new Date(profiles[0].createdAt)) / (24 * 3600 * 1000))
        : 0,
    };

    // Generate AI insights
    const aiInsights = await generateAnalyticsInsightsAI(analyticsData);

    // Cache the insights
    await cacheCollection.updateOne(
      { userId },
      {
        $set: {
          userId,
          insights: aiInsights.insights || [],
          summary: aiInsights.summary || '',
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      insights: aiInsights.insights || [],
      summary: aiInsights.summary || '',
      cached: false,
    });
  } catch (error) {
    console.error('POST /api/ai/analytics-insights failed:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
