import { MetadataRoute } from "next";
import { getAllSpots } from "@/lib/dataAccess";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explorepakur.in";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/spots`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const spots = await getAllSpots();
    const spotUrls: MetadataRoute.Sitemap = spots.map((spot) => ({
      url: `${baseUrl}/spots/${spot.slug}`,
      lastModified: spot.createdAt ? new Date(spot.createdAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    return [...staticPages, ...spotUrls];
  } catch (err) {
    console.error("Error generating dynamic spot sitemap entries:", err);
    return staticPages;
  }
}
