import { notFound } from 'next/navigation';
import { getPageByShortId } from '@/lib/db/pages';
import SocialPage from './_types/SocialPage';
import VcardPage from './_types/VcardPage';
import MecardPage from './_types/MecardPage';
import AppStorePage from './_types/AppStorePage';
import PdfPage from './_types/PdfPage';
import BusinessPage from './_types/BusinessPage';
import RatingPage from './_types/RatingPage';
import FeedbackPage from './_types/FeedbackPage';
import CouponPage from './_types/CouponPage';
import GalleryPage from './_types/GalleryPage';
import Mp3Page from './_types/Mp3Page';
import VideoPage from './_types/VideoPage';
import InstagramPage from './_types/InstagramPage';
import EventPage from './_types/EventPage';
import FacebookPage from './_types/FacebookPage';

const RENDERERS = {
  social: SocialPage,
  vcard: VcardPage,
  mecard: MecardPage,
  appstore: AppStorePage,
  app: AppStorePage,
  pdf: PdfPage,
  business: BusinessPage,
  rating: RatingPage,
  feedback: FeedbackPage,
  coupon: CouponPage,
  gallery: GalleryPage,
  images: GalleryPage,
  mp3: Mp3Page,
  audio: Mp3Page,
  video: VideoPage,
  instagram: InstagramPage,
  event: EventPage,
  facebook: FacebookPage,
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
