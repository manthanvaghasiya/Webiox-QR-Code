import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import ProfileWizard from '@/components/business/ProfileWizard';

export const metadata = {
  title: 'Create Business Profile — Webiox',
};

export default async function NewProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/signin?callbackUrl=/dashboard/profiles/new');

  return <ProfileWizard mode="create" />;
}
