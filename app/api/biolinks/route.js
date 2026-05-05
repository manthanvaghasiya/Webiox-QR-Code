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
import { validateStringLength, validateTheme, validateBlocks } from '@/lib/validation';

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

  if (!body.title?.trim() || !validateStringLength(body.title, 1, 100)) {
    return NextResponse.json({ error: 'title must be 1-100 characters' }, { status: 400 });
  }

  if (body.slug && isSlugReserved(body.slug)) {
    return NextResponse.json({ error: 'slug is reserved' }, { status: 400 });
  }

  // Validate optional fields
  if (body.bio && !validateStringLength(body.bio, 0, 500)) {
    return NextResponse.json({ error: 'bio must be 0-500 characters' }, { status: 400 });
  }

  if (body.theme) {
    try {
      validateTheme(body.theme);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }

  if (body.blocks) {
    try {
      validateBlocks(body.blocks);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
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

    return NextResponse.json(biolink, { status: 201 });
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
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();

  try {
    const biolinks = await findBiolinksByUser(db, session.user.id);
    return NextResponse.json(biolinks);
  } catch (error) {
    console.error('GET /api/biolinks error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
