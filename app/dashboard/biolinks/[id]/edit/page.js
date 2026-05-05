import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { findBiolinkById } from '@/lib/models/biolinks';
import BioLinkEditorShell from '@/components/biolink/BioLinkEditorShell';

export default async function EditBioLinkPage({ params }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin?callbackUrl=/dashboard/biolinks');
  }

  const { id } = await params;
  const client = await clientPromise;
  const db = client.db();

  const biolink = await findBiolinkById(db, id, session.user.id);
  if (!biolink) {
    notFound();
  }

  // Serialize for client component
  const serialized = JSON.parse(JSON.stringify(biolink));

  return <BioLinkEditorShell biolink={serialized} />;
}
