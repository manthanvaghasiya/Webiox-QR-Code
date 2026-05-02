import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { findProfileBySlug } from '@/lib/models/businessProfiles';
import { generateVCard, getVCardFilename } from '@/lib/vcard';

/**
 * GET /b/:slug/vcard — Download .vcf contact file
 */
export async function GET(request, { params }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db();

  const profile = await findProfileBySlug(db, slug);
  if (!profile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const vcf = generateVCard(profile);
  const filename = getVCardFilename(profile);

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  });
}
