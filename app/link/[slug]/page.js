import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { findBiolinkBySlug, recordBlockClick } from '@/lib/models/biolinks';
import { headers } from 'next/headers';
import BioLinkLandingPage from '@/components/biolink/BioLinkLandingPage';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db();
  const biolink = await findBiolinkBySlug(db, slug);

  if (!biolink) return { title: 'Not found' };

  const title = biolink.title || 'Bio Link';
  const description = biolink.bio || '';

  return {
    title: `${title} — Webiox`,
    description,
    openGraph: {
      title,
      description,
      images: biolink.avatarUrl ? [biolink.avatarUrl] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: biolink.avatarUrl ? [biolink.avatarUrl] : [],
    },
  };
}

export default async function BioLinkPage({ params }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db();
  const biolink = await findBiolinkBySlug(db, slug);

  if (!biolink) notFound();

  // Track view (fire and forget)
  const headersList = await headers();
  recordBlockClick(db, biolink._id, '_view').catch(() => {});

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: biolink.title,
    description: biolink.bio,
    image: biolink.avatarUrl || undefined,
  };

  // Serialize for client component
  const serialized = JSON.parse(JSON.stringify(biolink));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BioLinkLandingPage biolink={serialized} />
    </>
  );
}
