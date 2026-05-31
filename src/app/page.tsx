import HomeClient from "./HomeClient";
import { getFeaturedModels } from "@/lib/data/models";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZENTARO Mobility | Premium Electric Motorcycles & Scooters in Pakistan",
  description: "Experience the future of urban commute with ZENTARO's advanced LFP battery-powered electric vehicles. High-performance, zero-emissions, interest-free installment plans in Pakistan.",
};

export default async function Page() {
  const featuredModels = await getFeaturedModels();
  return <HomeClient featuredModels={featuredModels} />;
}
