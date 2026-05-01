import { notFound } from 'next/navigation';
import { getPageByEditToken } from '@/lib/db/pages';
import EditShell from './_components/EditShell';

export default async function EditPage({ params }) {
  const { token } = await params;
  const page = await getPageByEditToken(token);
  if (!page) notFound();
  return <EditShell page={page} />;
}

// noindex this route — edit URLs must never appear in search engines
export const metadata = {
  robots: { index: false, follow: false },
};
