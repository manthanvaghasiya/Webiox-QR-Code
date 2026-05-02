import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { createTemplate, findTemplatesByUser } from '@/lib/models/qrTemplates';

// GET /api/templates — list current user's saved templates
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const templates = await findTemplatesByUser(db, session.user.id);
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error('GET /api/templates error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/templates — save a new template
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, design } = await request.json();
    if (!design || typeof design !== 'object') {
      return NextResponse.json({ error: 'design is required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const template = await createTemplate(db, {
      userId: session.user.id,
      name,
      design,
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error) {
    console.error('POST /api/templates error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
