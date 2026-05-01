import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { updateQrDestination, COLLECTION } from '@/lib/models/qrCodes';
import { ObjectId } from 'mongodb';

// PATCH /api/qrcodes/:id  — update the destination of a dynamic QR code
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

    const { destination } = await request.json();
    if (!destination?.trim()) {
      return NextResponse.json({ error: 'destination is required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Admins can update any QR; regular users only their own (enforced inside helper)
    const updated = session.user.role === 'admin'
      ? await db.collection(COLLECTION).findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { destination: destination.trim(), updatedAt: new Date() } },
          { returnDocument: 'after' }
        )
      : await updateQrDestination(db, id, session.user.id, destination.trim());

    if (!updated) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    // Reject edits on static QR codes — destination is frozen by design
    if (!updated.isDynamic) {
      return NextResponse.json(
        { error: 'Static QR code destinations cannot be changed.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/qrcodes/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/qrcodes/:id
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

    const filter = session.user.role === 'admin'
      ? { _id: new ObjectId(id) }
      : { _id: new ObjectId(id), userId: new ObjectId(session.user.id) };

    const result = await db.collection(COLLECTION).deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/qrcodes/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
