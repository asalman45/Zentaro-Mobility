import { notFound } from "next/navigation";
import { getModelBySlug, getAllModels } from "@/lib/data/models";
import ProductDetailClient from "./ProductDetailClient";
import { Metadata } from "next";

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
  const model = await getModelBySlug(slug);
  if (!model) return {};

  return {
    title: `${model.name} | Advanced Electric ${model.type === "scooter" ? "Scooter" : "Motorcycle"}`,
    description: `${model.tagline}. ${model.description.substring(0, 150)}...`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  // Ensure type assertions match what client expects
  const mappedModel = {
    slug: model.slug,
    name: model.name,
    tagline: model.tagline,
    type: model.type,
    description: model.description,
    basePrice: model.basePrice,
    colors: model.colors as any[],
    variants: model.variants as any[],
    images: model.images,
  };

  return <ProductDetailClient model={mappedModel} />;
}
