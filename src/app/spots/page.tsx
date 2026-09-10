import { getAllSpots } from "@/lib/dataAccess";
import SpotsDirectoryClient from "@/components/spots/SpotsDirectoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SpotsDirectoryPage() {
  const initialSpots = await getAllSpots();
  return <SpotsDirectoryClient initialSpots={initialSpots} />;
}
