import { pgTable, uuid, text, timestamp, serial, boolean, integer, doublePrecision, jsonb } from "drizzle-orm/pg-core";

// 1. PROFILES TABLE
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // Matches Supabase auth.users.id
  role: text("role").$type<"customer" | "dealer" | "admin">().default("customer").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email").notNull(),
  city: text("city"),
  cnic: text("cnic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. MODELS TABLE
export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  type: text("type").$type<"motorcycle" | "scooter" | "three_wheeler">().notNull(),
  description: text("description").notNull(),
  status: text("status").$type<"draft" | "published">().default("draft").notNull(),
  featured: boolean("featured").default(false).notNull(),
  heroImage: text("hero_image").notNull(),
  images: text("images").array().notNull(), // Array of render image paths
  colors: jsonb("colors").$type<{ name: string; hex: string; image: string }[]>().notNull(), // Swatches + render image
  basePrice: integer("base_price").notNull(),
  originalPrice: integer("original_price"), // For strikethrough prices
  inStock: boolean("in_stock").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. MODEL VARIANTS TABLE
export const modelVariants = pgTable("model_variants", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => models.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(), // Standard, Pro, Lithium LFP, Graphene Standard
  batteryType: text("battery_type").$type<"LFP" | "Lithium" | "Graphene">().notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  topSpeedKmh: integer("top_speed_kmh").notNull(),
  rangeKm: integer("range_km").notNull(),
  chargingTimeHrs: doublePrecision("charging_time_hrs").notNull(),
  batteryLifeYears: doublePrecision("battery_life_years").notNull(),
  motorWatts: integer("motor_watts").notNull(),
  voltage: integer("voltage").notNull(),
  ampHours: integer("amp_hours").notNull(),
  chargeCycles: integer("charge_cycles").notNull(),
  warrantyMonths: integer("warranty_months").notNull(),
  weightKg: integer("weight_kg").notNull(),
  loadKg: integer("load_kg").notNull(),
  brakes: text("brakes").notNull(),
  suspension: text("suspension").notNull(),
  tyres: text("tyres").notNull(),
  ipRating: text("ip_rating").notNull(),
  smartFeatures: text("smart_features").array().notNull(), // e.g. ["NFC Unlock", "Anti-theft GPS"]
});

// 4. FEATURES TABLE (Global library)
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  icon: text("icon").notNull(), // Lucide icon slug
  title: text("title").notNull(),
  blurb: text("blurb").notNull(),
  category: text("category").notNull(), // battery, performance, smart, security
});

// 5. MODEL FEATURES BRIDGE TABLE
export const modelToFeatures = pgTable("model_to_features", {
  modelId: integer("model_id").references(() => models.id, { onDelete: "cascade" }).notNull(),
  featureId: integer("feature_id").references(() => features.id, { onDelete: "cascade" }).notNull(),
});

// 6. DEALERS TABLE
export const dealers = pgTable("dealers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  address: text("address").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  type: text("type").$type<"showroom" | "service_center" | "charging_point">().notNull(),
  hours: text("hours").notNull(), // e.g. "9:00 AM - 9:00 PM"
  mapUrl: text("map_url").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ownerUserId: uuid("owner_user_id").references(() => profiles.id, { onDelete: "set null" }),
});

// 7. LEADS TABLE (CRM)
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  source: text("source").$type<"reservation" | "test_ride" | "installment" | "contact" | "dealer_inquiry" | "newsletter">().notNull(),
  modelId: integer("model_id").references(() => models.id, { onDelete: "set null" }),
  variantId: integer("variant_id").references(() => modelVariants.id, { onDelete: "set null" }),
  status: text("status").$type<"new" | "contacted" | "qualified" | "won" | "lost">().default("new").notNull(),
  assignedDealerId: integer("assigned_dealer_id").references(() => dealers.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. TEST RIDE BOOKINGS TABLE
export const testRideBookings = pgTable("test_ride_bookings", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  modelId: integer("model_id").references(() => models.id, { onDelete: "cascade" }).notNull(),
  dealerId: integer("dealer_id").references(() => dealers.id, { onDelete: "cascade" }).notNull(),
  date: text("date").notNull(), // Format YYYY-MM-DD
  timeSlot: text("time_slot").notNull(), // e.g. "10:00 AM - 11:30 AM"
  status: text("status").$type<"pending" | "confirmed" | "completed" | "cancelled">().default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. RESERVATIONS / ORDERS TABLE
export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  modelId: integer("model_id").references(() => models.id).notNull(),
  variantId: integer("variant_id").references(() => modelVariants.id).notNull(),
  color: text("color").notNull(),
  unitPrice: integer("unit_price").notNull(),
  paymentType: text("payment_type").$type<"full" | "token" | "installment">().notNull(),
  amountPaid: integer("amount_paid").notNull(),
  paymentStatus: text("payment_status").$type<"pending" | "paid" | "failed" | "refunded">().default("pending").notNull(),
  paymentProvider: text("payment_provider").notNull(), // 'safepay', 'mock', 'bank_transfer'
  providerRef: text("provider_ref"), // Safepay session or transaction ID
  orderRef: text("order_ref").unique().notNull(), // Auto-increment or unique sequence ref
  fulfilmentStatus: text("fulfilment_status").$type<"pending" | "preparing" | "shipped" | "delivered" | "cancelled">().default("pending").notNull(),
  dealerId: integer("dealer_id").references(() => dealers.id),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. INSTALLMENT APPLICATIONS TABLE
export const installmentApplications = pgTable("installment_applications", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  city: text("city").notNull(),
  modelId: integer("model_id").references(() => models.id).notNull(),
  variantId: integer("variant_id").references(() => modelVariants.id).notNull(),
  downPayment: integer("down_payment").notNull(),
  tenureMonths: integer("tenure_months").notNull(),
  estimatedMonthly: integer("estimated_monthly").notNull(),
  status: text("status").$type<"new" | "contacted" | "approved" | "rejected">().default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 11. INSTALLMENT PLANS TABLE (Admin Configured)
export const installmentPlans = pgTable("installment_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g. "Self-Finance Flat", "Easy Installments"
  downPaymentPct: doublePrecision("down_payment_pct").notNull(), // Default min downpayment e.g. 20.0
  tenureMonths: integer("tenure_months").notNull(), // e.g. 12
  markupPct: doublePrecision("markup_pct").notNull(), // Flat markup rate e.g. 12.0
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// 12. REVIEWS TABLE
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  quote: text("quote").notNull(),
  sourceUrl: text("source_url"),
  modelId: integer("model_id").references(() => models.id, { onDelete: "set null" }),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 13. FAQS TABLE
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(), // 'general', 'battery', 'charging', 'financing'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 14. BLOG POSTS TABLE
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  coverImage: text("cover_image").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at"),
  status: text("status").$type<"draft" | "published">().default("draft").notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 15. SAVINGS CONFIG TABLE
export const savingsConfig = pgTable("savings_config", {
  id: serial("id").primaryKey(),
  petrolPriceDefault: doublePrecision("petrol_price_default").notNull(), // e.g., 272.50
  petrolPresets: jsonb("petrol_presets").$type<{
    name: string; // e.g., "70cc", "100cc", "125cc"
    consumptionKmPerLitre: number; // e.g., 45.0
    monthlyMaintenancePKR: number; // e.g., 2000.0
  }[]>().notNull(),
  electricityRate: doublePrecision("electricity_rate").notNull(), // e.g., 50.0 (PKR per kWh)
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 16. SITE SETTINGS TABLE
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  brandName: text("brand_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(), // e.g., "+923001234567"
  socialLinks: jsonb("social_links").$type<{ platform: string; url: string }[]>().notNull(),
  impactStats: jsonb("impact_stats").$type<{ treesSaved: number; co2ReducedKg: number; fuelSavedLitres: number }>().notNull(),
  heroVideoUrl: text("hero_video_url").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 17. SMS AUDIT LOGS
export const smsLogs = pgTable("sms_logs", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull(), // 'sent', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
