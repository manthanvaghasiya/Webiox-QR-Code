import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { text, fgColor, bgColor, hasLogo } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(); // connects to the database specified in MONGODB_URI

    // Insert the data into the generated_codes collection
    const result = await db.collection('generated_codes').insertOne({
      text,
      fgColor,
      bgColor,
      hasLogo: !!hasLogo,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving QR code to database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all documents from the generated_codes collection, sort newest first
    const codes = await db
      .collection('generated_codes')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: codes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching QR codes from database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
