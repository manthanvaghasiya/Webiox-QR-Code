import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import {
  createProfile,
  findProfilesByUser,
  generateSlug,
} from '@/lib/models/businessProfiles';
import { createQrCode } from '@/lib/models/qrCodes';
import { sanitizeProfileData } from '@/lib/sanitize';
import { customAlphabet } from 'nanoid';

const nanoid8 = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

function getBaseUrl(request) {
  return process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
}

/**
 * POST /api/business-profiles — Create a new business profile + auto-generate QR
 */
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.businessName?.trim()) {
    return NextResponse.json({ error: 'businessName is required' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const baseUrl = getBaseUrl(request);

  try {
    // Sanitize all input
    const sanitized = sanitizeProfileData(body);
    sanitized.userId = session.user.id;

    // Generate unique slug
    const slug = await generateSlug(db, sanitized.businessName);
    sanitized.slug = slug;

    // Create the QR code record pointing to /b/:slug
    const destination = `${baseUrl}/b/${slug}`;
    const qrRecord = await createQrCode(db, {
      userId: session.user.id,
      type: 'business-profile',
      isDynamic: true,
      shortId: nanoid8(),
      destination,
      name: sanitized.businessName,
    });

    sanitized.qrCodeId = qrRecord._id;

    // Create the profile
    const profile = await createProfile(db, sanitized);

    return NextResponse.json({
      success: true,
      profile: {
        _id: profile._id,
        slug: profile.slug,
        businessName: profile.businessName,
      },
      qr: {
        _id: qrRecord._id,
        shortId: qrRecord.shortId,
        destination,
      },
      pageUrl: `${baseUrl}/b/${slug}`,
    }, { status: 201 });

  } catch (err) {
    console.error('POST /api/business-profiles failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/business-profiles — List user's profiles
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const profiles = await findProfilesByUser(db, session.user.id);
    return NextResponse.json({ profiles });
  } catch (err) {
    console.error('GET /api/business-profiles failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
