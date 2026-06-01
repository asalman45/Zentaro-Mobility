"use server";

import { db } from "@/lib/db";
import {
  models,
  modelVariants,
  leads,
  dealers,
  reservations,
  savingsConfig,
  siteSettings,
  testRideBookings,
  installmentApplications,
  smsLogs,
} from "@/lib/db/schema";
import { eq, desc, sql, gte } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

// 1. DASHBOARD & STATISTICS
export async function getAdminStatsAction() {
  try {
    // Total Orders count
    const reservationsCount = await db.select({ count: sql<number>`count(*)` }).from(reservations);
    const totalOrders = Number(reservationsCount[0]?.count || 0);

    // Total Revenue (amount paid for paid reservations)
    const revenueSum = await db
      .select({ sum: sql<number>`sum(amount_paid)` })
      .from(reservations)
      .where(eq(reservations.paymentStatus, "paid"));
    const totalRevenue = Number(revenueSum[0]?.sum || 0);

    // Total Leads count
    const leadsCount = await db.select({ count: sql<number>`count(*)` }).from(leads);
    const totalLeads = Number(leadsCount[0]?.count || 0);

    // Conversion rate: Won leads / Total leads
    const wonLeadsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.status, "won"));
    const wonLeads = Number(wonLeadsCount[0]?.count || 0);
    const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

    // Weekly/Daily sales trend data over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const trends = await db
      .select({
        date: sql<string>`DATE(created_at)`,
        count: sql<number>`count(*)`,
      })
      .from(reservations)
      .where(gte(reservations.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(created_at)`)
      .orderBy(sql`DATE(created_at)`);

    let salesTrendData = trends.map((t) => ({
      name: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: Number(t.count),
    }));

    // Fallback ONLY if there are no records in database at all (leads and orders both 0)
    if (salesTrendData.length === 0 && totalOrders === 0 && totalLeads === 0) {
      salesTrendData = [
        { name: "Week 1", sales: 12 },
        { name: "Week 2", sales: 19 },
        { name: "Week 3", sales: 15 },
        { name: "Week 4", sales: 26 },
      ];
    } else if (salesTrendData.length === 0) {
      // If there is data but no orders in the last 30 days, fill with empty chart nodes
      const today = new Date();
      salesTrendData = Array.from({ length: 4 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (21 - i * 7));
        return {
          name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          sales: 0,
        };
      });
    }

    return {
      totalOrders,
      totalRevenue,
      conversionRate,
      totalLeads,
      salesTrendData,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      conversionRate: 0,
      totalLeads: 0,
      salesTrendData: [],
    };
  }
}

// 2. CRM LEADS
export async function getLeadsAction() {
  try {
    const list = await db
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        email: leads.email,
        city: leads.city,
        source: leads.source,
        status: leads.status,
        assignedDealer: dealers.name,
        createdAt: leads.createdAt,
      })
      .from(leads)
      .leftJoin(dealers, eq(leads.assignedDealerId, dealers.id))
      .orderBy(desc(leads.createdAt));

    return list.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      email: l.email,
      city: l.city,
      source: l.source,
      status: l.status,
      assignedDealer: l.assignedDealer || "None",
      date: new Date(l.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function updateLeadStatusAction(leadId: number, nextStatus: any) {
  try {
    await db
      .update(leads)
      .set({ status: nextStatus })
      .where(eq(leads.id, leadId));
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return { success: false, error: error.message || "Failed to update lead status" };
  }
}

// 3. CATALOG CRUD (MODELS)
export async function getModelsAdminAction() {
  try {
    const list = await db.select().from(models).orderBy(desc(models.createdAt));
    const results = [];
    
    for (const model of list) {
      const variants = await db
        .select()
        .from(modelVariants)
        .where(eq(modelVariants.modelId, model.id))
        .orderBy(modelVariants.price);
      
      results.push({
        ...model,
        variants,
      });
    }
    return results;
  } catch (error) {
    console.error("Error fetching models for admin:", error);
    return [];
  }
}

export async function createModelAction(data: {
  slug: string;
  name: string;
  tagline: string;
  type: "motorcycle" | "scooter" | "three_wheeler";
  description: string;
  status: "draft" | "published";
  featured: boolean;
  basePrice: number;
  originalPrice?: number | null;
  inStock: boolean;
  heroImage: string;
  colors?: { name: string; hex: string; image: string }[];
  images?: string[];
}) {
  try {
    const {
      slug,
      name,
      tagline,
      type,
      description,
      status,
      featured,
      basePrice,
      originalPrice,
      inStock,
      heroImage,
      colors = [{ name: "Neon Volt", hex: "#BFFF00", image: heroImage }],
      images = [heroImage],
    } = data;

    const [newModel] = await db
      .insert(models)
      .values({
        slug,
        name,
        tagline,
        type,
        description,
        status,
        featured,
        basePrice,
        originalPrice,
        inStock,
        heroImage,
        colors: colors as any,
        images: images as any,
      })
      .returning();

    // Create a default model variant for pricing consistency
    await db.insert(modelVariants).values({
      modelId: newModel.id,
      name: "Standard LFP",
      batteryType: "LFP",
      price: basePrice,
      originalPrice: originalPrice || null,
      topSpeedKmh: 85,
      rangeKm: 120,
      chargingTimeHrs: 4,
      batteryLifeYears: 15,
      motorWatts: 1500,
      voltage: 72,
      ampHours: 40,
      chargeCycles: 3000,
      warrantyMonths: 36,
      weightKg: 95,
      loadKg: 150,
      brakes: "Front Disk / Rear Drum",
      suspension: "Hydraulic Telescopic",
      tyres: "90/90-12 Tubeless",
      ipRating: "IP67",
      smartFeatures: ["NFC Lock", "Anti-theft GPS"],
    });

    revalidateTag("models", "max");
    revalidatePath("/");
    revalidatePath("/models");
    revalidatePath(`/models/${slug}`);
    revalidatePath(`/reserve/${slug}`);
    
    return { success: true, model: newModel };
  } catch (error: any) {
    console.error("Error creating model:", error);
    return { success: false, error: error.message || "Failed to create model" };
  }
}

export async function updateModelAction(
  id: number,
  data: {
    slug: string;
    name: string;
    tagline: string;
    type: "motorcycle" | "scooter" | "three_wheeler";
    description: string;
    status: "draft" | "published";
    featured: boolean;
    basePrice: number;
    originalPrice?: number | null;
    inStock: boolean;
    heroImage: string;
    colors?: { name: string; hex: string; image: string }[];
    images?: string[];
  }
) {
  try {
    const {
      slug,
      name,
      tagline,
      type,
      description,
      status,
      featured,
      basePrice,
      originalPrice,
      inStock,
      heroImage,
      colors,
      images,
    } = data;

    const updateFields: any = {
      slug,
      name,
      tagline,
      type,
      description,
      status,
      featured,
      basePrice,
      originalPrice,
      inStock,
      heroImage,
    };

    if (colors) updateFields.colors = colors;
    if (images) updateFields.images = images;

    const [updatedModel] = await db
      .update(models)
      .set(updateFields)
      .where(eq(models.id, id))
      .returning();

    // Check if variant exists and update standard variant price as well
    const variants = await db.select().from(modelVariants).where(eq(modelVariants.modelId, id));
    if (variants.length > 0) {
      await db
        .update(modelVariants)
        .set({ price: basePrice, originalPrice: originalPrice || null })
        .where(eq(modelVariants.id, variants[0].id));
    }

    revalidateTag("models", "max");
    revalidatePath("/");
    revalidatePath("/models");
    revalidatePath(`/models/${slug}`);
    revalidatePath(`/reserve/${slug}`);

    return { success: true, model: updatedModel };
  } catch (error: any) {
    console.error("Error updating model:", error);
    return { success: false, error: error.message || "Failed to update model" };
  }
}

export async function deleteModelAction(id: number) {
  try {
    const model = await db.query.models.findFirst({
      where: (models, { eq }) => eq(models.id, id),
    });
    
    if (model) {
      await db.delete(models).where(eq(models.id, id));
      
      revalidateTag("models", "max");
      revalidatePath("/");
      revalidatePath("/models");
      revalidatePath(`/models/${model.slug}`);
      revalidatePath(`/reserve/${model.slug}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting model:", error);
    return { success: false, error: error.message || "Failed to delete model" };
  }
}

// 4. MODEL VARIANTS CRUD
export async function createVariantAction(data: {
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
}) {
  try {
    const [variant] = await db.insert(modelVariants).values(data).returning();
    
    // Auto-update model's basePrice if this is the cheapest variant
    const model = await db.query.models.findFirst({
      where: (models, { eq }) => eq(models.id, data.modelId),
    });
    if (model && data.price < model.basePrice) {
      await db.update(models).set({ basePrice: data.price }).where(eq(models.id, model.id));
    }

    revalidateTag("models", "max");
    if (model) {
      revalidatePath(`/models/${model.slug}`);
      revalidatePath(`/reserve/${model.slug}`);
    }
    return { success: true, variant };
  } catch (error: any) {
    console.error("Error creating variant:", error);
    return { success: false, error: error.message || "Failed to create variant" };
  }
}

export async function updateVariantAction(id: number, data: any) {
  try {
    const [variant] = await db.update(modelVariants).set(data).where(eq(modelVariants.id, id)).returning();
    
    // Sync model basePrice
    const model = await db.query.models.findFirst({
      where: (models, { eq }) => eq(models.id, variant.modelId),
    });
    if (model) {
      const allVariants = await db.select().from(modelVariants).where(eq(modelVariants.modelId, model.id));
      const minPrice = Math.min(...allVariants.map((v) => v.price));
      await db.update(models).set({ basePrice: minPrice }).where(eq(models.id, model.id));
      
      revalidateTag("models", "max");
      revalidatePath(`/models/${model.slug}`);
      revalidatePath(`/reserve/${model.slug}`);
    }
    
    return { success: true, variant };
  } catch (error: any) {
    console.error("Error updating variant:", error);
    return { success: false, error: error.message || "Failed to update variant" };
  }
}

export async function deleteVariantAction(id: number) {
  try {
    const [variant] = await db.select().from(modelVariants).where(eq(modelVariants.id, id));
    if (variant) {
      await db.delete(modelVariants).where(eq(modelVariants.id, id));
      
      // Update model basePrice with new minimum variant price
      const model = await db.query.models.findFirst({
        where: (models, { eq }) => eq(models.id, variant.modelId),
      });
      if (model) {
        const allVariants = await db.select().from(modelVariants).where(eq(modelVariants.modelId, model.id));
        if (allVariants.length > 0) {
          const minPrice = Math.min(...allVariants.map((v) => v.price));
          await db.update(models).set({ basePrice: minPrice }).where(eq(models.id, model.id));
        }
        revalidateTag("models", "max");
        revalidatePath(`/models/${model.slug}`);
        revalidatePath(`/reserve/${model.slug}`);
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting variant:", error);
    return { success: false, error: error.message || "Failed to delete variant" };
  }
}

// 5. ORDER / RESERVATION MANAGEMENT
export async function getOrdersAction() {
  try {
    const list = await db
      .select({
        id: reservations.id,
        orderRef: reservations.orderRef,
        customerName: leads.name,
        customerPhone: leads.phone,
        modelName: models.name,
        variantName: modelVariants.name,
        color: reservations.color,
        unitPrice: reservations.unitPrice,
        amountPaid: reservations.amountPaid,
        paymentStatus: reservations.paymentStatus,
        fulfilmentStatus: reservations.fulfilmentStatus,
        paymentProvider: reservations.paymentProvider,
        createdAt: reservations.createdAt,
        shippingAddress: reservations.shippingAddress,
      })
      .from(reservations)
      .leftJoin(models, eq(reservations.modelId, models.id))
      .leftJoin(modelVariants, eq(reservations.variantId, modelVariants.id))
      .leftJoin(leads, eq(leads.modelId, models.id))
      .orderBy(desc(reservations.createdAt));

    const uniqueOrders = new Map<string, any>();
    for (const item of list) {
      if (!uniqueOrders.has(item.orderRef)) {
        uniqueOrders.set(item.orderRef, {
          ...item,
          customerName: item.customerName || "Muhammad Ali",
          customerPhone: item.customerPhone || "03001234567",
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
    }
    return Array.from(uniqueOrders.values());
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatusAction(
  orderId: number,
  field: "paymentStatus" | "fulfilmentStatus",
  nextValue: any
) {
  try {
    const updateObj: any = {};
    updateObj[field] = nextValue;

    await db.update(reservations).set(updateObj).where(eq(reservations.id, orderId));
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message || "Failed to update order status" };
  }
}

// 6. SYSTEM CALCULATIONS & HELPLINE SETTINGS
export async function getSettingsAction() {
  try {
    const config = await db.select().from(savingsConfig).limit(1);
    const settings = await db.select().from(siteSettings).limit(1);

    return {
      petrolPrice: config[0]?.petrolPriceDefault ?? 272.5,
      electricityRate: config[0]?.electricityRate ?? 50.0,
      whatsappNumber: settings[0]?.whatsappNumber ?? "+923001234567",
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      petrolPrice: 272.5,
      electricityRate: 50.0,
      whatsappNumber: "+923001234567",
    };
  }
}

export async function updateSettingsAction(input: {
  petrolPrice: number;
  electricityRate: number;
  whatsappNumber: string;
}) {
  try {
    const { petrolPrice, electricityRate, whatsappNumber } = input;

    // Update savings config
    const config = await db.select().from(savingsConfig).limit(1);
    if (config.length > 0) {
      await db
        .update(savingsConfig)
        .set({
          petrolPriceDefault: petrolPrice,
          electricityRate: electricityRate,
          updatedAt: new Date(),
        })
        .where(eq(savingsConfig.id, config[0].id));
    } else {
      await db.insert(savingsConfig).values({
        petrolPriceDefault: petrolPrice,
        electricityRate: electricityRate,
        petrolPresets: [
          { name: "70cc Petrol Bike", consumptionKmPerLitre: 45, monthlyMaintenancePKR: 2000 },
          { name: "100cc Petrol Bike", consumptionKmPerLitre: 40, monthlyMaintenancePKR: 2500 },
          { name: "125cc Petrol Bike", consumptionKmPerLitre: 35, monthlyMaintenancePKR: 3000 },
        ],
        updatedAt: new Date(),
      });
    }

    // Update site settings
    const settings = await db.select().from(siteSettings).limit(1);
    if (settings.length > 0) {
      await db
        .update(siteSettings)
        .set({
          whatsappNumber: whatsappNumber,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, settings[0].id));
    } else {
      await db.insert(siteSettings).values({
        brandName: "ZENTARO",
        whatsappNumber: whatsappNumber,
        socialLinks: [],
        impactStats: { treesSaved: 0, co2ReducedKg: 0, fuelSavedLitres: 0 },
        heroVideoUrl: "",
        contactEmail: "info@zentaro.pk",
        contactPhone: "+9221111936827",
        updatedAt: new Date(),
      });
    }

    revalidatePath("/");
    revalidatePath("/savings-calculator");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

// 7. TEST RIDE MANAGEMENT
export async function getTestRideBookingsAction() {
  try {
    const list = await db
      .select({
        id: testRideBookings.id,
        name: testRideBookings.name,
        phone: testRideBookings.phone,
        email: testRideBookings.email,
        modelName: models.name,
        showroomName: dealers.name,
        date: testRideBookings.date,
        timeSlot: testRideBookings.timeSlot,
        status: testRideBookings.status,
      })
      .from(testRideBookings)
      .leftJoin(models, eq(testRideBookings.modelId, models.id))
      .leftJoin(dealers, eq(testRideBookings.dealerId, dealers.id))
      .orderBy(desc(testRideBookings.id));
    
    return list;
  } catch (error) {
    console.error("Error getting test ride bookings:", error);
    return [];
  }
}

export async function updateTestRideStatusAction(id: number, status: any) {
  try {
    await db.update(testRideBookings).set({ status }).where(eq(testRideBookings.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating test ride:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

// 8. FINANCING / INSTALLMENTS REVIEW
export async function getInstallmentApplicationsAction() {
  try {
    const list = await db
      .select({
        id: installmentApplications.id,
        fullName: installmentApplications.fullName,
        phone: installmentApplications.phone,
        email: installmentApplications.email,
        city: installmentApplications.city,
        modelName: models.name,
        variantName: modelVariants.name,
        downPayment: installmentApplications.downPayment,
        tenureMonths: installmentApplications.tenureMonths,
        estimatedMonthly: installmentApplications.estimatedMonthly,
        status: installmentApplications.status,
        notes: installmentApplications.notes,
        createdAt: installmentApplications.createdAt,
      })
      .from(installmentApplications)
      .leftJoin(models, eq(installmentApplications.modelId, models.id))
      .leftJoin(modelVariants, eq(installmentApplications.variantId, modelVariants.id))
      .orderBy(desc(installmentApplications.createdAt));

    return list.map((l) => ({
      ...l,
      date: new Date(l.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Error getting installment applications:", error);
    return [];
  }
}

export async function updateInstallmentStatusAction(id: number, status: any, notes?: string) {
  try {
    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;

    await db.update(installmentApplications).set(updateData).where(eq(installmentApplications.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating installment status:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

// 9. SMS AUDIT LOGS
export async function getSmsLogsAction() {
  try {
    const list = await db
      .select()
      .from(smsLogs)
      .orderBy(desc(smsLogs.createdAt))
      .limit(10);

    return list.map((log) => ({
      id: log.id,
      phone: log.phone,
      message: log.message,
      status: log.status,
      time: new Date(log.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
  } catch (error) {
    console.error("Error getting SMS logs:", error);
    return [];
  }
}

// 10. ENTERPRISE SYSTEM SEEDER
export async function seedSampleSystemDataAction() {
  try {
    console.log("🧹 Clearing old operational logs...");
    await db.delete(reservations);
    await db.delete(leads);
    await db.delete(testRideBookings);
    await db.delete(installmentApplications);
    await db.delete(smsLogs);

    const activeModels = await db.select().from(models);
    const activeVariants = await db.select().from(modelVariants);

    if (activeModels.length === 0 || activeVariants.length === 0) {
      throw new Error("No active models or variants in the database to link sample data. Run db:seed first.");
    }

    const bolt = activeModels.find((m) => m.slug === "zentaro-bolt") || activeModels[0];
    const storm = activeModels.find((m) => m.slug === "zentaro-storm") || activeModels[0];
    const apex = activeModels.find((m) => m.slug === "zentaro-apex") || activeModels[0];

    const boltVar = activeVariants.find((v) => v.modelId === bolt.id) || activeVariants[0];
    const stormVar = activeVariants.find((v) => v.modelId === storm.id) || activeVariants[0];
    const apexVar = activeVariants.find((v) => v.modelId === apex.id) || activeVariants[0];

    const showRooms = await db.select().from(dealers).limit(2);
    const showroomId = showRooms[0]?.id;
    if (!showroomId) {
      throw new Error("No showroom loaded. Seeding requires a dealer showroom in the DB.");
    }

    console.log("📝 Generating sample CRM leads...");
    const sampleLeadsData = [
      { name: "Haris Jamil", phone: "03001112223", email: "haris@gmail.pk", city: "Karachi", source: "test_ride" as const, modelId: bolt.id, status: "new" as const, notes: "Requested Storm test ride.", assignedDealerId: showroomId },
      { name: "Dr. Samina Khan", phone: "03334445556", email: "samina@hospital.pk", city: "Lahore", source: "installment" as const, modelId: storm.id, status: "contacted" as const, notes: "Applying for 12 months flat rate scheme.", assignedDealerId: showroomId },
      { name: "Muhammad Bilal", phone: "03219998887", email: "bilal.farooq@outlook.com", city: "Islamabad", source: "reservation" as const, modelId: apex.id, status: "won" as const, notes: "Token payment cleared.", assignedDealerId: showroomId },
      { name: "Fatima Ali", phone: "03004567890", email: "fatima@lums.edu.pk", city: "Lahore", source: "contact" as const, modelId: bolt.id, status: "lost" as const, notes: "Decided to buy petrol alternative due to budget constraints.", assignedDealerId: showroomId },
      { name: "Zeeshan Butt", phone: "03125556667", email: "zeeshan@example.pk", city: "Rawalpindi", source: "test_ride" as const, modelId: apex.id, status: "qualified" as const, notes: "Rider tested APEX, looks interested in Pro range model.", assignedDealerId: showroomId },
      { name: "Kamil Shah", phone: "03310002221", email: "kamil@corporate.pk", city: "Karachi", source: "newsletter" as const, modelId: storm.id, status: "new" as const, notes: "Inquired about fleet options.", assignedDealerId: showroomId },
    ];

    for (const leadData of sampleLeadsData) {
      await db.insert(leads).values(leadData);
    }

    console.log("💳 Seeding sample customer reservations (orders)...");
    const generateTimestamp = (daysAgo: number) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60));
      return d;
    };

    const sampleOrders = [
      { model: bolt, variant: boltVar, price: boltVar.price, color: "Neon Volt", ref: "ZEN-51201", type: "full" as const, amt: boltVar.price, pStat: "paid" as const, fStat: "delivered" as const, days: 28 },
      { model: storm, variant: stormVar, price: stormVar.price, color: "Steel Grey", ref: "ZEN-51202", type: "token" as const, amt: 20000, pStat: "paid" as const, fStat: "shipped" as const, days: 24 },
      { model: apex, variant: apexVar, price: apexVar.price, color: "Satin Red", ref: "ZEN-51203", type: "full" as const, amt: apexVar.price, pStat: "paid" as const, fStat: "delivered" as const, days: 21 },
      { model: bolt, variant: boltVar, price: boltVar.price, color: "Carbon Black", ref: "ZEN-51204", type: "full" as const, amt: boltVar.price, pStat: "paid" as const, fStat: "preparing" as const, days: 17 },
      { model: storm, variant: stormVar, price: stormVar.price, color: "Steel Grey", ref: "ZEN-51205", type: "full" as const, amt: stormVar.price, pStat: "paid" as const, fStat: "delivered" as const, days: 14 },
      { model: apex, variant: apexVar, price: apexVar.price, color: "Satin Red", ref: "ZEN-51206", type: "token" as const, amt: 20000, pStat: "paid" as const, fStat: "pending" as const, days: 11 },
      { model: bolt, variant: boltVar, price: boltVar.price, color: "Neon Volt", ref: "ZEN-51207", type: "installment" as const, amt: 50000, pStat: "pending" as const, fStat: "pending" as const, days: 7 },
      { model: storm, variant: stormVar, price: stormVar.price, color: "Carbon Black", ref: "ZEN-51208", type: "full" as const, amt: stormVar.price, pStat: "paid" as const, fStat: "pending" as const, days: 4 },
      { model: apex, variant: apexVar, price: apexVar.price, color: "Satin Red", ref: "ZEN-51209", type: "full" as const, amt: apexVar.price, pStat: "paid" as const, fStat: "delivered" as const, days: 2 },
      { model: bolt, variant: boltVar, price: boltVar.price, color: "Glossy White", ref: "ZEN-51210", type: "full" as const, amt: boltVar.price, pStat: "failed" as const, fStat: "cancelled" as const, days: 1 },
    ];

    for (const order of sampleOrders) {
      await db.insert(reservations).values({
        modelId: order.model.id,
        variantId: order.variant.id,
        color: order.color,
        unitPrice: order.price,
        paymentType: order.type,
        amountPaid: order.amt,
        paymentStatus: order.pStat,
        paymentProvider: "safepay",
        providerRef: "sp_ref_" + Math.random().toString(36).substring(4, 9),
        orderRef: order.ref,
        fulfilmentStatus: order.fStat,
        dealerId: showroomId,
        shippingAddress: "Karachi Central Showroom Deliveries Hub",
        createdAt: generateTimestamp(order.days),
      });
    }

    console.log("🏍️ Seeding sample test ride bookings...");
    const testRidesToInsert = [
      { name: "Haris Jamil", phone: "03001112223", email: "haris@gmail.pk", modelId: bolt.id, dealerId: showroomId, date: "2026-06-03", timeSlot: "10:00 AM - 11:30 AM", status: "pending" as const, createdAt: generateTimestamp(3) },
      { name: "Zeeshan Butt", phone: "03125556667", email: "zeeshan@example.pk", modelId: apex.id, dealerId: showroomId, date: "2026-06-02", timeSlot: "02:00 PM - 03:30 PM", status: "confirmed" as const, createdAt: generateTimestamp(2) },
      { name: "Kamran Shah", phone: "03009991234", email: "kamran@gmail.com", modelId: storm.id, dealerId: showroomId, date: "2026-05-30", timeSlot: "11:30 AM - 01:00 PM", status: "completed" as const, createdAt: generateTimestamp(6) },
    ];
    for (const tr of testRidesToInsert) {
      await db.insert(testRideBookings).values(tr);
    }

    console.log("💵 Seeding sample installment applications...");
    const installmentsToInsert = [
      { fullName: "Dr. Samina Khan", phone: "03334445556", email: "samina@hospital.pk", city: "Lahore", modelId: storm.id, variantId: stormVar.id, downPayment: 120000, tenureMonths: 12, estimatedMonthly: 30750, status: "new" as const, notes: "Prefers flat rate zero markup plan.", createdAt: generateTimestamp(4) },
      { fullName: "Aftab Ahmed", phone: "03214441112", email: "aftab@finance.pk", city: "Karachi", modelId: apex.id, variantId: apexVar.id, downPayment: 225000, tenureMonths: 24, estimatedMonthly: 21875, status: "approved" as const, notes: "Credit checks verified, application approved.", createdAt: generateTimestamp(8) },
    ];
    for (const inst of installmentsToInsert) {
      await db.insert(installmentApplications).values(inst);
    }

    console.log("📱 Seeding sample outbound SMS notifications logs...");
    const smsLogsToInsert = [
      { phone: "03001112223", message: "ZENTARO: Your test ride booking for Zentaro Bolt on 2026-06-03 is CONFIRMED. Bring CNIC.", status: "sent", createdAt: generateTimestamp(3) },
      { phone: "03125556667", message: "ZENTARO: Your test ride booking for Zentaro Apex on 2026-06-02 is CONFIRMED. Bring CNIC.", status: "sent", createdAt: generateTimestamp(2) },
      { phone: "03219998887", message: "ZENTARO: Your order ZEN-51203 for Zentaro Apex LFP has been DELIVERED.", status: "sent", createdAt: generateTimestamp(21) },
      { phone: "03334445556", message: "ZENTARO: Thank you for applying for ZENTARO Easy Installments. Our team will contact you shortly.", status: "sent", createdAt: generateTimestamp(4) },
    ];
    for (const log of smsLogsToInsert) {
      await db.insert(smsLogs).values(log);
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Seeding sample data failed:", error);
    return { success: false, error: error.message || "Failed to seed sample data" };
  }
}
