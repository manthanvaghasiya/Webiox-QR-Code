import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import {
  findQrCodeById,
  updateQrCode,
  deleteQrCode,
  shortIdExists,
} from '@/lib/models/qrCodes';
import { ObjectId } from 'mongodb';

const SHORT_ID_RE = /^[a-zA-Z0-9_-]{3,32}$/;

// GET /api/qrcodes/:id
export async function GET(_request, { params }) {
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

    const userScope = session.user.role === 'admin' ? null : session.user.id;
    const qr = await findQrCodeById(db, id, userScope);
    if (!qr) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: qr });
  } catch (error) {
    console.error('GET /api/qrcodes/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/qrcodes/:id  — name, destination, isPaused, folderId, shortId, design, campaign fields
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
    const userScope = session.user.role === 'admin' ? null : session.user.id;

    const client = await clientPromise;
    const db = client.db();

    const existing = await findQrCodeById(db, id, userScope);
    if (!existing) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    const patch = {};

    if (body.name !== undefined) {
      patch.name = body.name === null ? null : String(body.name).trim().slice(0, 120);
    }

    if (body.destination !== undefined) {
      if (!existing.isDynamic) {
        return NextResponse.json(
          { error: 'Static QR code destinations cannot be changed.' },
          { status: 422 }
        );
      }
      const dest = String(body.destination).trim();
      if (!dest) {
        return NextResponse.json({ error: 'destination is required.' }, { status: 400 });
      }
      patch.destination = dest;
    }

    if (body.isPaused !== undefined) {
      patch.isPaused = !!body.isPaused;
    }

    if (body.folderId !== undefined) {
      if (body.folderId && !ObjectId.isValid(body.folderId)) {
        return NextResponse.json({ error: 'Invalid folderId.' }, { status: 400 });
      }
      patch.folderId = body.folderId || null;
    }

    if (body.shortId !== undefined) {
      if (!existing.isDynamic) {
        return NextResponse.json(
          { error: 'Only dynamic QR codes have a short URL.' },
          { status: 422 }
        );
      }
      const slug = String(body.shortId).trim();
      if (!SHORT_ID_RE.test(slug)) {
        return NextResponse.json(
          { error: 'Slug must be 3–32 chars, letters/numbers/hyphen/underscore.' },
          { status: 400 }
        );
      }
      if (slug !== existing.shortId) {
        const taken = await shortIdExists(db, slug, id);
        if (taken) {
          return NextResponse.json({ error: 'That short URL is taken.' }, { status: 409 });
        }
        patch.shortId = slug;
      }
    }

    if (body.design !== undefined && typeof body.design === 'object') {
      patch.design = { ...existing.design, ...body.design };
    }

    if (body.campaignStart !== undefined) {
      patch.campaignStart = body.campaignStart ? new Date(body.campaignStart) : null;
    }
    if (body.campaignEnd !== undefined) {
      patch.campaignEnd = body.campaignEnd ? new Date(body.campaignEnd) : null;
    }
    if (body.printRun !== undefined) patch.printRun = body.printRun;
    if (body.medium !== undefined) patch.medium = body.medium;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    }

    const updated = await updateQrCode(db, id, userScope, patch);
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

    const userScope = session.user.role === 'admin' ? null : session.user.id;
    const result = await deleteQrCode(db, id, userScope);

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/qrcodes/[id] error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
