// ─────────────────────────────────────────────────────────────────────────────
// BIOLINK MECARD — Get MECARD-formatted string for QR encoding.
//
// GET /api/biolinks/:id/mecard — Return MECARD string + title/slug.
// (Auth required: no  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { findBiolinkById } from '@/lib/models/biolinks';
import { generateMeCard } from '@/lib/vcardBiolink';

/**
 * GET /api/biolinks/:id/mecard — Get meCard string for QR code encoding
 */
export async function GET(request, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const biolink = await findBiolinkById(db, id);
    if (!biolink) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const mecard = generateMeCard(biolink, baseUrl);

    return NextResponse.json({
      success: true,
      mecard,
      title: biolink.title,
      slug: biolink.slug,
    });
  } catch (error) {
    console.error('GET /api/biolinks/:id/mecard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
