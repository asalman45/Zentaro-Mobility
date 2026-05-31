import { notFound } from "next/navigation";
import { getModelForReserve, getAllModels } from "@/lib/data/models";
import ReserveCheckoutClient from "./ReserveCheckoutClient";
import { Metadata } from "next";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dbModels = await getAllModels();
  return dbModels.map((model) => ({
    slug: model.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelForReserve(slug);
  if (!model) return {};

  return {
    title: `Reserve ${model.name} | ZENTARO Configurator`,
    description: `Book your ZENTARO ${model.name}. Customize variant and color, lock local pricing, and queue priority.`,
  };
}

export default async function ReserveCheckoutPage({ params }: PageProps) {
  const { slug } = await params;
  const model = await getModelForReserve(slug);

  if (!model) {
    notFound();
  }

  // Ensure type match
  const mappedModel = {
    slug: model.slug,
    name: model.name,
    type: model.type,
    colors: (model.colors || []).map((c: any) => ({ name: c.name, hex: c.hex })),
    variants: model.variants.map((v) => ({
      id: v.id,
      name: v.name,
      batteryType: v.batteryType,
      price: v.price,
      originalPrice: v.originalPrice,
      rangeKm: v.rangeKm,
      topSpeedKmh: v.topSpeedKmh,
    })),
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted text-sm font-semibold animate-pulse">Loading Booking Configurator...</span>
      </div>
    }>
      <ReserveCheckoutClient model={mappedModel} />
    </Suspense>
  );
}

