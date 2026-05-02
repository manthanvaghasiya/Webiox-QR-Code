import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import clientPromise from '@/lib/mongodb';
import { findProfileById } from '@/lib/models/businessProfiles';
import ProfileWizard from '@/components/business/ProfileWizard';

export const metadata = {
  title: 'Edit Business Profile — Webiox',
};

export default async function EditProfilePage({ params }) {
  const session = await auth();
  if (!session?.user) redirect('/signin?callbackUrl=/dashboard/profiles');

  const { id } = await params;
  const client = await clientPromise;
  const db = client.db();
  const profile = await findProfileById(db, id, session.user.id);

  if (!profile) redirect('/dashboard/profiles');

  // Serialize for client component
  const serialized = JSON.parse(JSON.stringify(profile));

  return <ProfileWizard mode="edit" initialData={serialized} />;
}
