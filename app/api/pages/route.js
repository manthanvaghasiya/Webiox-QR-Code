import { NextResponse } from 'next/server';
import { createPage } from '@/lib/db/pages';
import { readJsonBodyWithLimit, validatePageInput } from '@/lib/validation/pages';

function getBaseUrl(request) {
  return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
}

export async function POST(request) {
  const bodyResult = await readJsonBodyWithLimit(request);
  if (!bodyResult.ok) {
    return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status ?? 400 });
  }

  const v = validatePageInput(bodyResult.body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: v.status ?? 400 });
  }

  try {
    const { shortId, editToken } = await createPage(v.value);
    const base = getBaseUrl(request);
    return NextResponse.json(
      {
        success: true,
        shortId,
        editToken,
        pageUrl: `${base}/p/${shortId}`,
        editUrl: `${base}/edit/${editToken}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/pages failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
