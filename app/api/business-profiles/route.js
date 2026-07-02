// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS PROFILES COLLECTION — Create and list business profiles.
//
// POST /api/business-profiles — Create a profile, auto-generate QR code +
//   biolink, with retry on slug collision.
// GET  /api/business-profiles — List the current user's profiles.
// (Auth required: yes  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import {
  createProfile,
  findProfilesByUser,
  generateSlug,
  generateSlugCandidate,
} from '@/lib/models/businessProfiles';
import { createQrCode } from '@/lib/models/qrCodes';
import { createBiolink } from '@/lib/models/biolinks';
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

    // Auto-create a biolink for this business profile
    const biolink = await createBiolink(db, {
      userId: session.user.id,
      title: sanitized.businessName,
      bio: sanitized.tagline || '',
      avatarUrl: sanitized.logoUrl || null,
      blocks: [
        sanitized.contact?.phone && {
          id: nanoid8(),
          type: 'phone',
          label: 'Call',
          icon: 'phone',
          url: `tel:${sanitized.contact.phone}`,
          order: 0,
        },
        sanitized.contact?.email && {
          id: nanoid8(),
          type: 'email',
          label: 'Email',
          icon: 'email',
          url: `mailto:${sanitized.contact.email}`,
          order: 1,
        },
        sanitized.contact?.website && {
          id: nanoid8(),
          type: 'link',
          label: 'Website',
          icon: 'website',
          url: sanitized.contact.website,
          order: 2,
        },
      ].filter(Boolean),
      theme: {
        primaryColor: sanitized.theme?.primaryColor || '#4F46E5',
        secondaryColor: sanitized.theme?.secondaryColor || '#7C3AED',
        fontFamily: sanitized.theme?.fontFamily || 'Inter',
      },
    });

    sanitized.biolinkId = biolink._id;
    sanitized.biolinkSlug = biolink.slug;

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
      biolink: {
        _id: biolink._id,
        slug: biolink.slug,
      },
      pageUrl: `${baseUrl}/b/${slug}`,
      biolinkUrl: `${baseUrl}/link/${biolink.slug}`,
    }, { status: 201 });

  } catch (err) {
    console.error('POST /api/business-profiles failed:', err);

    // Handle duplicate slug (race condition) — retry with new slug
    if (err.code === 11000 || err.message.includes('duplicate')) {
      try {
        console.log('Slug collision detected, retrying...');
        const sanitized = sanitizeProfileData(body);
        sanitized.userId = session.user.id;

        // Generate a new slug with forced random suffix
        const newSlug = generateSlugCandidate(sanitized.businessName, true);
        sanitized.slug = newSlug;

        const destination = `${baseUrl}/b/${newSlug}`;
        const qrRecord = await createQrCode(db, {
          userId: session.user.id,
          type: 'business-profile',
          isDynamic: true,
          shortId: nanoid8(),
          destination,
          name: sanitized.businessName,
        });

        sanitized.qrCodeId = qrRecord._id;

        const biolink = await createBiolink(db, {
          userId: session.user.id,
          title: sanitized.businessName,
          bio: sanitized.tagline || '',
          avatarUrl: sanitized.logoUrl || null,
          blocks: [
            sanitized.contact?.phone && {
              id: nanoid8(),
              type: 'phone',
              label: 'Call',
              icon: 'phone',
              url: `tel:${sanitized.contact.phone}`,
              order: 0,
            },
            sanitized.contact?.email && {
              id: nanoid8(),
              type: 'email',
              label: 'Email',
              icon: 'email',
              url: `mailto:${sanitized.contact.email}`,
              order: 1,
            },
            sanitized.contact?.website && {
              id: nanoid8(),
              type: 'link',
              label: 'Website',
              icon: 'website',
              url: sanitized.contact.website,
              order: 2,
            },
          ].filter(Boolean),
          theme: {
            primaryColor: sanitized.theme?.primaryColor || '#4F46E5',
            secondaryColor: sanitized.theme?.secondaryColor || '#7C3AED',
            fontFamily: sanitized.theme?.fontFamily || 'Inter',
          },
        });

        sanitized.biolinkId = biolink._id;
        sanitized.biolinkSlug = biolink.slug;

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
          biolink: {
            _id: biolink._id,
            slug: biolink.slug,
          },
          pageUrl: `${baseUrl}/b/${newSlug}`,
          biolinkUrl: `${baseUrl}/link/${biolink.slug}`,
        }, { status: 201 });
      } catch (retryErr) {
        console.error('Retry failed:', retryErr);
        return NextResponse.json({ error: 'Failed to create profile (slug collision)' }, { status: 500 });
      }
    }

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
