import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { deleteFolder } from '@/lib/models/folders';
import { COLLECTION as QR_COLLECTION } from '@/lib/models/qrCodes';
import { ObjectId } from 'mongodb';

// DELETE /api/folders/:id — delete folder, unset folderId on its QR codes
export async function DELETE(_request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await deleteFolder(db, id, session.user.id);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    // Unlink QR codes that were inside this folder
    await db.collection(QR_COLLECTION).updateMany(
      {
        userId: new ObjectId(session.user.id),
        folderId: new ObjectId(id),
      },
      { $set: { folderId: null, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/folders/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/folders/:id — rename or recolor
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
    }

    const body = await request.json();
    const patch = {};
    if (body.name !== undefined) patch.name = String(body.name).trim();
    if (body.color !== undefined) patch.color = body.color;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const updated = await db.collection('folders').findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(session.user.id),
      },
      { $set: patch },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/folders/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
