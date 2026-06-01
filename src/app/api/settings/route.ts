import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings, savingsConfig } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.select().from(siteSettings).limit(1);
    const config = await db.select().from(savingsConfig).limit(1);

    return NextResponse.json({
      whatsappNumber: settings[0]?.whatsappNumber ?? "+923001234567",
      petrolPrice: config[0]?.petrolPriceDefault ?? 272.5,
      electricityRate: config[0]?.electricityRate ?? 50.0,
    });
  } catch (error) {
    console.error("Failed to load settings in API route:", error);
    // Fall back to defaults to prevent site crashes
    return NextResponse.json({
      whatsappNumber: "+923001234567",
      petrolPrice: 272.5,
      electricityRate: 50.0,
    });
  }
}
