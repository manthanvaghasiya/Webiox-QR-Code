import { NextResponse } from 'next/server';
import { generateProfileContent } from '@/lib/aiProfileGenerator';

/**
 * POST /api/business-profiles/generate
 * Generate AI content for a business profile.
 * Body: { businessName, category, keywords[] }
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { businessName, category, keywords } = body;

  if (!businessName?.trim()) {
    return NextResponse.json({ error: 'businessName is required' }, { status: 400 });
  }

  try {
    const result = generateProfileContent({
      businessName: String(businessName).slice(0, 120),
      category: String(category || 'general').slice(0, 60),
      keywords: Array.isArray(keywords)
        ? keywords.slice(0, 10).map((k) => String(k).slice(0, 50))
        : [],
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('POST /api/business-profiles/generate failed:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
