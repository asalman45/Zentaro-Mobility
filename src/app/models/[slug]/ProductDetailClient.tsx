"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Zap,
  Battery,
  BatteryCharging,
  Shield,
  Gauge,
  HelpCircle,
  Phone,
  ArrowRight,
  ChevronRight,
  Info,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, CountUp, MagneticButton, Reveal } from "@/components/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { trackEvent } from "@/lib/analytics";

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

export default function ProductDetailClient({ model }: { model: ModelData }) {
  const { t, locale } = useLanguage();
  
  // Selected configuration states
  const [selectedColor, setSelectedColor] = useState<ColorOption>(model.colors[0]);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(model.variants[0]);
  
  // 360 Degree Drag Spinner state
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const frameCount = 8; // Simulate 8 rotation frames

  // Hotspot details
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const hotspots = [
    {
      id: 1,
      x: "25%",
      y: "75%",
      title: "Brushless Hub Motor",
      desc: `${selectedVariant.motorWatts}W high-torque motor delivering instant throttle without belts or drive chain adjustments.`,
    },
    {
      id: 2,
      x: "50%",
      y: "65%",
      title: `${selectedVariant.batteryType} Battery Core`,
      desc: `${selectedVariant.voltage}V ${selectedVariant.ampHours}Ah chemistry. Sealed, waterproof cell array certified IP67.`,
    },
    {
      id: 3,
      x: "15%",
      y: "35%",
      title: "NFC Smart Dashboard",
      desc: "Connects with the ZENTARO mobile app. Keyless Bluetooth unlock and live geo-tracking.",
    },
  ];

  // Drag-to-spin handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX.current;
    
    // Sensitivity: rotate frame every 15 pixels dragged
    if (Math.abs(deltaX) > 15) {
      const dir = deltaX > 0 ? 1 : -1;
      setFrameIndex((prev) => (prev + dir + frameCount) % frameCount);
      dragStartX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Pre-filled WhatsApp template message for conversion
  const waMessage = `Hi ZENTARO, I'm interested in booking a test ride for ${model.name}.
Configured Color: ${selectedColor.name}
Configured Variant: ${selectedVariant.name} (Rs ${selectedVariant.price.toLocaleString()})`;

  // Calculate starting installment estimate based on flat-markup (20% DP, 12 Months, 0% Markup)
  const downPayment = selectedVariant.price * 0.2;
  const principal = selectedVariant.price - downPayment;
  const monthlyInstallment = Math.round(principal / 12);

  return (
    <div className="flex flex-col min-h-screen" onMouseUp={handleMouseUp}>
      <Header />

      <main className="flex-grow pb-24">
        {/* Sticky Buy Bar for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#121214]/95 border-t border-border p-4 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
          <div>
            <span className="text-[10px] font-bold text-muted block uppercase">{model.name}</span>
            <span className="text-sm font-black text-volt">
              Rs {selectedVariant.price.toLocaleString()}
            </span>
          </div>
          <Link
            href={`/reserve/${model.slug}?variant=${selectedVariant.id}&color=${encodeURIComponent(
              selectedColor.name
            )}`}
            className="px-6 py-2.5 rounded-lg bg-volt text-background text-xs font-bold uppercase tracking-wide shadow-[0_0_12px_rgba(191,255,0,0.3)]"
          >
            Reserve
          </Link>
        </div>

        {/* BREADCRUMB */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-muted">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/models" className="hover:text-white">Models</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{model.name}</span>
          </nav>
        </div>

        {/* HERO CONFIGURATOR SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 items-start">
          {/* Interactive Rotator Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative w-full h-[350px] sm:h-[450px] bg-gradient-to-b from-[#1a1a1f] to-transparent rounded-2xl border border-border flex items-center justify-center select-none cursor-ew-resize overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
            >
              {/* Instructions */}
              <div className="absolute top-4 left-4 text-[10px] text-muted font-bold tracking-widest uppercase flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-volt" />
                <span>Drag horizontally to rotate 360°</span>
              </div>

              {/* Glowing ring under bike */}
              <div className="absolute bottom-10 w-[70%] h-6 bg-[#BFFF00]/10 blur-xl rounded-full transform -skew-x-12" />

              {/* Bike Render Placeholder based on colors/frames */}
              <div className="text-center space-y-3 z-10 transition-transform duration-300">
                <Zap className="w-20 h-20 text-volt mx-auto animate-pulse" />
                <span className="text-sm font-bold text-white tracking-widest uppercase block">
                  {selectedColor.name} Frame {frameIndex + 1}
                </span>
                <span className="text-xs text-muted block">
                  [{selectedVariant.batteryType} Battery Core]
                </span>
              </div>

              {/* Dynamic Hotspots */}
              {hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className="absolute"
                  style={{ left: spot.x, top: spot.y }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-xs shadow-lg transition-all ${
                      activeHotspot === spot.id
                        ? "bg-volt border-volt text-background scale-110"
                        : "bg-black/80 border-[#BFFF00] text-[#BFFF00]"
                    }`}
                  >
                    +
                  </button>
                  
                  {activeHotspot === spot.id && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 bg-[#121214] border border-border p-3 rounded-lg shadow-2xl z-20 text-xs font-sans text-left space-y-1">
                      <h5 className="font-bold text-volt">{spot.title}</h5>
                      <p className="text-muted leading-tight">{spot.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Configured Details Snippet */}
            <div className="p-4 bg-card border border-border rounded-xl flex justify-between items-center text-xs">
              <span className="text-muted font-semibold">Active Variant Specs:</span>
              <span className="text-white font-bold uppercase">{selectedVariant.batteryType} Cell | {selectedVariant.brakes}</span>
            </div>
          </div>

          {/* Configurator Selection Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <Reveal>
                <h1 className="font-display text-4xl sm:text-5xl font-black text-white leading-none">
                  {model.name}
                </h1>
              </Reveal>
              <p className="text-volt text-sm font-semibold tracking-wider uppercase mt-2">
                {model.tagline}
              </p>
              <p className="text-muted text-sm leading-relaxed mt-4">
                {model.description}
              </p>
            </div>

            {/* COLOR SWATCHES */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                Paint Selection: {selectedColor.name}
              </label>
              <div className="flex items-center space-x-3">
                {model.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      trackEvent({ name: "calculator_used", properties: { calculator_type: "savings", model_slug: model.slug, details: { color: color.name } } });
                    }}
                    className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${
                      selectedColor.name === color.name ? "border-volt scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select color ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* VARIANT SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted uppercase tracking-wider block">
                Select Configuration Variant
              </label>
              <div className="space-y-3">
                {model.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      trackEvent({ name: "calculator_used", properties: { calculator_type: "financing", model_slug: model.slug, details: { variant: v.name } } });
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                      selectedVariant.id === v.id
                        ? "bg-volt/5 border-volt"
                        : "bg-card border-border hover:border-white/20"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-white block">{v.name}</span>
                      <span className="text-[10px] text-muted block uppercase tracking-wider mt-0.5">
                        {v.batteryType} Battery • {v.rangeKm}km Range
                      </span>
                    </div>
                    <div className="text-right">
                      {v.originalPrice && (
                        <span className="text-xs text-muted/65 line-through block">
                          Rs {v.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="font-black text-white block">
                        Rs {v.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* FINANCING SNIPPET */}
            <div className="p-5 bg-card border border-border rounded-xl space-y-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">Estimated Installments</span>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-2xl font-black text-white">Rs {monthlyInstallment.toLocaleString()}</span>
                  <span className="text-xs text-muted"> / month</span>
                </div>
                <Link
                  href={`/financing?model=${model.slug}&variant=${selectedVariant.id}`}
                  className="text-xs font-bold text-volt hover:underline flex items-center"
                >
                  Configure Installments
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
              <span className="text-[10px] text-muted/70 leading-none block">
                Calculated on 20% down payment (Rs {downPayment.toLocaleString()}) for 12 months.
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href={`/reserve/${model.slug}?variant=${selectedVariant.id}&color=${encodeURIComponent(
                  selectedColor.name
                )}`}
                className="flex-1 text-center py-3.5 rounded-xl bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_20px_rgba(191,255,0,0.35)] transition-all uppercase"
              >
                Reserve Now
              </Link>
              
              <Link
                href="/book-test-ride"
                className="flex-1 text-center py-3.5 rounded-xl border border-border text-foreground hover:border-volt hover:text-volt bg-white/5 text-sm font-bold tracking-tight transition-all duration-200"
              >
                Book Test Ride
              </Link>
            </div>
          </div>
        </section>

        {/* HERO SPEC CARDS with custom dynamic layout */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Spec 1: Speed */}
            <div className="p-6 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-volt/30 transition-all duration-300">
              <Gauge className="w-8 h-8 text-volt/30 group-hover:text-volt transition-colors mx-auto mb-3" />
              {/* Force reset animation using variant name key */}
              <CountUp
                key={selectedVariant.name}
                to={selectedVariant.topSpeedKmh}
                suffix=" km/h"
                className="block font-display text-3xl sm:text-4xl font-extrabold text-white"
              />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5 block">Top Speed</span>
            </div>

            {/* Spec 2: Range */}
            <div className="p-6 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-volt/30 transition-all duration-300">
              <Zap className="w-8 h-8 text-volt/30 group-hover:text-volt transition-colors mx-auto mb-3" />
              <CountUp
                key={selectedVariant.name}
                to={selectedVariant.rangeKm}
                suffix=" km"
                className="block font-display text-3xl sm:text-4xl font-extrabold text-white"
              />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5 block">Estimated Range</span>
            </div>

            {/* Spec 3: Charging time */}
            <div className="p-6 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-volt/30 transition-all duration-300">
              <BatteryCharging className="w-8 h-8 text-volt/30 group-hover:text-volt transition-colors mx-auto mb-3" />
              <CountUp
                key={selectedVariant.name}
                to={selectedVariant.chargingTimeHrs}
                decimals={1}
                suffix=" hrs"
                className="block font-display text-3xl sm:text-4xl font-extrabold text-white"
              />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5 block">Full Charge Time</span>
            </div>

            {/* Spec 4: Battery Life */}
            <div className="p-6 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-volt/30 transition-all duration-300">
              <Battery className="w-8 h-8 text-volt/30 group-hover:text-volt transition-colors mx-auto mb-3" />
              <CountUp
                key={selectedVariant.name}
                to={selectedVariant.batteryLifeYears}
                decimals={1}
                suffix=" yrs"
                className="block font-display text-3xl sm:text-4xl font-extrabold text-white"
              />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5 block">Est. Battery Life</span>
            </div>
          </div>
        </section>

        {/* FULL SPECIFICATION DETAIL MATRIX */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <h3 className="font-display text-2xl font-bold text-white mb-6 border-b border-border pb-3 uppercase tracking-tight">
            Detailed Technical Specifications
          </h3>
          <div className="border border-border rounded-2xl overflow-hidden bg-card text-xs">
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Motor Hub Power Rating</span>
              <span className="text-white font-semibold">{selectedVariant.motorWatts} Watts Brushless Hub</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Battery Pack Output</span>
              <span className="text-white font-semibold">{selectedVariant.voltage}V {selectedVariant.ampHours}Ah ({selectedVariant.batteryType})</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Supported Charge Cycles</span>
              <span className="text-white font-semibold">{selectedVariant.chargeCycles} Full Cycles</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Warranty Period</span>
              <span className="text-white font-semibold">{selectedVariant.warrantyMonths} Months Manufacturer Cover</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Net Curb Weight</span>
              <span className="text-white font-semibold">{selectedVariant.weightKg} kg</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Max Carrying Capacity</span>
              <span className="text-white font-semibold">{selectedVariant.loadKg} kg</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Braking Framework</span>
              <span className="text-white font-semibold">{selectedVariant.brakes}</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Suspension Linkage</span>
              <span className="text-white font-semibold">{selectedVariant.suspension}</span>
            </div>
            <div className="grid grid-cols-2 p-4 border-b border-border">
              <span className="text-muted font-bold">Tyre Dimensions</span>
              <span className="text-white font-semibold">{selectedVariant.tyres}</span>
            </div>
            <div className="grid grid-cols-2 p-4">
              <span className="text-muted font-bold">IP Protection Rating</span>
              <span className="text-white font-semibold">{selectedVariant.ipRating} Dust & Water Resistant</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloating message={waMessage} />
    </div>
  );
}
