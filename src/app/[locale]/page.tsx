import { getAllSpots } from '@/lib/dataAccess';
import HomePageClient from '@/components/home/HomePageClient';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initialSpots = await getAllSpots(locale);
  return <HomePageClient initialSpots={initialSpots} />;
}
