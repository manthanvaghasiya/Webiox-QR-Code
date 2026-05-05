import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { findBiolinkById, updateBiolink, deleteBiolink } from '@/lib/models/biolinks';

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

    const serialized = JSON.parse(JSON.stringify(biolink));
    return NextResponse.json(serialized);
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

    if (body.title !== undefined) patch.title = body.title;
    if (body.bio !== undefined) patch.bio = body.bio;
    if (body.avatarUrl !== undefined) patch.avatarUrl = body.avatarUrl;
    if (body.backgroundUrl !== undefined) patch.backgroundUrl = body.backgroundUrl;
    if (body.theme !== undefined) patch.theme = body.theme;
    if (body.blocks !== undefined) {
      patch.blocks = Array.isArray(body.blocks) ? body.blocks.map((b, idx) => ({
        id: b.id || require('crypto').randomBytes(3).toString('hex'),
        type: b.type || 'link',
        label: b.label || '',
        icon: b.icon || '',
        url: b.url || '',
        color: b.color || null,
        order: b.order ?? idx,
      })) : [];
    }
    if (body.isPublished !== undefined) patch.isPublished = body.isPublished;

    const updated = await updateBiolink(db, id, session.user.id, patch);
    if (!updated) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const serialized = JSON.parse(JSON.stringify(updated));
    return NextResponse.json(serialized);
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
