import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface ColorOption {
  name: string;
  hex: string;
  image: string;
}

interface Variant {
  id: number;
  name: string;
  batteryType: string;
  price: number;
  originalPrice?: number;
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

interface ModelData {
  slug: string;
  name: string;
  tagline: string;
  type: string;
  description: string;
  basePrice: number;
  colors: ColorOption[];
  variants: Variant[];
  images: string[];
}

// In-file lookup matching DB seeds for SSR & instant load
const staticModels: Record<string, ModelData> = {
  "zentaro-thunder": {
    slug: "zentaro-thunder",
    name: "ZENTARO Thunder",
    tagline: "Unleash the Storm",
    type: "motorcycle",
    description: "Our premium high-speed sports electric motorcycle. Engineered for adrenaline, highway range, and a commanding street presence. Drives dual Lithium Iron Phosphate cell banks.",
    basePrice: 549000,
    colors: [
      { name: "Electric Lime", hex: "#BFFF00", image: "/images/models/thunder-lime.png" },
      { name: "Carbon Stealth", hex: "#1A1A1A", image: "/images/models/thunder-stealth.png" },
      { name: "Polar Ice Blue", hex: "#00E5FF", image: "/images/models/thunder-ice.png" },
    ],
    variants: [
      {
        id: 1,
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
        id: 2,
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
      },
    ],
    images: ["/images/models/thunder-side.png"],
  },
  "zentaro-alpha": {
    slug: "zentaro-alpha",
    name: "ZENTARO Alpha",
    tagline: "The City Commute, Redefined",
    type: "motorcycle",
    description: "A sporty standard motorcycle engineered for daily commuters in Pakistan. Offering a balance of affordability, rugged suspension, and superior LFP range.",
    basePrice: 429000,
    colors: [
      { name: "Stealth Grey", hex: "#4A4A4F", image: "/images/models/alpha-grey.png" },
      { name: "Crimson Spark", hex: "#DC2626", image: "/images/models/alpha-red.png" },
    ],
    variants: [
      {
        id: 3,
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
        id: 4,
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
      },
    ],
    images: ["/images/models/alpha-side.png"],
  },
  "zentaro-breeze": {
    slug: "zentaro-breeze",
    name: "ZENTARO Breeze",
    tagline: "Glide Through Traffic",
    type: "scooter",
    description: "A lightweight, stylish step-through electric scooter designed for students and working professionals in Pakistan. Unisex geometry and low seat height.",
    basePrice: 329000,
    colors: [
      { name: "Polar Pearl", hex: "#FFFFFF", image: "/images/models/breeze-white.png" },
      { name: "Midnight Onyx", hex: "#0D0D0D", image: "/images/models/breeze-black.png" },
      { name: "Blossom Pink", hex: "#F472B6", image: "/images/models/breeze-pink.png" },
    ],
    variants: [
      {
        id: 5,
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
        id: 6,
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
      },
    ],
    images: ["/images/models/breeze-side.png"],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const model = staticModels[slug];

  if (!model) {
    notFound();
  }

  return <ProductDetailClient model={model} />;
}
