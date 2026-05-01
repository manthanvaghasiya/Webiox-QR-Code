import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { createFolder, findFoldersByUser } from '@/lib/models/folders';

// GET /api/folders — list current user's folders
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const folders = await findFoldersByUser(db, session.user.id);
    return NextResponse.json({ success: true, data: folders });
  } catch (error) {
    console.error('GET /api/folders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/folders — create a folder
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, color } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'name is required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const folder = await createFolder(db, {
      userId: session.user.id,
      name: name.trim(),
      color: color ?? null,
    });

    return NextResponse.json({ success: true, data: folder }, { status: 201 });
  } catch (error) {
    console.error('POST /api/folders error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
