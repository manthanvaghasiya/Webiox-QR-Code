// ─────────────────────────────────────────────────────────────────────────────
// BIOLINKS ITEM — Read, update, and soft-delete a single bio-link.
//
// GET    /api/biolinks/:id — Fetch one bio-link (public if published).
// PUT    /api/biolinks/:id — Update title/bio/theme/blocks/published state.
// DELETE /api/biolinks/:id — Soft-delete the bio-link.
// (Auth required: PUT/DELETE yes; GET no  ·  Admin only: no)
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { findBiolinkById, updateBiolink, deleteBiolink } from '@/lib/models/biolinks';
import { validateBlocks, validateTheme, validateStringLength } from '@/lib/validation';
import { customAlphabet } from 'nanoid';

const nanoid6 = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6);

/**
 * GET /api/biolinks/:id — Get a specific bio-link
 */
export async function GET(request, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const biolink = await findBiolinkById(db, id, userId);
    if (!biolink) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(biolink);
  } catch (error) {
    console.error('GET /api/biolinks/:id error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT /api/biolinks/:id — Update a bio-link
 */
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const patch = {};

    if (body.title !== undefined) {
      if (!validateStringLength(body.title, 1, 100)) {
        return NextResponse.json({ error: 'Title must be 1-100 characters' }, { status: 400 });
      }
      patch.title = body.title;
    }

    if (body.bio !== undefined) {
      if (body.bio && !validateStringLength(body.bio, 0, 500)) {
        return NextResponse.json({ error: 'Bio must be 0-500 characters' }, { status: 400 });
      }
      patch.bio = body.bio;
    }

    if (body.avatarUrl !== undefined) patch.avatarUrl = body.avatarUrl;
    if (body.backgroundUrl !== undefined) patch.backgroundUrl = body.backgroundUrl;

    if (body.theme !== undefined) {
      try {
        patch.theme = validateTheme(body.theme);
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    if (body.blocks !== undefined) {
      try {
        const validatedBlocks = validateBlocks(body.blocks);
        patch.blocks = validatedBlocks.map(b => ({
          ...b,
          id: b.id || nanoid6(),
        }));
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    if (body.isPublished !== undefined) patch.isPublished = body.isPublished;

    const updated = await updateBiolink(db, id, session.user.id, patch);
    if (!updated) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/biolinks/:id error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/biolinks/:id — Delete a bio-link (soft delete)
 */
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const deleted = await deleteBiolink(db, id, session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/biolinks/:id error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
