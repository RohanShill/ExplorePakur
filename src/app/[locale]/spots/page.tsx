import { getAllSpots } from '@/lib/dataAccess';
import SpotsDirectoryClient from '@/components/spots/SpotsDirectoryClient';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://explorepakur.in';
  const isHi = locale === 'hi';
  const title = isHi
    ? 'पाकुड़ के सभी पर्यटन स्थल | जलप्रपात, गुफाएं, मंदिर व संथाली धरोहर'
    : 'All Tourist Spots in Pakur | Waterfalls, Caves, Temples & Tribal Heritage';
  const description = isHi
    ? 'पाकुड़ जिले के सभी प्रमुख पर्यटन स्थल देखें - लिलातरी फॉल्स, सिंगाड़शी चोटी, कंचनगढ़ गुफा, सिद्धू-कान्हू पार्क और ऐतिहासिक धरोहर।'
    : 'Explore all top travel destinations in Pakur district, Jharkhand. Complete directory of waterfalls, caves, heritage monuments, and eco-parks.';
  return {
    title,
    description,
    alternates: {
      canonical: siteUrl + '/' + locale + '/spots',
      languages: {
        en: siteUrl + '/en/spots',
        hi: siteUrl + '/hi/spots',
        'x-default': siteUrl + '/en/spots',
      },
    },
    openGraph: {
      title,
      description,
      url: siteUrl + '/' + locale + '/spots',
      locale: isHi ? 'hi_IN' : 'en_IN',
      type: 'website',
    },
  };
}

export default async function LocalizedSpotsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initialSpots = await getAllSpots(locale);
  return <SpotsDirectoryClient initialSpots={initialSpots} />;
}
