import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { findProfileBySlug, incrementCounter } from '@/lib/models/businessProfiles';
import { recordEvent } from '@/lib/models/scanEvents';
import { headers } from 'next/headers';
import BusinessLandingPage from '@/components/business/BusinessLandingPage';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db();
  const profile = await findProfileBySlug(db, slug);
  if (!profile) return { title: 'Not found' };

  const title = profile.businessName || 'Business Profile';
  const description = profile.tagline || profile.about?.slice(0, 160) || '';

  return {
    title: `${title} — Webiox`,
    description,
    openGraph: {
      title,
      description,
      images: profile.coverImageUrl ? [profile.coverImageUrl] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.coverImageUrl ? [profile.coverImageUrl] : [],
    },
  };
}

export default async function BusinessPage({ params }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db();
  const profile = await findProfileBySlug(db, slug);
  if (!profile) notFound();

  // Increment scan counter + log view event
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = headersList.get('user-agent') || '';
  const country = headersList.get('x-vercel-ip-country') || null;

  // Fire and forget — don't block rendering
  incrementCounter(db, slug, 'totalScans').catch(() => {});
  recordEvent(db, {
    type: 'view',
    profileId: profile._id,
    ip,
    userAgent,
    country,
    referrer: headersList.get('referer') || null,
  }).catch(() => {});

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: profile.businessName,
    description: profile.tagline || profile.about,
    telephone: profile.contact?.phone || undefined,
    email: profile.contact?.email || undefined,
    url: profile.contact?.website || undefined,
    image: profile.logoUrl || profile.coverImageUrl || undefined,
    address: (profile.address?.city || profile.address?.country) ? {
      '@type': 'PostalAddress',
      streetAddress: profile.address?.addressLine1,
      addressLocality: profile.address?.city,
      addressRegion: profile.address?.state,
      postalCode: profile.address?.postalCode,
      addressCountry: profile.address?.country,
    } : undefined,
    geo: (profile.address?.latitude && profile.address?.longitude) ? {
      '@type': 'GeoCoordinates',
      latitude: profile.address.latitude,
      longitude: profile.address.longitude,
    } : undefined,
  };

  // Serialize profile for client component (strip ObjectIds)
  const serialized = JSON.parse(JSON.stringify(profile));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BusinessLandingPage profile={serialized} />
    </>
  );
}
