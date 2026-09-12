import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explorepakur.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Explore Pakur | Official Tourism & Travel Guide to Pakur, Jharkhand",
    template: "%s | Explore Pakur - Jharkhand Eco-Tourism",
  },
  description:
    "Discover Pakur, Jharkhand - Complete travel guide to Pakur tourist spots, historic 1855 Martello Tower, Lilatari Waterfall, Singhashi Hilltop Peak, Kanchangarh Caves, Nityakalyani Mandir, Sidpur Hot Springs, Santhal culture, hotels, and train routes.",
  keywords: [
    "Pakur",
    "Pakur Jharkhand",
    "Pakur tourism",
    "Pakur tourist places",
    "Places to visit in Pakur",
    "Pakur travel guide",
    "Explore Pakur",
    "Pakur district",
    "Martello Tower Pakur",
    "Pakur railway station",
    "Santhal Pargana tourism",
    "Jharkhand eco tourism",
    "Pakur waterfall",
    "Lilatari Waterfall Pakur",
    "Singhashi Hilltop Peak Pakur",
    "Kanchangarh Cave Pakur",
    "Sidpur Hot Spring Pakur",
    "Nityakalyani Mandir Pakur",
    "Siddhu Kanhu Park Pakur",
    "Hiranpur craft haat Pakur",
    "Littipara eco valley",
    "Amrapara forest waterfall",
    "Pakur tourism map",
    "Pakur sightseeing"
  ],
  authors: [{ name: "Explore Pakur Tourism Initiative", url: siteUrl }],
  creator: "Explore Pakur Initiative",
  publisher: "Explore Pakur",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  verification: {
    google: "google5a6492daf2292120",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`dark ${inter.variable}`}>
      <head>
        <meta name="google-site-verification" content="google5a6492daf2292120" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#0B130E] text-slate-100 selection:bg-[#00F5A0] selection:text-black">
        {children}
      </body>
    </html>
  );
}
