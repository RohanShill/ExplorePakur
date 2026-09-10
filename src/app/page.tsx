import { getAllSpots } from "@/lib/dataAccess";
import HomePageClient from "@/components/home/HomePageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const initialSpots = await getAllSpots();
  return <HomePageClient initialSpots={initialSpots} />;
}
