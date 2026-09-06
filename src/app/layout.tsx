import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Explore Pakur | Eco-Tourism, Waterfalls, Caves & Santhal Heritage',
  description: 'Discover the untouched natural wonders of Pakur district, Jharkhand. Explore Singarsi Viewpoint, Lilatari Waterfall, Kanchangarh Cave, and the historic 1855 Martello Tower.',
  keywords: [
    'Pakur Tourism',
    'Jharkhand Eco-Tourism',
    'Singarsi Viewpoint',
    'Lilatari Waterfall',
    'Kanchangarh Cave',
    'Martello Tower Pakur',
    'Siddhu Kanhu Park',
    'Sidpur Hot Spring',
    'Santhal Pargana',
    'Explore Pakur'
  ],
  authors: [{ name: 'Explore Pakur Initiative' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://explorepakur.in'),
  openGraph: {
    title: 'Explore Pakur - Eco-Tourism & Santhal Heritage Portal',
    description: 'Explore waterfalls, hill viewpoints, hot springs, and historic caves across Pakur district with interactive 3D navigation and dark matter maps.',
    url: 'https://explorepakur.in',
    siteName: 'Explore Pakur',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Singarsi Viewpoint, Pakur, Jharkhand',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Pakur | Eco-Tourism Portal',
    description: 'Discover waterfalls, hills, caves and Santhal culture across Pakur district, Jharkhand.',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#0B130E] text-slate-100 selection:bg-[#00F5A0] selection:text-black">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
