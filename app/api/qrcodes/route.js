import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { createQrCode, findQrCodesByUser, COLLECTION } from '@/lib/models/qrCodes';

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Hosted-page creation (Social, etc.) lives at POST /api/pages now.
    // Standard or dynamic QR code
    const { text, fgColor, bgColor, type, design, name, folderId, isDynamic } = body;
    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;

    // Dynamic QR codes require an authenticated user (destination can be changed later)
    if (isDynamic && !userId) {
      return NextResponse.json(
        { error: 'Sign in to create dynamic QR codes.' },
        { status: 401 }
      );
    }

    // Accept a full design object from newer clients, or build one from legacy fields
    const resolvedDesign = design ?? {
      fgColor: fgColor ?? '#000000',
      bgColor: bgColor ?? '#ffffff',
    };

    // Generate a shortId for dynamic codes; static codes leave it null
    const shortId = isDynamic
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
      : null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // Dynamic QR encodes the redirect URL, not the final destination directly
    const encodedContent = isDynamic ? `${baseUrl}/r/${shortId}` : text;

    const qr = await createQrCode(db, {
      userId,
      type: type ?? 'url',
      isDynamic: !!isDynamic,
      shortId,
      staticContent: isDynamic ? null : text,
      destination: text,
      design: resolvedDesign,
      name: name ?? null,
      folderId: folderId ?? null,
    });

    return NextResponse.json(
      { success: true, id: qr._id, shortId, encodedContent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving QR code to database:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    let codes;
    if (session.user.role === 'admin') {
      codes = await db
        .collection(COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
    } else {
      codes = await findQrCodesByUser(db, session.user.id);
    }

    return NextResponse.json({ success: true, data: codes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching QR codes from database:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
