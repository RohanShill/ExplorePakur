import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

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
    template: "%s | Explore Pakur — Jharkhand Eco-Tourism",
  },
  description:
    "Discover Pakur, Jharkhand — Complete travel guide to Pakur tourist spots, historic 1855 Martello Tower, Lilatari Waterfall, Singarsi Viewpoint, Kanchangarh Caves, Nityakalyani Mandir, Sidpur Hot Springs, Santhal culture, hotels, and train routes.",
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
    "Singarsi Viewpoint Pakur",
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
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: "Explore Pakur | Official Tourism & Travel Guide to Pakur, Jharkhand",
    description:
      "Explore waterfalls, hill viewpoints, hot springs, and historic caves across Pakur district with interactive 3D navigation and dark matter maps.",
    url: siteUrl,
    siteName: "Explore Pakur",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Singarsi Viewpoint and pristine hills of Pakur, Jharkhand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Pakur | Official Tourism & Travel Guide",
    description:
      "Discover waterfalls, hills, caves, 1855 Martello Tower and Santhal culture across Pakur district, Jharkhand.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    ],
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
  const globalStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Explore Pakur",
        "description": "Official Eco-Tourism and Travel Portal for Pakur District, Jharkhand",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/spots?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-IN"
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Explore Pakur Initiative",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "sameAs": [
          "https://github.com/RohanShill/ExplorePakur"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-6435-222000",
          "contactType": "Customer Support",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi", "Bengali", "Santali"]
        }
      },
      {
        "@type": "TouristDestination",
        "@id": `${siteUrl}/#pakur-destination`,
        "name": "Pakur, Jharkhand",
        "alternateName": ["Pakaur", "Pakur District", "The Black Stone City"],
        "description": "Pakur is an eco-tourism destination in the Santhal Pargana division of Jharkhand, India, renowned for the 1855 Martello Tower, Lilatari Waterfall, Singarsi Viewpoint, Sidpur Hot Springs, and indigenous Santhal culture.",
        "url": siteUrl,
        "touristType": [
          "Eco-Tourism",
          "Cultural Tourism",
          "Heritage Tourism",
          "Adventure & Trekking",
          "Geological & Nature Tourism"
        ],
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 24.633,
          "longitude": 87.846
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pakur",
          "addressRegion": "Jharkhand",
          "addressCountry": "IN"
        },
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Jharkhand"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Pakur famous for?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pakur is famous for its rich tribal Santhal heritage, the historic 1855 Martello Tower commemorating the Santhal Rebellion (Hool), premier black basalt stone quarries, pristine seasonal waterfalls such as Lilatari and Amrapara, panoramic Singarsi Viewpoint, natural geothermal sulfur hot springs at Sidpur, and the ancient Shakti Peeth of Nityakalyani Mandir."
            }
          },
          {
            "@type": "Question",
            "name": "What are the best places to visit in Pakur, Jharkhand?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The top tourist attractions in Pakur include: 1) Martello Tower & Siddhu Kanhu Park, 2) Singarsi Hill Viewpoint (highest point in the district), 3) Lilatari Waterfall, 4) Kanchangarh Ancient Caves, 5) Sidpur Natural Hot Springs, 6) Nityakalyani Kali Temple, 7) Amrapara Forest Cascades, and 8) Hiranpur Weekly Tribal Craft Haat."
            }
          },
          {
            "@type": "Question",
            "name": "How to reach Pakur by train and road?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pakur has a prominent railway junction (Station Code: PKR) on the Eastern Railway network connecting directly to Kolkata (Howrah and Sealdah), Bhagalpur, Patna, Ranchi, and Malda Town. By road, Pakur is connected by well-paved state highways to Dumka (65 km), Sahibganj (75 km), and Deoghar (135 km)."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best time to visit Pakur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The ideal time to visit Pakur is from October to March during the autumn and winter months, when the weather is cool and pleasant, and post-monsoon waterfalls are at peak flow. November and December are also great for witnessing tribal harvest celebrations like Sohrai."
            }
          },
          {
            "@type": "Question",
            "name": "What is the history of Martello Tower in Pakur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Martello Tower in Pakur was constructed in 1856 by British SDO Sir Martin during the epic Santhal Rebellion (Hool) of 1855. It is a 30-foot tall circular stone defensive watchtower with 52 loopholes, representing one of the only Martello-style fortifications in India, now preserved in Siddhu Kanhu Park."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalStructuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#0B130E] text-slate-100 selection:bg-[#00F5A0] selection:text-black">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
