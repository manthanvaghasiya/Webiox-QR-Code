import { NextResponse } from 'next/server';
import { getPageByEditToken, updatePage } from '@/lib/db/pages';
import { readJsonBodyWithLimit, validatePageInput } from '@/lib/validation/pages';

// GET /api/pages/[token] — used by the edit UI to load current values.
// 404s on bad token (we never confirm or deny token existence beyond that).
export async function GET(_request, { params }) {
  const { token } = await params;

  try {
    const page = await getPageByEditToken(token);
    if (!page) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    // Strip editToken from the response — caller already has it in the URL.
    const { editToken: _et, ...safe } = page;
    return NextResponse.json({ success: true, page: safe });
  } catch (err) {
    console.error('GET /api/pages/[token] failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/pages/[token] — partial update. 404 on bad token (do not distinguish
// between "no such token" and "token expired" — both 404).
export async function PATCH(request, { params }) {
  const { token } = await params;

  const bodyResult = await readJsonBodyWithLimit(request);
  if (!bodyResult.ok) {
    return NextResponse.json({ error: bodyResult.error }, { status: bodyResult.status ?? 400 });
  }

  try {
    // Look up first so we know the page's type for type-specific config validation.
    const existing = await getPageByEditToken(token);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Inject existing type so the validator can dispatch config validation by type
    // without letting the caller change type (validator forbids type in PATCH bodies).
    const v = validatePageInput(
      { ...bodyResult.body, _existingType: existing.type },
      { partial: true }
    );
    if (!v.ok) {
      return NextResponse.json({ error: v.error }, { status: v.status ?? 400 });
    }

    const updated = await updatePage(token, v.value);
    if (!updated) {
      // Token vanished between lookup and update (race); treat as 404.
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { editToken: _et, ...safe } = updated;
    return NextResponse.json({ success: true, page: safe });
  } catch (err) {
    console.error('PATCH /api/pages/[token] failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
