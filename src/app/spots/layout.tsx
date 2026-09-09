import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explorepakur.in";

export const metadata: Metadata = {
  title: "Tourist Places in Pakur | Complete Destinations Directory & Map",
  description:
    "Explore all 16+ verified tourist spots in Pakur district, Jharkhand — including waterfalls, hill viewpoints, ancient caves, geothermal hot springs, and historic 1855 Martello Tower with live GPS coordinates.",
  keywords: [
    "Pakur tourist places",
    "Places to visit in Pakur",
    "Pakur tourist spots",
    "Pakur sightseeing",
    "Pakur tourism directory",
    "Waterfalls in Pakur",
    "Caves in Pakur",
    "Pakur tourist map"
  ],
  alternates: {
    canonical: `${siteUrl}/spots`,
  },
  openGraph: {
    title: "Tourist Places in Pakur | Destinations Directory",
    description:
      "Full directory of waterfalls, caves, hill viewpoints, and heritage sites across Pakur, Jharkhand.",
    url: `${siteUrl}/spots`,
    siteName: "Explore Pakur",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Pakur tourist places directory",
      },
    ],
  },
};

export default function SpotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/spots#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tourist Places in Pakur",
        "item": `${siteUrl}/spots`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
