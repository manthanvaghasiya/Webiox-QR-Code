import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import {
  createBiolink,
  findBiolinksByUser,
  generateSlug,
  createIndexes,
  isSlugReserved,
} from '@/lib/models/biolinks';

/**
 * POST /api/biolinks — Create a new bio-link
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

  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  if (body.slug && isSlugReserved(body.slug)) {
    return NextResponse.json({ error: 'slug is reserved' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    // Ensure indexes exist
    await createIndexes(db);

    // Generate unique slug if not provided
    const slug = body.slug ? body.slug : await generateSlug(db, body.title);

    const biolink = await createBiolink(db, {
      userId: session.user.id,
      slug,
      title: body.title,
      bio: body.bio || '',
      avatarUrl: body.avatarUrl || null,
      backgroundUrl: body.backgroundUrl || null,
      theme: body.theme || {},
      blocks: body.blocks || [],
    });

    const serialized = JSON.parse(JSON.stringify(biolink));
    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error('POST /api/biolinks error:', error);
    if (error.message.includes('E11000') || error.message.includes('duplicate')) {
      return NextResponse.json({ error: 'slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * GET /api/biolinks — List user's bio-links
 */
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const biolinks = await findBiolinksByUser(db, session.user.id);
    const serialized = JSON.parse(JSON.stringify(biolinks));
    return NextResponse.json(serialized);
  } catch (error) {
    console.error('GET /api/biolinks error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
