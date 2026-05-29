"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown, Plus, X, ArrowRight, Zap, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { trackEvent } from "@/lib/analytics";

interface VehicleModel {
  slug: string;
  name: string;
  type: "motorcycle" | "scooter" | "three_wheeler";
  tagline: string;
  basePrice: number;
  originalPrice?: number;
  speed: number;
  range: number;
  charge: number;
  battery: "LFP" | "Lithium" | "Graphene";
  colors: { name: string; hex: string }[];
}

const mockModels: VehicleModel[] = [
  {
    slug: "zentaro-thunder",
    name: "ZENTARO Thunder",
    type: "motorcycle",
    tagline: "Unleash the Storm",
    basePrice: 549000,
    originalPrice: 599000,
    speed: 105,
    range: 220,
    charge: 3.5,
    battery: "LFP",
    colors: [
      { name: "Electric Lime", hex: "#BFFF00" },
      { name: "Carbon Stealth", hex: "#1A1A1A" },
      { name: "Polar Ice Blue", hex: "#00E5FF" },
    ],
  },
  {
    slug: "zentaro-alpha",
    name: "ZENTARO Alpha",
    type: "motorcycle",
    tagline: "The City Commute, Redefined",
    basePrice: 429000,
    originalPrice: 459000,
    speed: 85,
    range: 140,
    charge: 4.0,
    battery: "LFP",
    colors: [
      { name: "Stealth Grey", hex: "#4A4A4F" },
      { name: "Crimson Spark", hex: "#DC2626" },
    ],
  },
  {
    slug: "zentaro-breeze",
    name: "ZENTARO Breeze",
    type: "scooter",
    tagline: "Glide Through Traffic",
    basePrice: 329000,
    originalPrice: 349000,
    speed: 70,
    range: 110,
    charge: 3.0,
    battery: "LFP",
    colors: [
      { name: "Polar Pearl", hex: "#FFFFFF" },
      { name: "Midnight Onyx", hex: "#0D0D0D" },
      { name: "Blossom Pink", hex: "#F472B6" },
    ],
  },
  {
    slug: "zentaro-bolt",
    name: "ZENTARO Bolt",
    type: "motorcycle",
    tagline: "Instant Utility",
    basePrice: 289000,
    speed: 65,
    range: 80,
    charge: 6.0,
    battery: "Graphene",
    colors: [
      { name: "Utility Red", hex: "#B91C1C" },
      { name: "Utility Black", hex: "#111827" },
    ],
  },
  {
    slug: "zentaro-storm",
    name: "ZENTARO Storm",
    type: "motorcycle",
    tagline: "Extreme Naked Performance",
    basePrice: 799000,
    speed: 125,
    range: 160,
    charge: 4.5,
    battery: "LFP",
    colors: [{ name: "Storm Matte Blue", hex: "#1D4ED8" }],
  },
  {
    slug: "zentaro-glide",
    name: "ZENTARO Glide",
    type: "scooter",
    tagline: "Smooth Cruising",
    basePrice: 469000,
    speed: 80,
    range: 130,
    charge: 4.0,
    battery: "LFP",
    colors: [
      { name: "Lux Metallic Bronze", hex: "#78350F" },
      { name: "Lux Silver Pearl", hex: "#E5E7EB" },
    ],
  },
];

export default function ModelsPage() {
  const { t } = useLanguage();
  
  // Filter states
  const [filterType, setFilterType] = useState<string>("all");
  const [filterBattery, setFilterBattery] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(850000);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Comparison tray state (localStorage backed)
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("zentaro-compare");
    if (saved) {
      try {
        setComparedSlugs(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const saveComparison = (slugs: string[]) => {
    setComparedSlugs(slugs);
    localStorage.setItem("zentaro-compare", JSON.stringify(slugs));
  };

  const handleToggleCompare = (slug: string) => {
    if (comparedSlugs.includes(slug)) {
      saveComparison(comparedSlugs.filter((s) => s !== slug));
    } else {
      if (comparedSlugs.length >= 3) {
        alert("You can compare up to 3 vehicles maximum.");
        return;
      }
      const newSlugs = [...comparedSlugs, slug];
      saveComparison(newSlugs);
      const bike = mockModels.find((m) => m.slug === slug);
      trackEvent({
        name: "comparison_added",
        properties: { model_name: bike?.name || slug, count: newSlugs.length },
      });
    }
  };

  // Filtered & sorted models list
  const filteredModels = mockModels
    .filter((model) => {
      const typeMatch = filterType === "all" || model.type === filterType;
      const batteryMatch = filterBattery === "all" || model.battery === filterBattery;
      const priceMatch = model.basePrice <= maxPrice;
      return typeMatch && batteryMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.basePrice - b.basePrice;
      if (sortBy === "price_desc") return b.basePrice - a.basePrice;
      if (sortBy === "range") return b.range - a.range;
      if (sortBy === "speed") return b.speed - a.speed;
      return 0; // Default Featured (as defined in array)
    });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center md:text-left mb-10">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
              EXPLORE THE LINEUP
            </h1>
            <p className="text-muted text-sm font-medium mt-2">
              Bilingual specs filters. Sync comparisons directly to proceed with reservation checkout.
            </p>
          </FadeIn>

          {/* Filter & Sort Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 glass-panel border border-border p-6 rounded-2xl space-y-6">
              <div className="flex items-center space-x-2 border-b border-border pb-3">
                <SlidersHorizontal className="w-4 h-4 text-volt" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Filters</span>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider block">Vehicle Type</label>
                <div className="grid grid-cols-3 gap-1 bg-[#0A0A0B] p-1 rounded-lg">
                  {["all", "motorcycle", "scooter"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`py-1.5 text-[10px] font-bold rounded capitalize transition-all ${
                        filterType === type ? "bg-volt text-background" : "text-muted hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Battery Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider block">Battery Chemistry</label>
                <div className="grid grid-cols-3 gap-1 bg-[#0A0A0B] p-1 rounded-lg">
                  {["all", "LFP", "Graphene"].map((bat) => (
                    <button
                      key={bat}
                      onClick={() => setFilterBattery(bat)}
                      className={`py-1.5 text-[10px] font-bold rounded transition-all ${
                        filterBattery === bat ? "bg-volt text-background" : "text-muted hover:text-white"
                      }`}
                    >
                      {bat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                  <span>Max Price</span>
                  <span className="text-white">Rs {(maxPrice / 1000).toFixed(0)}k</span>
                </div>
                <input
                  type="range"
                  min="250000"
                  max="850000"
                  step="10000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-volt bg-border h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted font-bold">
                  <span>Rs 250k</span>
                  <span>Rs 850k</span>
                </div>
              </div>
            </div>

            {/* Models Showcase Lists */}
            <div className="lg:col-span-3 space-y-6">
              {/* Sort Bar */}
              <div className="flex items-center justify-between bg-card border border-border px-6 py-3 rounded-2xl text-xs">
                <span className="font-semibold text-muted">
                  Showing {filteredModels.length} models
                </span>
                
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-volt" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white border-none outline-none focus:ring-0 cursor-pointer font-semibold"
                  >
                    <option value="featured" className="bg-[#121214] text-white">Featured</option>
                    <option value="price_asc" className="bg-[#121214] text-white">Price: Low to High</option>
                    <option value="price_desc" className="bg-[#121214] text-white">Price: High to Low</option>
                    <option value="range" className="bg-[#121214] text-white">Maximum Range</option>
                    <option value="speed" className="bg-[#121214] text-white">Maximum Speed</option>
                  </select>
                </div>
              </div>

              {/* Bikes Grid */}
              <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredModels.map((model) => {
                  const isCompared = comparedSlugs.includes(model.slug);
                  return (
                    <StaggerItem key={model.slug}>
                      <div className="group relative flex flex-col justify-between h-full bg-[#121214] border border-border hover:border-volt/35 rounded-2xl p-6 transition-all duration-300 shadow-lg">
                        <div>
                          {/* Header tags */}
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-muted group-hover:text-volt uppercase transition-colors">
                              {model.type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-border font-bold text-white">
                              {model.battery} Battery
                            </span>
                          </div>

                          {/* Image Box */}
                          <div className="relative w-full h-40 my-6 bg-gradient-to-b from-[#1a1a1f] to-transparent rounded-xl flex items-center justify-center overflow-hidden">
                            <Zap className="w-10 h-10 text-volt/15 group-hover:text-volt group-hover:scale-110 transition-all duration-500" />
                            <span className="absolute bottom-2 text-[9px] font-bold text-muted uppercase tracking-widest">
                              {model.name} Render
                            </span>
                          </div>

                          <h3 className="font-display text-xl font-bold text-white group-hover:text-volt transition-all">
                            {model.name}
                          </h3>
                          <p className="text-xs text-muted/80 mt-1 italic">{model.tagline}</p>

                          {/* Key specifications snippet */}
                          <div className="grid grid-cols-3 gap-2 border-t border-border/60 py-3 mt-4 text-center text-xs">
                            <div>
                              <span className="text-[9px] text-muted uppercase block">Top Speed</span>
                              <span className="font-semibold text-white mt-0.5 block">{model.speed} km/h</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-muted uppercase block">Range</span>
                              <span className="font-semibold text-white mt-0.5 block">{model.range} km</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-muted uppercase block">Charge</span>
                              <span className="font-semibold text-white mt-0.5 block">{model.charge} hrs</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
                          <div>
                            {model.originalPrice && (
                              <span className="text-[10px] text-muted line-through block">
                                Rs {model.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-base font-black text-white">
                              Rs {model.basePrice.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Compare Checkbox Toggle */}
                            <button
                              onClick={() => handleToggleCompare(model.slug)}
                              className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${
                                isCompared
                                  ? "bg-volt border-volt text-background"
                                  : "border-border text-muted hover:border-volt hover:text-volt bg-transparent"
                              }`}
                              aria-label="Add to comparison"
                            >
                              {isCompared ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>

                            {/* View Detail Link */}
                            <Link
                              href={`/models/${model.slug}`}
                              className="px-4 py-2 rounded-lg bg-white/5 border border-border text-xs font-bold text-white hover:border-volt hover:bg-volt hover:text-background transition-all flex items-center"
                            >
                              Details
                              <ArrowRight className="w-3 h-3 ml-1.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          </div>
        </div>
      </main>

      {/* PERSISTENT FLOATING BOTTOM COMPARISON TRAY */}
      {comparedSlugs.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#121214]/90 backdrop-blur-md border-t border-border shadow-[0_-10px_30px_rgba(0,0,0,0.5)] py-4 animate-slide-up">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Compare Tray ({comparedSlugs.length}/3)
              </span>
              
              <div className="flex items-center space-x-2">
                {comparedSlugs.map((slug) => {
                  const bike = mockModels.find((m) => m.slug === slug);
                  return (
                    <div
                      key={slug}
                      className="px-3 py-1.5 bg-[#0A0A0B] border border-border rounded-lg flex items-center space-x-2 text-[10px] font-bold text-white"
                    >
                      <span>{bike?.name}</span>
                      <button
                        onClick={() => handleToggleCompare(slug)}
                        className="text-muted hover:text-red-400 outline-none"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => saveComparison([])}
                className="px-4 py-2 rounded-lg text-xs font-bold text-muted hover:text-white bg-transparent"
              >
                Clear
              </button>
              
              <Link
                href="/compare"
                className="w-full sm:w-auto text-center px-5 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all flex items-center justify-center"
              >
                Compare Now
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
