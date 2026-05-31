import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import {
  models,
  modelVariants,
  features,
  modelToFeatures,
  dealers,
  faqs,
  blogPosts,
  savingsConfig,
  siteSettings,
  installmentPlans,
  reviews,
} from "./schema";

async function main() {
  console.log("🌱 Starting database seeding...");
  const { db } = await import("./index");

  // 1. DELETE EXISTING DATA (Order of dependencies)
  console.log("🧹 Cleaning existing data...");
  await db.delete(modelToFeatures);
  await db.delete(modelVariants);
  await db.delete(models);
  await db.delete(features);
  await db.delete(dealers);
  await db.delete(faqs);
  await db.delete(blogPosts);
  await db.delete(savingsConfig);
  await db.delete(siteSettings);
  await db.delete(installmentPlans);
  await db.delete(reviews);

  // 2. INSERT SITE SETTINGS
  console.log("📝 Seeding Site Settings...");
  const [settings] = await db
    .insert(siteSettings)
    .values({
      brandName: "ZENTARO",
      whatsappNumber: "+923001234567",
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com/zentaromobility" },
        { platform: "instagram", url: "https://instagram.com/zentaromobility" },
        { platform: "linkedin", url: "https://linkedin.com/company/zentaromobility" },
        { platform: "youtube", url: "https://youtube.com/zentaromobility" },
      ],
      impactStats: {
        treesSaved: 1450,
        co2ReducedKg: 85200,
        fuelSavedLitres: 38400,
      },
      heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-motorcycle-on-a-highway-at-night-40348-large.mp4", // placeholder clip
      contactEmail: "info@zentaro.pk",
      contactPhone: "+9221111936827", // +92-21-111-ZENTAR
    })
    .returning();

  // 3. INSERT SAVINGS CONFIG
  console.log("⚡ Seeding Savings Configurations...");
  await db.insert(savingsConfig).values({
    petrolPriceDefault: 272.5,
    electricityRate: 50.0,
    petrolPresets: [
      { name: "70cc Petrol Bike", consumptionKmPerLitre: 45, monthlyMaintenancePKR: 2000 },
      { name: "100cc Petrol Bike", consumptionKmPerLitre: 40, monthlyMaintenancePKR: 2500 },
      { name: "125cc Petrol Bike", consumptionKmPerLitre: 35, monthlyMaintenancePKR: 3000 },
    ],
  });

  // 4. INSERT INSTALLMENT PLANS
  console.log("💰 Seeding Installment Plans...");
  await db.insert(installmentPlans).values([
    {
      name: "ZENTARO Easy Installments (Flat rate)",
      downPaymentPct: 20.0,
      tenureMonths: 12,
      markupPct: 0.0, // Zero markup incentive
      description: "Get interest-free financing directly from ZENTARO for up to 12 months with a 20% down payment.",
      isActive: true,
    },
    {
      name: "Flexible Leasing (24 Months)",
      downPaymentPct: 25.0,
      tenureMonths: 24,
      markupPct: 10.0,
      description: "Low monthly payments spread across 24 months with a 10% flat annual markup rate.",
      isActive: true,
    },
    {
      name: "Long-term Security Plan (36 Months)",
      downPaymentPct: 30.0,
      tenureMonths: 36,
      markupPct: 14.0,
      description: "Maximum tenure plan. Best for commercial riders and fleet optimizations.",
      isActive: true,
    },
  ]);

  // 5. INSERT GLOBAL FEATURES
  console.log("🛠️ Seeding Features...");
  const insertedFeatures = await db
    .insert(features)
    .values([
      {
        icon: "BatteryCharging",
        title: "LFP Advanced Battery",
        blurb: "Lithium Iron Phosphate cells. Safe, thermal-resistant, and supports 3000+ charge cycles.",
        category: "battery",
      },
      {
        icon: "ShieldAlert",
        title: "Anti-Theft GPS",
        blurb: "Live tracking, geofencing, and remote motor lock triggers directly from your mobile app.",
        category: "security",
      },
      {
        icon: "Zap",
        title: "High-Torque Hub Motor",
        blurb: "Direct traction, instant torque, and brushless efficiency needing zero belt maintenance.",
        category: "performance",
      },
      {
        icon: "Smartphone",
        title: "App Connectivity",
        blurb: "NFC keyless unlock, OTA updates, riding analytics, and diagnostics on ZENTARO App.",
        category: "smart",
      },
      {
        icon: "Gauge",
        title: "Regenerative Braking",
        blurb: "Saves up to 10% battery charge back on downhill rolls and deceleration.",
        category: "performance",
      },
      {
        icon: "CloudRain",
        title: "IP67 Waterproofing",
        blurb: "Drive through Karachi monsoon flood streets with fully waterproof battery and motor hubs.",
        category: "security",
      },
    ])
    .returning();

  // 6. INSERT MODELS & VARIANTS
  console.log("🏍️ Seeding Models & Variants...");
  
  // Model 1: ZENTARO Thunder
  const [thunder] = await db
    .insert(models)
    .values({
      slug: "zentaro-thunder",
      name: "ZENTARO Thunder",
      tagline: "Unleash the Storm",
      type: "motorcycle",
      description: "Our premium high-speed sports electric motorcycle. Engineered for adrenaline, highway range, and a commanding street presence.",
      status: "published",
      featured: true,
      heroImage: "/images/models/thunder-hero.png",
      images: [
        "/images/models/thunder-side.png",
        "/images/models/thunder-front.png",
        "/images/models/thunder-back.png"
      ],
      colors: [
        { name: "Electric Lime", hex: "#BFFF00", image: "/images/models/thunder-lime.png" },
        { name: "Carbon Stealth", hex: "#1A1A1A", image: "/images/models/thunder-stealth.png" },
        { name: "Polar Ice Blue", hex: "#00E5FF", image: "/images/models/thunder-ice.png" },
      ],
      basePrice: 549000,
      originalPrice: 599000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: thunder.id,
      name: "Thunder LFP Standard",
      batteryType: "LFP",
      price: 549000,
      originalPrice: 599000,
      topSpeedKmh: 95,
      rangeKm: 120,
      chargingTimeHrs: 3.5,
      batteryLifeYears: 8.0,
      motorWatts: 3000,
      voltage: 72,
      ampHours: 40,
      chargeCycles: 2500,
      warrantyMonths: 36,
      weightKg: 115,
      loadKg: 180,
      brakes: "Dual CBS Disc Brakes",
      suspension: "Front Telescopic, Rear Monoshock",
      tyres: "Tubeless (Front 90/90-17, Rear 110/80-17)",
      ipRating: "IP67",
      smartFeatures: ["NFC Keyless Lock", "Anti-Theft System", "App Dash Integration"],
    },
    {
      modelId: thunder.id,
      name: "Thunder LFP Pro (Dual Battery)",
      batteryType: "LFP",
      price: 679000,
      originalPrice: 729000,
      topSpeedKmh: 105,
      rangeKm: 220,
      chargingTimeHrs: 6.0,
      batteryLifeYears: 8.0,
      motorWatts: 4000,
      voltage: 72,
      ampHours: 80,
      chargeCycles: 2500,
      warrantyMonths: 48,
      weightKg: 135,
      loadKg: 180,
      brakes: "Dual CBS Disc Brakes",
      suspension: "Front Telescopic, Rear Monoshock",
      tyres: "Tubeless Premium compound",
      ipRating: "IP67",
      smartFeatures: ["NFC Keyless", "GPS Tracking", "Custom Ride Profiles", "Reverse Assist Mode"],
    }
  ]);

  // Model 2: ZENTARO Alpha
  const [alpha] = await db
    .insert(models)
    .values({
      slug: "zentaro-alpha",
      name: "ZENTARO Alpha",
      tagline: "The City Commute, Redefined",
      type: "motorcycle",
      description: "A sporty standard motorcycle engineered for daily commuters in Pakistan. Offering a balance of affordability, rugged suspension, and superior LFP range.",
      status: "published",
      featured: true,
      heroImage: "/images/models/alpha-hero.png",
      images: ["/images/models/alpha-side.png"],
      colors: [
        { name: "Stealth Grey", hex: "#4A4A4F", image: "/images/models/alpha-grey.png" },
        { name: "Crimson Spark", hex: "#DC2626", image: "/images/models/alpha-red.png" },
      ],
      basePrice: 429000,
      originalPrice: 459000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: alpha.id,
      name: "Alpha Graphene Commuter",
      batteryType: "Graphene",
      price: 369000,
      originalPrice: 399000,
      topSpeedKmh: 75,
      rangeKm: 90,
      chargingTimeHrs: 5.5,
      batteryLifeYears: 3.5,
      motorWatts: 1500,
      voltage: 60,
      ampHours: 32,
      chargeCycles: 800,
      warrantyMonths: 18,
      weightKg: 105,
      loadKg: 150,
      brakes: "Front Disc, Rear Drum CBS",
      suspension: "Dual Hydro-Coil Shock absorbers",
      tyres: "Tubeless (Front 2.75-18, Rear 3.00-18)",
      ipRating: "IP65",
      smartFeatures: ["Remote Fob alarm", "USB Charge Jack"],
    },
    {
      modelId: alpha.id,
      name: "Alpha LFP Long-Range",
      batteryType: "LFP",
      price: 429000,
      originalPrice: 459000,
      topSpeedKmh: 85,
      rangeKm: 140,
      chargingTimeHrs: 4.0,
      batteryLifeYears: 8.0,
      motorWatts: 2500,
      voltage: 72,
      ampHours: 42,
      chargeCycles: 2500,
      warrantyMonths: 36,
      weightKg: 110,
      loadKg: 160,
      brakes: "Front Disc, Rear Disc CBS",
      suspension: "Dual Heavy duty rear spring shocks",
      tyres: "Tubeless (Front 2.75-18, Rear 3.00-18)",
      ipRating: "IP67",
      smartFeatures: ["NFC Unlock", "Anti-theft GPS tracking", "USB Charge Port"],
    }
  ]);

  // Model 3: ZENTARO Breeze
  const [breeze] = await db
    .insert(models)
    .values({
      slug: "zentaro-breeze",
      name: "ZENTARO Breeze",
      tagline: "Glide Through Traffic",
      type: "scooter",
      description: "A lightweight, stylish step-through electric scooter designed for students and working professionals. Unisex geometry and low seat height.",
      status: "published",
      featured: true,
      heroImage: "/images/models/breeze-hero.png",
      images: ["/images/models/breeze-side.png"],
      colors: [
        { name: "Polar Pearl", hex: "#FFFFFF", image: "/images/models/breeze-white.png" },
        { name: "Midnight Onyx", hex: "#0D0D0D", image: "/images/models/breeze-black.png" },
        { name: "Blossom Pink", hex: "#F472B6", image: "/images/models/breeze-pink.png" },
      ],
      basePrice: 329000,
      originalPrice: 349000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: breeze.id,
      name: "Breeze Graphene Standard",
      batteryType: "Graphene",
      price: 279000,
      originalPrice: 299000,
      topSpeedKmh: 60,
      rangeKm: 70,
      chargingTimeHrs: 5.0,
      batteryLifeYears: 3.0,
      motorWatts: 1200,
      voltage: 60,
      ampHours: 24,
      chargeCycles: 750,
      warrantyMonths: 12,
      weightKg: 85,
      loadKg: 130,
      brakes: "CBS Disc/Drum",
      suspension: "Telescopic Fork, Hydraulic Shocks",
      tyres: "10 inch Tubeless tyres",
      ipRating: "IP65",
      smartFeatures: ["Keyless Go", "Under-seat cargo light"],
    },
    {
      modelId: breeze.id,
      name: "Breeze LFP Pro",
      batteryType: "LFP",
      price: 329000,
      originalPrice: 349000,
      topSpeedKmh: 70,
      rangeKm: 110,
      chargingTimeHrs: 3.0,
      batteryLifeYears: 8.0,
      motorWatts: 2000,
      voltage: 60,
      ampHours: 35,
      chargeCycles: 2500,
      warrantyMonths: 36,
      weightKg: 90,
      loadKg: 140,
      brakes: "Dual Hydraulic Disc Brakes",
      suspension: "Telescopic Fork, Hydraulic Shocks",
      tyres: "10 inch Tubeless tyres",
      ipRating: "IP67",
      smartFeatures: ["NFC Unlock", "Anti-theft GPS tracking", "Under-seat cargo light", "Regen Mode"],
    }
  ]);

  // Model 4: ZENTARO Bolt (Entry Graphene motorcycle)
  const [bolt] = await db
    .insert(models)
    .values({
      slug: "zentaro-bolt",
      name: "ZENTARO Bolt",
      tagline: "City commuter, redefined.",
      type: "motorcycle",
      description: "Our entry-level utility electric motorcycle. Designed to withstand cargo weight, courier work, and rough roads.",
      status: "published",
      featured: true,
      heroImage: "/images/models/bolt-hero.png",
      images: ["/images/models/bolt-side.png"],
      colors: [
        { name: "Utility Red", hex: "#B91C1C", image: "/images/models/bolt-red.png" },
        { name: "Utility Black", hex: "#111827", image: "/images/models/bolt-black.png" },
      ],
      basePrice: 289000,
      originalPrice: 339000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: bolt.id,
      name: "Bolt Cargo Graphene",
      batteryType: "Graphene",
      price: 289000,
      originalPrice: 339000,
      topSpeedKmh: 80,
      rangeKm: 120,
      chargingTimeHrs: 4.0,
      batteryLifeYears: 15.0,
      motorWatts: 1500,
      voltage: 60,
      ampHours: 30,
      chargeCycles: 800,
      warrantyMonths: 12,
      weightKg: 110,
      loadKg: 200,
      brakes: "Heavy CBS Shocks",
      suspension: "Triple spring load support",
      tyres: "18 inch tubed heavy carrier tyres",
      ipRating: "IP65",
      smartFeatures: ["USB Utility charger", "Rear rack bracket"],
    }
  ]);

  // Model 5: ZENTARO Storm (Sport Naked Bike)
  const [storm] = await db
    .insert(models)
    .values({
      slug: "zentaro-storm",
      name: "ZENTARO Storm",
      tagline: "Where torque meets thrill.",
      type: "motorcycle",
      description: "Naked sports geometry with a massive liquid-cooled mid-drive motor. Delivering unparalleled acceleration and speed.",
      status: "published",
      featured: true,
      heroImage: "/images/models/storm-hero.png",
      images: ["/images/models/storm-side.png"],
      colors: [
        { name: "Storm Matte Blue", hex: "#1D4ED8", image: "/images/models/storm-blue.png" },
      ],
      basePrice: 489000,
      originalPrice: 549000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: storm.id,
      name: "Storm Performance LFP",
      batteryType: "LFP",
      price: 489000,
      originalPrice: 549000,
      topSpeedKmh: 110,
      rangeKm: 160,
      chargingTimeHrs: 5.0,
      batteryLifeYears: 15.0,
      motorWatts: 8000, // Mid-drive performance
      voltage: 84,
      ampHours: 60,
      chargeCycles: 3000,
      warrantyMonths: 36,
      weightKg: 145,
      loadKg: 170,
      brakes: "Double Front Disc, Rear Disc ABS",
      suspension: "Inverted Front Forks, Rear Gas Monoshock",
      tyres: "Tubeless Sport radial compound",
      ipRating: "IP67",
      smartFeatures: ["TFT Screen with navigation maps", "NFC lock", "Ride-by-wire modes"],
    }
  ]);

  // Model 6: ZENTARO Glide (Cruising Scooter)
  const [glide] = await db
    .insert(models)
    .values({
      slug: "zentaro-glide",
      name: "ZENTARO Glide",
      tagline: "Smooth Cruising",
      type: "scooter",
      description: "Premium large-wheeled maxi-scooter for ultra-smooth suburban commutes and highway cruising. Spacious floorboard.",
      status: "published",
      featured: false,
      heroImage: "/images/models/glide-hero.png",
      images: ["/images/models/glide-side.png"],
      colors: [
        { name: "Lux Metallic Bronze", hex: "#78350F", image: "/images/models/glide-bronze.png" },
        { name: "Lux Silver Pearl", hex: "#E5E7EB", image: "/images/models/glide-silver.png" },
      ],
      basePrice: 219000,
      originalPrice: 259000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: glide.id,
      name: "Glide Premium LFP",
      batteryType: "LFP",
      price: 219000,
      originalPrice: 259000,
      topSpeedKmh: 80,
      rangeKm: 130,
      chargingTimeHrs: 4.0,
      batteryLifeYears: 8.0,
      motorWatts: 3000,
      voltage: 72,
      ampHours: 45,
      chargeCycles: 2500,
      warrantyMonths: 36,
      weightKg: 105,
      loadKg: 160,
      brakes: "Front Disc, Rear Disc CBS",
      suspension: "Dual Hydraulic Rear Shocks",
      tyres: "12 inch Wide Tubeless Shocks",
      ipRating: "IP67",
      smartFeatures: ["NFC Unlock", "GPS Live tracking", "Large underseat compartment"],
    }
  ]);

  // Model 7: ZENTARO Apex (Flagship)
  const [apex] = await db
    .insert(models)
    .values({
      slug: "zentaro-apex",
      name: "ZENTARO Apex",
      tagline: "Flagship power. Future ride.",
      type: "motorcycle",
      description: "ZENTARO Apex is our ultimate flagship electric motorcycle, engineered for maximum power, range, and premium riding dynamics. It delivers track-level acceleration and raw power.",
      status: "published",
      featured: true,
      heroImage: "/images/models/apex-hero.png",
      images: ["/images/models/apex-side.png"],
      colors: [
        { name: "Electric Lime", hex: "#BFFF00", image: "/images/models/apex-lime.png" },
        { name: "Carbon Stealth", hex: "#1A1A1A", image: "/images/models/apex-stealth.png" },
      ],
      basePrice: 749000,
      originalPrice: 829000,
      inStock: true,
    })
    .returning();

  await db.insert(modelVariants).values([
    {
      modelId: apex.id,
      name: "Apex Ultimate LFP",
      batteryType: "LFP",
      price: 749000,
      originalPrice: 829000,
      topSpeedKmh: 130,
      rangeKm: 200,
      chargingTimeHrs: 6.0,
      batteryLifeYears: 15.0,
      motorWatts: 6000,
      voltage: 72,
      ampHours: 90,
      chargeCycles: 2500,
      warrantyMonths: 48,
      weightKg: 140,
      loadKg: 180,
      brakes: "Dual CBS Disc Brakes",
      suspension: "Front Inverted Telescopic, Rear Monoshock",
      tyres: "Tubeless Premium Sport compound",
      ipRating: "IP67",
      smartFeatures: ["NFC Keyless", "GPS Tracking", "Custom Ride Profiles", "Reverse Assist Mode"],
    }
  ]);

  // Attach features to models
  console.log("🔗 Binding Features to Models...");
  // Bind standard features to Thunder
  for (const feat of insertedFeatures) {
    await db.insert(modelToFeatures).values({
      modelId: thunder.id,
      featureId: feat.id,
    });
  }

  // Bind key features to Alpha
  await db.insert(modelToFeatures).values([
    { modelId: alpha.id, featureId: insertedFeatures[0].id }, // LFP
    { modelId: alpha.id, featureId: insertedFeatures[1].id }, // GPS
    { modelId: alpha.id, featureId: insertedFeatures[2].id }, // Hub Motor
    { modelId: alpha.id, featureId: insertedFeatures[3].id }, // App
  ]);

  // Bind key features to Breeze
  await db.insert(modelToFeatures).values([
    { modelId: breeze.id, featureId: insertedFeatures[0].id }, // LFP
    { modelId: breeze.id, featureId: insertedFeatures[3].id }, // App
    { modelId: breeze.id, featureId: insertedFeatures[4].id }, // Regen
    { modelId: breeze.id, featureId: insertedFeatures[5].id }, // IP67
  ]);

  // Bind features to Bolt
  await db.insert(modelToFeatures).values([
    { modelId: bolt.id, featureId: insertedFeatures[3].id }, // App
  ]);

  // Bind features to Storm
  await db.insert(modelToFeatures).values([
    { modelId: storm.id, featureId: insertedFeatures[1].id }, // GPS
    { modelId: storm.id, featureId: insertedFeatures[2].id }, // Hub Motor
    { modelId: storm.id, featureId: insertedFeatures[3].id }, // App
  ]);

  // Bind features to Apex
  for (const feat of insertedFeatures) {
    await db.insert(modelToFeatures).values({
      modelId: apex.id,
      featureId: feat.id,
    });
  }

  // 7. INSERT DEALERS
  console.log("📍 Seeding 12 Dealer locations...");
  await db.insert(dealers).values([
    // Karachi
    {
      name: "ZENTARO Clifton Showroom",
      city: "Karachi",
      province: "Sindh",
      address: "Main Clifton Road, Block 4, Clifton, Karachi",
      lat: 24.8152,
      lng: 67.0315,
      phone: "+922135831201",
      whatsapp: "+923009212001",
      type: "showroom",
      hours: "10:00 AM - 9:00 PM",
      mapUrl: "https://maps.google.com/?q=24.8152,67.0315",
      isActive: true,
    },
    {
      name: "ZENTARO Shahra-e-Faisal Service & Charge",
      city: "Karachi",
      province: "Sindh",
      address: "Main Shahra-e-Faisal, near Nursery, Block 6 PECHS, Karachi",
      lat: 24.8623,
      lng: 67.0734,
      phone: "+922134534012",
      whatsapp: "+923009212002",
      type: "service_center",
      hours: "9:00 AM - 6:00 PM (Sunday Closed)",
      mapUrl: "https://maps.google.com/?q=24.8623,67.0734",
      isActive: true,
    },
    // Lahore
    {
      name: "ZENTARO Gulberg Flagship Showroom",
      city: "Lahore",
      province: "Punjab",
      address: "MM Alam Road, Gulberg III, Lahore",
      lat: 31.5126,
      lng: 74.3512,
      phone: "+924235759102",
      whatsapp: "+923008412001",
      type: "showroom",
      hours: "11:00 AM - 9:30 PM",
      mapUrl: "https://maps.google.com/?q=31.5126,74.3512",
      isActive: true,
    },
    {
      name: "ZENTARO DHA Phase 5 Service Hub",
      city: "Lahore",
      province: "Punjab",
      address: "CCA, Phase 5 DHA, Lahore",
      lat: 31.4697,
      lng: 74.4372,
      phone: "+924235691023",
      whatsapp: "+923008412002",
      type: "service_center",
      hours: "9:00 AM - 7:00 PM",
      mapUrl: "https://maps.google.com/?q=31.4697,74.4372",
      isActive: true,
    },
    // Islamabad & Rawalpindi
    {
      name: "ZENTARO Blue Area Showroom",
      city: "Islamabad",
      province: "Islamabad Capital Territory",
      address: "Jinnah Avenue, G 7/3 Blue Area, Islamabad",
      lat: 33.7121,
      lng: 73.0645,
      phone: "+92512821205",
      whatsapp: "+923005112001",
      type: "showroom",
      hours: "10:00 AM - 8:30 PM",
      mapUrl: "https://maps.google.com/?q=33.7121,73.0645",
      isActive: true,
    },
    {
      name: "ZENTARO Rawalpindi Saddar Showroom",
      city: "Rawalpindi",
      province: "Punjab",
      address: "Canning Road, Saddar, Rawalpindi",
      lat: 33.5951,
      lng: 73.0549,
      phone: "+92515511201",
      whatsapp: "+923005112002",
      type: "showroom",
      hours: "10:00 AM - 8:30 PM",
      mapUrl: "https://maps.google.com/?q=33.5951,73.0549",
      isActive: true,
    },
    // Multan
    {
      name: "ZENTARO Multan Cantt Showroom",
      city: "Multan",
      province: "Punjab",
      address: "Mall Road, Multan Cantt, Multan",
      lat: 30.1984,
      lng: 71.4382,
      phone: "+92614511201",
      whatsapp: "+923006112001",
      type: "showroom",
      hours: "10:00 AM - 8:30 PM",
      mapUrl: "https://maps.google.com/?q=30.1984,71.4382",
      isActive: true,
    },
    // Faisalabad
    {
      name: "ZENTARO Faisalabad Showroom & Service",
      city: "Faisalabad",
      province: "Punjab",
      address: "East Canal Road, near Susan Road, Faisalabad",
      lat: 31.4187,
      lng: 73.1189,
      phone: "+92418512001",
      whatsapp: "+923007112001",
      type: "showroom",
      hours: "10:00 AM - 9:00 PM",
      mapUrl: "https://maps.google.com/?q=31.4187,73.1189",
      isActive: true,
    },
    // Peshawar
    {
      name: "ZENTARO Peshawar Ring Road Center",
      city: "Peshawar",
      province: "Khyber Pakhtunkhwa",
      address: "Main Ring Road, near Hayatabad Phase 3, Peshawar",
      lat: 33.9984,
      lng: 71.4812,
      phone: "+92915812001",
      whatsapp: "+923009112001",
      type: "showroom",
      hours: "10:00 AM - 8:00 PM",
      mapUrl: "https://maps.google.com/?q=33.9984,71.4812",
      isActive: true,
    },
    // Hyderabad
    {
      name: "ZENTARO Hyderabad Showroom",
      city: "Hyderabad",
      province: "Sindh",
      address: "Auto Bhan Road, Latifabad Unit 3, Hyderabad",
      lat: 25.3712,
      lng: 68.3582,
      phone: "+92223812001",
      whatsapp: "+923002212001",
      type: "showroom",
      hours: "11:00 AM - 9:00 PM",
      mapUrl: "https://maps.google.com/?q=25.3712,68.3582",
      isActive: true,
    },
    // Gujranwala
    {
      name: "ZENTARO Gujranwala GT Road",
      city: "Gujranwala",
      province: "Punjab",
      address: "Main GT Road, opposite Model Town, Gujranwala",
      lat: 32.1872,
      lng: 74.1912,
      phone: "+92553812001",
      whatsapp: "+923003212001",
      type: "showroom",
      hours: "10:00 AM - 8:30 PM",
      mapUrl: "https://maps.google.com/?q=32.1872,74.1912",
      isActive: true,
    },
    // Karachi Central Hub
    {
      name: "ZENTARO Gulshan-e-Iqbal Hub",
      city: "Karachi",
      province: "Sindh",
      address: "Main University Road, Block 5, Gulshan-e-Iqbal, Karachi",
      lat: 24.9184,
      lng: 67.0982,
      phone: "+922134812001",
      whatsapp: "+923009212003",
      type: "showroom",
      hours: "10:00 AM - 9:00 PM",
      mapUrl: "https://maps.google.com/?q=24.9184,67.0982",
      isActive: true,
    }
  ]);

  // 8. INSERT REVIEWS
  console.log("⭐ Seeding Reviews...");
  await db.insert(reviews).values([
    {
      name: "Muhammad Ali, Karachi",
      rating: 5,
      quote: "Swapping from my 125cc petrol bike to the ZENTARO Thunder has slashed my monthly fuel bill from Rs 22,000 to just Rs 1,800. Best decision ever!",
      isApproved: true,
      modelId: thunder.id,
    },
    {
      name: "Dr. Ayesha Malik, Lahore",
      rating: 5,
      quote: "I use the Breeze scooter to commute to the hospital. It is quiet, fast, charges from standard outlets, and gets me past DHA traffic effortlessly.",
      isApproved: true,
      modelId: breeze.id,
    },
    {
      name: "Zeeshan Butt, Rawalpindi",
      rating: 4,
      quote: "Rugged shocks make the Alpha handle Pindi's potholes easily. The range is real—I get exactly 135 km on a full LFP charge.",
      isApproved: true,
      modelId: alpha.id,
    },
  ]);

  // 9. INSERT FAQS
  console.log("❓ Seeding FAQs...");
  await db.insert(faqs).values([
    {
      question: "Do I need a special charging station to charge a ZENTARO EV?",
      answer: "No, all ZENTARO vehicles are shipped with a portable smart charger that plugs directly into any standard three-pin 220V household wall outlet. It automatically cuts off power when full to prevent battery degradation.",
      category: "charging",
    },
    {
      question: "What is the difference between LFP, Graphene, and Lithium-Ion batteries?",
      answer: "LFP (Lithium Iron Phosphate) is our premium option: highly safe, doesn't catch fire, and lasts up to 8 years (2500+ charge cycles). Graphene batteries are highly affordable lead-acid updates that charge quickly but last up to 3 years (800 cycles).",
      category: "battery",
    },
    {
      question: "How do the easy monthly installment plans work?",
      answer: "We offer zero-markup installment structures directly through ZENTARO for up to 12 months with a 20% down payment. Additionally, we partner with major leasing banks for flexible plans spanning up to 36 months.",
      category: "financing",
    },
    {
      question: "Is there a warranty on the motor and battery?",
      answer: "Yes, our LFP models include a 3-Year comprehensive battery warranty and a 2-Year motor warranty. Graphene-based variants include an 18-month battery and 12-month motor warranty.",
      category: "general",
    },
  ]);

  // 10. INSERT BLOG POSTS
  console.log("📰 Seeding Blog posts...");
  await db.insert(blogPosts).values([
    {
      slug: "is-electric-bike-saving-money-pakistan",
      title: "Is Switching to an Electric Bike Worth It in Pakistan in 2026?",
      excerpt: "With petrol prices hovering around Rs 270+ per litre, we run down the exact numbers to see how fast a ZENTARO EV pays for itself.",
      body: `### The Petrol Squeeze
Pakistan has seen unprecedented volatility in fuel costs. For an average commuter riding 45 km a day on a standard 70cc petrol motorcycle, fuel bills easily cross **Rs 15,000 - 22,000 every month**. Add engine oil changes, spark plugs, filters, and tuning, and you are bleeding hard-earned money.

### The ZENTARO Formula
Let's look at the electrical equivalent. A ZENTARO electric bike uses a 72V 40Ah battery, which translates to a total capacity of **2.88 kWh**:
$$kWh = (72V \\times 40Ah) / 1000 = 2.88$$

At an average electricity utility tariff of **Rs 50 per unit (kWh)**, a single full charge costs:
$$2.88 \\text{ kWh} \\times \\text{Rs } 50 = \\text{Rs } 144$$

This single charge powers a 120 km commute. That is a charging cost of **Rs 1.2 per km** compared to **Rs 6+ per km** on petrol! 

### Total ROI Breakaway
Within 14 months of daily riding, the initial cost difference of buying an EV is completely recouped, leading to pure monthly savings.`,
      coverImage: "/images/blog/savings-calc.jpg",
      category: "Financing & Savings",
      author: "ZENTARO Tech Labs",
      status: "published",
      seoTitle: "Electric Bike Fuel Savings Pakistan 2026 Calculator",
      seoDescription: "Calculate fuel savings of electric bikes vs 70cc/125cc petrol motorcycles in Karachi, Lahore, and Islamabad.",
      publishedAt: new Date(),
    },
    {
      slug: "lfp-vs-graphene-which-battery-to-choose",
      title: "LFP vs Graphene Batteries: Which ZENTARO Variant is Best for You?",
      excerpt: "Unpacking the chemistry, cycle life, thermal safety, and pricing of LFP vs Graphene batteries to help you choose the right fit.",
      body: `Choosing the right battery chemistry is the most important decision when purchasing your electric two-wheeler.

### 1. Lithium Iron Phosphate (LFP) - The Gold Standard
LFP batteries represent the absolute pinnacle of vehicle safety. Unlike traditional Lithium-Ion (NMC) batteries found in smartphones, LFP batteries do not undergo thermal runaway. 

- **Life Expectancy:** 8+ Years (3,000+ charge cycles)
- **Safety:** High thermal stability (cannot catch fire)
- **Warranty:** 3 Years

### 2. Graphene Batteries - The Budget Commuter
Graphene batteries are advanced lead-acid structures reinforced with graphene sheets, boosting energy density and charging speeds.

- **Life Expectancy:** 3 Years (800 cycles)
- **Cost:** ~Rs 100,000 cheaper than LFP
- **Warranty:** 12 to 18 Months

### The Verdict
If you ride long distances daily and want zero hassle for a decade, **LFP is the clear winner**. If you are looking for a low upfront entry cost for short neighborhood runs, **Graphene is highly cost-effective** value.`,
      coverImage: "/images/blog/battery-tech.jpg",
      category: "Tech & Battery",
      author: "Product Engineering Team",
      status: "published",
      seoTitle: "LFP vs Graphene Battery Lifespan & Pricing Pakistan",
      seoDescription: "Compare Lithium LFP batteries vs Graphene batteries for EV scooters and bikes in Pakistan's weather conditions.",
      publishedAt: new Date(),
    }
  ]);

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
