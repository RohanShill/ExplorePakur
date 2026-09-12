import { MetadataRoute } from "next";
import { getAllSpots } from "@/lib/dataAccess";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.explorepakur.in").replace(/\/$/, "");

  const entries: MetadataRoute.Sitemap = [];

  // Root entry
  entries.push({
    url: `${baseUrl}/`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
    alternates: {
      languages: {
        en: `${baseUrl}/en`,
        hi: `${baseUrl}/hi`,
      },
    },
  });

  // Core static pages for both languages
  const corePages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/spots", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/about", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  for (const page of corePages) {
    // English version
    entries.push({
      url: `${baseUrl}/en${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page.path}`,
          hi: `${baseUrl}/hi${page.path}`,
        },
      },
    });

    // Hindi version
    entries.push({
      url: `${baseUrl}/hi${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          en: `${baseUrl}/en${page.path}`,
          hi: `${baseUrl}/hi${page.path}`,
        },
      },
    });
  }

  // Dynamic destination spots in both English and Hindi
  try {
    const spots = await getAllSpots();

    for (const spot of spots) {
      const lastMod = spot.createdAt ? new Date(spot.createdAt) : new Date();

      // English spot URL
      entries.push({
        url: `${baseUrl}/en/spots/${spot.slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/spots/${spot.slug}`,
            hi: `${baseUrl}/hi/spots/${spot.slug}`,
          },
        },
      });

      // Hindi spot URL
      entries.push({
        url: `${baseUrl}/hi/spots/${spot.slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/spots/${spot.slug}`,
            hi: `${baseUrl}/hi/spots/${spot.slug}`,
          },
        },
      });
    }
  } catch (err) {
    console.error("Error generating multilingual spot sitemap entries:", err);
  }

  return entries;
}
