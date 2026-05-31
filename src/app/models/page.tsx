import { getAllModels } from "@/lib/data/models";
import ModelsClient, { VehicleModel } from "./ModelsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZENTARO Vehicle Lineup | Advanced Electric Motorcycles & Scooters",
  description: "Browse the complete ZENTARO lineup of high-performance electric bikes and scooters in Pakistan. Compare models, specs, range, and secure your reservation.",
};

export default async function Page() {
  const dbModels = await getAllModels();
  
  const initialModels: VehicleModel[] = dbModels.map((model) => {
    const primaryVariant = model.variants?.[0];
    return {
      slug: model.slug,
      name: model.name,
      type: model.type as any,
      tagline: model.tagline,
      basePrice: model.basePrice,
      originalPrice: model.originalPrice,
      speed: primaryVariant?.topSpeedKmh ?? 0,
      range: primaryVariant?.rangeKm ?? 0,
      charge: primaryVariant?.chargingTimeHrs ?? 0,
      battery: primaryVariant?.batteryType ?? "LFP",
      batteryLife: primaryVariant ? `${primaryVariant.batteryLifeYears} yr` : "8 yr",
      colors: (model.colors || []).map((c: any) => ({ name: c.name, hex: c.hex })),
    };
  });

  return <ModelsClient initialModels={initialModels} />;
}
