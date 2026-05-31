import { db } from "@/lib/db";
import { models, modelVariants, modelToFeatures, features } from "@/lib/db/schema";
import { eq, and, inArray, lte } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const cacheWrapper = <T extends (...args: any[]) => any>(
  fn: T,
  keyParts?: string[],
  options?: { revalidate?: number | false; tags?: string[] }
): T => {
  // If we are in a script/CLI context without Next.js incrementalCache, bypass unstable_cache
  if (typeof window === "undefined" && !process.env.NEXT_RUNTIME) {
    return fn;
  }
  return unstable_cache(fn, keyParts, options) as any;
};


export interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

export interface Variant {
  id: number;
  modelId: number;
  name: string;
  batteryType: "LFP" | "Lithium" | "Graphene";
  price: number;
  originalPrice?: number | null;
  topSpeedKmh: number;
  rangeKm: number;
  chargingTimeHrs: number;
  batteryLifeYears: number;
  motorWatts: number;
  voltage: number;
  ampHours: number;
  chargeCycles: number;
  warrantyMonths: number;
  weightKg: number;
  loadKg: number;
  brakes: string;
  suspension: string;
  tyres: string;
  ipRating: string;
  smartFeatures: string[];
}

export interface Feature {
  id: number;
  icon: string;
  title: string;
  blurb: string;
  category: string;
}

export interface ModelWithDetails {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  type: "motorcycle" | "scooter" | "three_wheeler";
  description: string;
  status: "draft" | "published";
  featured: boolean;
  heroImage: string;
  images: string[];
  colors: ColorOption[];
  basePrice: number;
  originalPrice?: number | null;
  inStock: boolean;
  createdAt: Date;
  variants: Variant[];
  features: Feature[];
}

// 1. GET FEATURED MODELS
const fetchFeaturedModels = async (): Promise<ModelWithDetails[]> => {
  const list = await db
    .select()
    .from(models)
    .where(and(eq(models.status, "published"), eq(models.featured, true)));

  const results: ModelWithDetails[] = [];
  for (const model of list) {
    const variants = await db
      .select()
      .from(modelVariants)
      .where(eq(modelVariants.modelId, model.id));

    const modelFeatures = await db
      .select({
        id: features.id,
        icon: features.icon,
        title: features.title,
        blurb: features.blurb,
        category: features.category,
      })
      .from(modelToFeatures)
      .innerJoin(features, eq(modelToFeatures.featureId, features.id))
      .where(eq(modelToFeatures.modelId, model.id));

    results.push({
      ...model,
      variants: variants as any,
      features: modelFeatures,
    });
  }
  return results;
};

export const getFeaturedModels = () =>
  cacheWrapper(
    fetchFeaturedModels,
    ["featured-models"],
    { revalidate: 60, tags: ["models"] }
  )();

// 2. GET ALL MODELS WITH FILTERS
const fetchAllModels = async (options?: {
  type?: string;
  battery?: string;
  maxPrice?: number;
  sortBy?: string;
}): Promise<ModelWithDetails[]> => {
  let query = db.select().from(models).where(eq(models.status, "published"));

  // Execute base query
  const list = await query;

  const results: ModelWithDetails[] = [];
  for (const model of list) {
    const variants = await db
      .select()
      .from(modelVariants)
      .where(eq(modelVariants.modelId, model.id));

    const modelFeatures = await db
      .select({
        id: features.id,
        icon: features.icon,
        title: features.title,
        blurb: features.blurb,
        category: features.category,
      })
      .from(modelToFeatures)
      .innerJoin(features, eq(modelToFeatures.featureId, features.id))
      .where(eq(modelToFeatures.modelId, model.id));

    results.push({
      ...model,
      variants: variants as any,
      features: modelFeatures,
    });
  }

  // Apply filters in memory for simplicity and robust support of joined tables
  let filtered = results;
  if (options?.type && options.type !== "all") {
    filtered = filtered.filter((m) => m.type === options.type);
  }
  if (options?.battery && options.battery !== "all") {
    filtered = filtered.filter((m) =>
      m.variants.some((v) => v.batteryType.toLowerCase() === options.battery?.toLowerCase())
    );
  }
  if (options?.maxPrice) {
    filtered = filtered.filter((m) => m.basePrice <= (options.maxPrice || Infinity));
  }

  // Apply sorting
  if (options?.sortBy) {
    if (options.sortBy === "price_asc") {
      filtered.sort((a, b) => a.basePrice - b.basePrice);
    } else if (options.sortBy === "price_desc") {
      filtered.sort((a, b) => b.basePrice - a.basePrice);
    } else if (options.sortBy === "range") {
      filtered.sort((a, b) => {
        const maxRangeA = Math.max(...a.variants.map((v) => v.rangeKm), 0);
        const maxRangeB = Math.max(...b.variants.map((v) => v.rangeKm), 0);
        return maxRangeB - maxRangeA;
      });
    } else if (options.sortBy === "speed") {
      filtered.sort((a, b) => {
        const maxSpeedA = Math.max(...a.variants.map((v) => v.topSpeedKmh), 0);
        const maxSpeedB = Math.max(...b.variants.map((v) => v.topSpeedKmh), 0);
        return maxSpeedB - maxSpeedA;
      });
    }
  }

  return filtered;
};

export const getAllModels = (options?: {
  type?: string;
  battery?: string;
  maxPrice?: number;
  sortBy?: string;
}) => {
  const cacheKey = `all-models-${options?.type || "all"}-${options?.battery || "all"}-${options?.maxPrice || "none"}-${options?.sortBy || "none"}`;
  return cacheWrapper(
    () => fetchAllModels(options),
    [cacheKey],
    { revalidate: 60, tags: ["models"] }
  )();
};

// 3. GET MODEL BY SLUG
const fetchModelBySlug = async (slug: string): Promise<ModelWithDetails | null> => {
  const model = await db.query.models.findFirst({
    where: (models, { eq, and }) => and(eq(models.slug, slug), eq(models.status, "published")),
  });
  if (!model) return null;

  const variants = await db
    .select()
    .from(modelVariants)
    .where(eq(modelVariants.modelId, model.id));

  const modelFeatures = await db
    .select({
      id: features.id,
      icon: features.icon,
      title: features.title,
      blurb: features.blurb,
      category: features.category,
    })
    .from(modelToFeatures)
    .innerJoin(features, eq(modelToFeatures.featureId, features.id))
    .where(eq(modelToFeatures.modelId, model.id));

  return {
    ...model,
    variants: variants as any,
    features: modelFeatures,
  };
};

export const getModelBySlug = (slug: string) =>
  cacheWrapper(
    () => fetchModelBySlug(slug),
    [`model-${slug}`],
    { revalidate: 60, tags: [`model:${slug}`, "models"] }
  )();

// 4. GET MODEL FOR RESERVE CONFIGURATOR
export interface ModelForReserve {
  slug: string;
  name: string;
  type: string;
  colors: ColorOption[];
  variants: {
    id: number;
    name: string;
    batteryType: string;
    price: number;
    originalPrice?: number | null;
    rangeKm: number;
    topSpeedKmh: number;
  }[];
}

const fetchModelForReserve = async (slug: string): Promise<ModelForReserve | null> => {
  const model = await db.query.models.findFirst({
    where: (models, { eq, and }) => and(eq(models.slug, slug), eq(models.status, "published")),
  });
  if (!model) return null;

  const variants = await db
    .select({
      id: modelVariants.id,
      name: modelVariants.name,
      batteryType: modelVariants.batteryType,
      price: modelVariants.price,
      originalPrice: modelVariants.originalPrice,
      rangeKm: modelVariants.rangeKm,
      topSpeedKmh: modelVariants.topSpeedKmh,
    })
    .from(modelVariants)
    .where(eq(modelVariants.modelId, model.id));

  return {
    slug: model.slug,
    name: model.name,
    type: model.type,
    colors: model.colors as ColorOption[],
    variants,
  };
};

export const getModelForReserve = (slug: string) =>
  cacheWrapper(
    () => fetchModelForReserve(slug),
    [`reserve-${slug}`],
    { revalidate: 60, tags: [`model:${slug}`, "models"] }
  )();

// 5. GET COMPARE MODELS
const fetchCompareModels = async (slugs: string[]): Promise<ModelWithDetails[]> => {
  if (slugs.length === 0) return [];
  
  const list = await db
    .select()
    .from(models)
    .where(and(eq(models.status, "published"), inArray(models.slug, slugs)));

  const results: ModelWithDetails[] = [];
  for (const model of list) {
    const variants = await db
      .select()
      .from(modelVariants)
      .where(eq(modelVariants.modelId, model.id));

    const modelFeatures = await db
      .select({
        id: features.id,
        icon: features.icon,
        title: features.title,
        blurb: features.blurb,
        category: features.category,
      })
      .from(modelToFeatures)
      .innerJoin(features, eq(modelToFeatures.featureId, features.id))
      .where(eq(modelToFeatures.modelId, model.id));

    results.push({
      ...model,
      variants: variants as any,
      features: modelFeatures,
    });
  }
  return results;
};

export const getCompareModels = (slugs: string[]) => {
  const cacheKey = `compare-${slugs.sort().join("-")}`;
  return cacheWrapper(
    () => fetchCompareModels(slugs),
    [cacheKey],
    { revalidate: 60, tags: ["models"] }
  )();
};
