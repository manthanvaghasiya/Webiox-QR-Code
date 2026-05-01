import { notFound } from 'next/navigation';
import { getPageByShortId } from '@/lib/db/pages';
import SocialPage from './_types/SocialPage';

const RENDERERS = {
  social: SocialPage,
  // pdf: PdfPage,
  // business: BusinessPage,
  // rating: RatingPage,
  // feedback: FeedbackPage,
  // coupon: CouponPage,
  // gallery: GalleryPage,
  // mp3: Mp3Page,
  // video: VideoPage,
  // appstore: AppStorePage,
};

export default async function HostedPage({ params }) {
  const { id } = await params;
  const page = await getPageByShortId(id);
  if (!page) notFound();

  const Renderer = RENDERERS[page.type];
  if (!Renderer) notFound();

  return <Renderer page={page} />;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const page = await getPageByShortId(id);
  if (!page) return { title: 'Not found' };

  const title = page.meta?.title || 'Webiox Page';
  const description = page.meta?.description || '';
  const ogImage = page.meta?.ogImageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}
