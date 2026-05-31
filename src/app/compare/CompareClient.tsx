"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ShieldCheck, Zap, BatteryCharging, DollarSign, CalendarCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface VehicleModel {
  slug: string;
  name: string;
  type: string;
  tagline: string;
  basePrice: number;
  speed: number;
  range: number;
  charge: number;
  battery: string;
  warranty: number; // months
  motor: number; // watts
  colors: string[];
}

interface CompareClientProps {
  initialModels: VehicleModel[];
}

export default function CompareClient({ initialModels }: CompareClientProps) {
  const { t } = useLanguage();
  const [comparedBikes, setComparedBikes] = useState<VehicleModel[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("zentaro-compare");
    if (saved) {
      try {
        const slugs: string[] = JSON.parse(saved);
        const bikes = slugs
          .map((slug) => initialModels.find((m) => m.slug === slug))
          .filter((b): b is VehicleModel => !!b);
        setComparedBikes(bikes);
      } catch (err) {
        console.error(err);
      }
    }
  }, [initialModels]);

  const handleRemoveBike = (slug: string) => {
    const updated = comparedBikes.filter((b) => b.slug !== slug);
    setComparedBikes(updated);
    localStorage.setItem("zentaro-compare", JSON.stringify(updated.map((b) => b.slug)));
  };

  // Helper functions to identify best specs in compared set
  const getBestValue = (field: keyof VehicleModel, criteria: "min" | "max") => {
    if (comparedBikes.length === 0) return null;
    const values = comparedBikes.map((b) => b[field] as number);
    return criteria === "min" ? Math.min(...values) : Math.max(...values);
  };

  const bestPrice = getBestValue("basePrice", "min");
  const bestSpeed = getBestValue("speed", "max");
  const bestRange = getBestValue("range", "max");
  const bestCharge = getBestValue("charge", "min");
  const bestWarranty = getBestValue("warranty", "max");
  const bestMotor = getBestValue("motor", "max");

  if (comparedBikes.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20 pb-20">
          <div className="text-center max-w-md p-8 glass-panel border border-border rounded-2xl space-y-6">
            <Trash2 className="w-12 h-12 text-muted mx-auto" />
            <h1 className="font-display text-2xl font-bold text-white">Compare is Empty</h1>
            <p className="text-sm text-muted">
              Select at least 2 models from our lineup to run side-by-side spec comparison analysis.
            </p>
            <Link
              href="/models"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Link
              href="/models"
              className="p-2 rounded-lg border border-border text-muted hover:border-volt hover:text-volt transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
              VEHICLE SPECIFICATION COMPARISON
            </h1>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full border-collapse text-left text-sm text-muted">
                <thead>
                  <tr className="border-b border-border bg-[#0E0E10]">
                    <th className="p-6 w-1/4 font-bold text-white uppercase tracking-wider text-xs">Features</th>
                    {comparedBikes.map((bike) => (
                      <th key={bike.slug} className="p-6 w-1/4 relative border-l border-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-volt font-bold uppercase tracking-wider block">
                              {bike.type}
                            </span>
                            <span className="font-display text-lg font-bold text-white block mt-0.5">
                              {bike.name}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveBike(bike.slug)}
                            className="text-muted hover:text-red-400 p-1 bg-white/5 hover:bg-white/10 rounded outline-none"
                            aria-label="Remove model"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* PRICE ROW */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-volt" />
                      <span>Base Price</span>
                    </td>
                    {comparedBikes.map((bike) => {
                      const isBest = bike.basePrice === bestPrice;
                      return (
                        <td
                          key={bike.slug}
                          className={`p-6 border-l border-border font-bold ${
                            isBest ? "text-volt bg-volt/5" : "text-white"
                          }`}
                        >
                          Rs {bike.basePrice.toLocaleString()}
                          {isBest && <span className="text-[9px] font-bold uppercase tracking-wider text-volt block mt-1">Best Price</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* TOP SPEED ROW */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-volt" />
                      <span>Top Speed</span>
                    </td>
                    {comparedBikes.map((bike) => {
                      const isBest = bike.speed === bestSpeed;
                      return (
                        <td
                          key={bike.slug}
                          className={`p-6 border-l border-border font-semibold ${
                            isBest ? "text-volt bg-volt/5" : "text-white"
                          }`}
                        >
                          {bike.speed} km/h
                          {isBest && <span className="text-[9px] font-bold uppercase tracking-wider text-volt block mt-1">Fastest</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* RANGE ROW */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <BatteryCharging className="w-4 h-4 text-volt" />
                      <span>Est. Range</span>
                    </td>
                    {comparedBikes.map((bike) => {
                      const isBest = bike.range === bestRange;
                      return (
                        <td
                          key={bike.slug}
                          className={`p-6 border-l border-border font-semibold ${
                            isBest ? "text-volt bg-volt/5" : "text-white"
                          }`}
                        >
                          {bike.range} km
                          {isBest && <span className="text-[9px] font-bold uppercase tracking-wider text-volt block mt-1">Longest Range</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* CHARGE TIME ROW */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <CalendarCheck className="w-4 h-4 text-volt" />
                      <span>Charging Speed</span>
                    </td>
                    {comparedBikes.map((bike) => {
                      const isBest = bike.charge === bestCharge;
                      return (
                        <td
                          key={bike.slug}
                          className={`p-6 border-l border-border font-semibold ${
                            isBest ? "text-volt bg-volt/5" : "text-white"
                          }`}
                        >
                          {bike.charge} hours
                          {isBest && <span className="text-[9px] font-bold uppercase tracking-wider text-volt block mt-1">Fastest Charge</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* MOTOR POWER ROW */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-volt" />
                      <span>Motor Power</span>
                    </td>
                    {comparedBikes.map((bike) => {
                      const isBest = bike.motor === bestMotor;
                      return (
                        <td
                          key={bike.slug}
                          className={`p-6 border-l border-border font-semibold ${
                            isBest ? "text-volt bg-volt/5" : "text-white"
                          }`}
                        >
                          {bike.motor} Watts
                          {isBest && <span className="text-[9px] font-bold uppercase tracking-wider text-volt block mt-1">Most Powerful</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* BATTERY CHEMISTRY */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-volt" />
                      <span>Battery Life</span>
                    </td>
                    {comparedBikes.map((bike) => (
                      <td key={bike.slug} className="p-6 border-l border-border text-white font-medium">
                        {bike.battery}
                      </td>
                    ))}
                  </tr>

                  {/* WARRANTY ROW */}
                  <tr>
                    <td className="p-6 font-semibold text-white flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-volt" />
                      <span>Warranty Duration</span>
                    </td>
                    {comparedBikes.map((bike) => {
                      const isBest = bike.warranty === bestWarranty;
                      return (
                        <td
                          key={bike.slug}
                          className={`p-6 border-l border-border font-semibold ${
                            isBest ? "text-volt bg-volt/5" : "text-white"
                          }`}
                        >
                          {bike.warranty} Months
                          {isBest && <span className="text-[9px] font-bold uppercase tracking-wider text-volt block mt-1">Longest Warranty</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* COLOR PREVIEWS */}
                  <tr>
                    <td className="p-6 font-semibold text-white">Colors Available</td>
                    {comparedBikes.map((bike) => (
                      <td key={bike.slug} className="p-6 border-l border-border">
                        <div className="flex flex-wrap gap-1.5">
                          {bike.colors.map((color, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded bg-[#0A0A0B] border border-border text-[10px] text-muted font-bold block"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* CHECKOUT ROW */}
                  <tr className="bg-[#0E0E10]">
                    <td className="p-6" />
                    {comparedBikes.map((bike) => (
                      <td key={bike.slug} className="p-6 border-l border-border">
                        <Link
                          href={`/reserve/${bike.slug}`}
                          className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all text-center"
                        >
                          Reserve {bike.name}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
