import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Dynamic hosted page (Social Media tab)
    if (body.isDynamic && body.pageConfig) {
      const shortId = crypto.randomUUID().split('-')[0];
      await db.collection('dynamic_pages').insertOne({
        shortId,
        title: body.pageConfig.title,
        description: body.pageConfig.description ?? '',
        links: body.pageConfig.links,
        fgColor: body.fgColor,
        bgColor: body.bgColor,
        createdAt: new Date(),
      });
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      return NextResponse.json(
        { success: true, dynamicUrl: `${baseUrl}/p/${shortId}` },
        { status: 201 }
      );
    }

    // Standard QR code log
    const { text, fgColor, bgColor, hasLogo } = body;
    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }
    const result = await db.collection('generated_codes').insertOne({
      text,
      fgColor,
      bgColor,
      hasLogo: !!hasLogo,
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error saving QR code to database:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const codes = await db
      .collection('generated_codes')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, data: codes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching QR codes from database:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
