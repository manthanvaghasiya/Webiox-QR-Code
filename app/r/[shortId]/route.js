import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { findQrCodeByShortId, incrementScanCount } from '@/lib/models/qrCodes';
import { recordEvent } from '@/lib/models/scanEvents';

export async function GET(_request, { params }) {
  const { shortId } = await params;

  try {
    const client = await clientPromise;
    const db = client.db();

    const qr = await findQrCodeByShortId(db, shortId);

    if (!qr?.isDynamic || !qr.destination) {
      return new NextResponse(null, { status: 404 });
    }

    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
      headersList.get('x-real-ip') ??
      null;
    const userAgent = headersList.get('user-agent') ?? null;
    const referrer = headersList.get('referer') ?? null;

    const { device, os, browser } = parseUserAgent(userAgent);

    // Fire-and-forget — don't let analytics delay the redirect
    Promise.all([
      incrementScanCount(db, shortId),
      recordEvent(db, {
        type: 'qr_scan',
        qrCodeId: qr._id.toString(),
        profileId: null,
        ip,
        device,
        os,
        browser,
        referrer,
        userAgent,
      }),
    ]).catch((err) => console.error('scan recording error:', err));

    return NextResponse.redirect(qr.destination, { status: 302 });
  } catch (error) {
    console.error('QR redirect error:', error);
    return new NextResponse(null, { status: 500 });
  }
}

function parseUserAgent(ua) {
  if (!ua) return { device: null, os: null, browser: null };

  const device =
    /iPad|tablet/i.test(ua) ? 'tablet' :
    /Mobi|Android|iPhone|iPod/i.test(ua) ? 'mobile' :
    'desktop';

  const os =
    /Windows/i.test(ua) ? 'Windows' :
    /Android/i.test(ua) ? 'Android' :
    /iPhone|iPad|iOS/i.test(ua) ? 'iOS' :
    /Macintosh|Mac OS/i.test(ua) ? 'macOS' :
    /Linux/i.test(ua) ? 'Linux' : null;

  // Order matters: check Edge before Chrome, Opera before Chrome
  const browser =
    /Edg\//i.test(ua) ? 'Edge' :
    /OPR\/|Opera/i.test(ua) ? 'Opera' :
    /Chrome/i.test(ua) ? 'Chrome' :
    /Firefox/i.test(ua) ? 'Firefox' :
    /Safari/i.test(ua) ? 'Safari' : null;

  return { device, os, browser };
}
