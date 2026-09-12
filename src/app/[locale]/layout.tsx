import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, Locale } from '@/i18n/config';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://explorepakur.in';
  const isHi = locale === 'hi';
  const title = isHi
    ? 'एक्सप्लोर पाकुड़ | पाकुड़, झारखंड का प्रामाणिक ईको-टूरिज्म गाइड'
    : 'Explore Pakur | Official Tourism & Travel Guide to Pakur, Jharkhand';
  const description = isHi
    ? 'पाकुड़, झारखंड का संपूर्ण पर्यटन मार्गदर्शिका - लिलातरी जलप्रपात, 1855 का ऐतिहासिक मार्टेलो टावर, सिंगाड़शी चोटी, कंचनगढ़ गुफाएं और संथाली सांस्कृतिक धरोहर।'
    : 'Discover Pakur, Jharkhand - Complete travel guide to Pakur tourist spots, historic 1855 Martello Tower, Lilatari Waterfall, Singhashi Hilltop Peak, Kanchangarh Caves, and Santhal culture.';
  return {
    title: {
      default: title,
      template: isHi ? '%s | एक्सप्लोर पाकुड़ - झारखंड ईको-टूरिज्म' : '%s | Explore Pakur - Jharkhand Eco-Tourism',
    },
    description,
    alternates: {
      canonical: siteUrl + '/' + locale,
      languages: {
        en: siteUrl + '/en',
        hi: siteUrl + '/hi',
        'x-default': siteUrl + '/en',
      },
    },
    openGraph: {
      title,
      description,
      url: siteUrl + '/' + locale,
      locale: isHi ? 'hi_IN' : 'en_IN',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ConditionalLayout>{children}</ConditionalLayout>
    </NextIntlClientProvider>
  );
}
