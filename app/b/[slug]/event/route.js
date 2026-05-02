import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { findProfileBySlug, incrementCounter } from '@/lib/models/businessProfiles';
import { recordEvent } from '@/lib/models/scanEvents';
import { headers } from 'next/headers';

// ── Simple in-memory rate limiter (60 req/min per IP) ──
const rateLimitMap = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_REQUESTS) return true;
  return false;
}

// Clean up stale entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap) {
      if (now - val.start > WINDOW_MS * 2) rateLimitMap.delete(key);
    }
  }, WINDOW_MS * 3);
}

const VALID_EVENTS = ['view', 'call', 'directions', 'contact_save', 'social_click', 'service_click', 'share'];

/**
 * POST /b/:slug/event — Log analytics events (rate-limited)
 */
export async function POST(request, { params }) {
  const { slug } = await params;
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limit check
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { eventType, meta } = body;
  if (!eventType || !VALID_EVENTS.includes(eventType)) {
    return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const profile = await findProfileBySlug(db, slug);
  if (!profile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Map event types to counter fields
  const counterMap = {
    call: 'totalCalls',
    directions: 'totalDirectionClicks',
    contact_save: 'totalContactSaves',
  };

  // Increment counter if applicable
  if (counterMap[eventType]) {
    incrementCounter(db, slug, counterMap[eventType]).catch(() => {});
  }

  // Log the event
  const userAgent = headersList.get('user-agent') || '';
  const country = headersList.get('x-vercel-ip-country') || null;

  recordEvent(db, {
    type: eventType,
    profileId: profile._id,
    ip,
    userAgent,
    country,
    referrer: headersList.get('referer') || null,
    meta: meta || null,
  }).catch(() => {});

  return NextResponse.json({ success: true }, { status: 200 });
}
