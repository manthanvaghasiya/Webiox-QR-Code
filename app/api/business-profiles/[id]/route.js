import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import {
  findProfileById,
  updateProfile,
  deleteProfile,
} from '@/lib/models/businessProfiles';
import { sanitizeProfileData } from '@/lib/sanitize';

/**
 * GET /api/business-profiles/:id — Fetch single profile (owner only)
 */
export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const client = await clientPromise;
  const db = client.db();

  try {
    const profile = await findProfileById(db, id, session.user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (err) {
    console.error(`GET /api/business-profiles/${id} failed:`, err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/business-profiles/:id — Update profile (slug never changes)
 */
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const sanitized = sanitizeProfileData(body);

    // Never allow slug changes — the QR still works
    delete sanitized.slug;
    delete sanitized.userId;
    delete sanitized.qrCodeId;

    const updated = await updateProfile(db, id, session.user.id, sanitized);
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, profile: updated });
  } catch (err) {
    console.error(`PUT /api/business-profiles/${id} failed:`, err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/business-profiles/:id — Soft delete (isActive → false)
 */
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const client = await clientPromise;
  const db = client.db();

  try {
    const result = await deleteProfile(db, id, session.user.id);
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/business-profiles/${id} failed:`, err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
