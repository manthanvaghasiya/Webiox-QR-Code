import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { createBiolink } from '@/lib/models/biolinks';
import BioLinkEditorShell from '@/components/biolink/BioLinkEditorShell';

export default async function NewBioLinkPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/signin?callbackUrl=/dashboard/biolinks/new');
  }

  const client = await clientPromise;
  const db = client.db();

  // Create a blank biolink
  const biolink = await createBiolink(db, {
    userId: session.user.id,
    title: 'My Bio Link',
    bio: '',
    blocks: [],
    theme: {},
  });

  // Redirect to edit page
  redirect(`/dashboard/biolinks/${biolink._id}/edit`);
}
