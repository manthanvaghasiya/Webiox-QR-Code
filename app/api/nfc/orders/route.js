import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import {
  createNfcOrder,
  findNfcOrdersByUser,
} from '@/lib/models/nfcOrders';
import { validateStringLength } from '@/lib/validation';

/**
 * POST /api/nfc/orders
 * Create a new NFC card order
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

  const { profileId, cardType, design, contactInfo, quantity } = body;

  // Validate required fields
  if (!profileId) {
    return NextResponse.json(
      { error: 'profileId is required' },
      { status: 400 }
    );
  }

  if (!cardType || !['PVC', 'Metal', 'Wood'].includes(cardType)) {
    return NextResponse.json(
      { error: 'Invalid cardType. Must be PVC, Metal, or Wood' },
      { status: 400 }
    );
  }

  if (
    !quantity ||
    typeof quantity !== 'number' ||
    quantity < 1 ||
    quantity > 500
  ) {
    return NextResponse.json(
      { error: 'quantity must be a number between 1 and 500' },
      { status: 400 }
    );
  }

  // Validate design object
  if (!design || typeof design !== 'object') {
    return NextResponse.json(
      { error: 'design object is required' },
      { status: 400 }
    );
  }

  if (design.color && !validateStringLength(design.color, 1, 50)) {
    return NextResponse.json(
      { error: 'Invalid design.color' },
      { status: 400 }
    );
  }

  if (design.logoPosition && !['top', 'center', 'bottom'].includes(design.logoPosition)) {
    return NextResponse.json(
      { error: 'design.logoPosition must be top, center, or bottom' },
      { status: 400 }
    );
  }

  // Validate contact info
  if (!contactInfo || typeof contactInfo !== 'object') {
    return NextResponse.json(
      { error: 'contactInfo object is required' },
      { status: 400 }
    );
  }

  if (!contactInfo.email || !validateStringLength(contactInfo.email, 5, 100)) {
    return NextResponse.json(
      { error: 'Valid email is required' },
      { status: 400 }
    );
  }

  if (!contactInfo.phone || !validateStringLength(contactInfo.phone, 5, 20)) {
    return NextResponse.json(
      { error: 'Valid phone is required' },
      { status: 400 }
    );
  }

  if (!contactInfo.address || !validateStringLength(contactInfo.address, 10, 200)) {
    return NextResponse.json(
      { error: 'Valid address is required' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const userId = new ObjectId(session.user.id);

    // Verify that the profile belongs to the user
    const profile = await db
      .collection('business_profiles')
      .findOne({ _id: new ObjectId(profileId), userId });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found or does not belong to you' },
        { status: 404 }
      );
    }

    // Create the NFC order
    const order = await createNfcOrder(db, {
      userId,
      profileId: new ObjectId(profileId),
      cardType,
      design,
      contactInfo,
      quantity,
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          cardType: order.cardType,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/nfc/orders failed:', error);
    return NextResponse.json(
      { error: 'Failed to create NFC order' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/nfc/orders
 * Get all NFC orders for the current user
 */
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const userId = new ObjectId(session.user.id);

    const orders = await findNfcOrdersByUser(db, userId);

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        _id: order._id,
        profileId: order.profileId,
        cardType: order.cardType,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        design: order.design,
        contactInfo: order.contactInfo,
      })),
    });
  } catch (error) {
    console.error('GET /api/nfc/orders failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFC orders' },
      { status: 500 }
    );
  }
}
