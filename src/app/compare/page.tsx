import { getAllModels } from "@/lib/data/models";
import CompareClient, { VehicleModel } from "./CompareClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare ZENTARO Electric Vehicles | Side-by-Side Specifications",
  description: "Compare technical specifications, prices, battery chemistry, speeds, and range of ZENTARO electric bikes and scooters in Pakistan.",
};

export default async function Page() {
  const dbModels = await getAllModels();

  const initialModels: VehicleModel[] = dbModels.map((model) => {
    const primaryVariant = model.variants?.[0];
    return {
      slug: model.slug,
      name: model.name,
      type: model.type === "scooter" ? "Scooter" : "Motorcycle",
      tagline: model.tagline,
      basePrice: model.basePrice,
      speed: primaryVariant?.topSpeedKmh ?? 0,
      range: primaryVariant?.rangeKm ?? 0,
      charge: primaryVariant?.chargingTimeHrs ?? 0,
      battery: primaryVariant ? `${primaryVariant.batteryType} Cell` : "LFP",
      warranty: primaryVariant?.warrantyMonths ?? 36,
      motor: primaryVariant?.motorWatts ?? 0,
      colors: (model.colors || []).map((c: any) => c.name),
    };
  });

  return <CompareClient initialModels={initialModels} />;
}
