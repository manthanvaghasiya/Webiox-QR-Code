import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import { auth } from '@/auth';
import { findBiolinksByUser } from '@/lib/models/biolinks';
import BioLinksListShell from '@/components/biolink/BioLinksListShell';

export default async function BioLinksPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin?callbackUrl=/dashboard/biolinks');
  }

  const client = await clientPromise;
  const db = client.db();

  // Fetch user's bio-links
  const biolinks = await findBiolinksByUser(db, session.user.id);

  // Serialize ObjectIds + Dates for client component
  const safe = (v) => JSON.parse(JSON.stringify(v));

  return <BioLinksListShell initialBiolinks={safe(biolinks)} />;
}
