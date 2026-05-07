// ─────────────────────────────────────────────────────────────────────────────
// BIOLINK VCARD — Download a .vcf contact card for the bio-link.
//
// GET /api/biolinks/:id/vcard — Stream a vCard file as text/vcard attachment.
// (Auth required: no  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { findBiolinkById } from '@/lib/models/biolinks';
import { generateVCardFromBiolink, getVCardFilename } from '@/lib/vcard-biolink';

/**
 * GET /api/biolinks/:id/vcard — Download .vcf contact file
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
    const vcf = generateVCardFromBiolink(biolink, baseUrl);
    const filename = getVCardFilename(biolink);

    return new NextResponse(vcf, {
      status: 200,
      headers: {
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('GET /api/biolinks/:id/vcard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
