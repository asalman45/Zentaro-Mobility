"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calculator, ArrowRight, TrendingUp, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, CountUp } from "@/components/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { trackEvent } from "@/lib/analytics";

interface ModelPreset {
  name: string;
  voltage: number;
  ampHours: number;
  rangeKm: number;
  price: number;
  slug: string;
}

const modelPresets: ModelPreset[] = [
  { name: "ZENTARO Thunder Pro", voltage: 72, ampHours: 80, rangeKm: 220, price: 679000, slug: "zentaro-thunder" },
  { name: "ZENTARO Thunder Standard", voltage: 72, ampHours: 40, rangeKm: 120, price: 549000, slug: "zentaro-thunder" },
  { name: "ZENTARO Alpha LFP", voltage: 72, ampHours: 42, rangeKm: 140, price: 429000, slug: "zentaro-alpha" },
  { name: "ZENTARO Breeze Pro", voltage: 60, ampHours: 35, rangeKm: 110, price: 329000, slug: "zentaro-breeze" },
];

const petrolPresets = [
  { name: "70cc Petrol Bike", consumptionKmPerLitre: 45, maintenancePerKm: 2.0 },
  { name: "100cc Petrol Bike", consumptionKmPerLitre: 40, maintenancePerKm: 2.5 },
  { name: "125cc Petrol Bike", consumptionKmPerLitre: 35, maintenancePerKm: 3.0 },
];

export default function SavingsCalculatorPage() {
  const { t } = useLanguage();

  // User input states
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(modelPresets[0]);
  const [selectedPetrolBike, setSelectedPetrolBike] = useState(petrolPresets[0]);
  const [dailyKm, setDailyKm] = useState<number>(50);
  const [petrolPrice, setPetrolPrice] = useState<number>(272.5);
  const [electricityRate, setElectricityRate] = useState<number>(50.0);

  // Computed results
  const [monthlyPetrolCost, setMonthlyPetrolCost] = useState(0);
  const [monthlyElectricCost, setMonthlyElectricCost] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  const [cheaperPercentage, setCheaperPercentage] = useState(0);

  // Cumulative graph data
  const [chartData, setChartData] = useState<{ name: string; savings: number }[]>([]);

  useEffect(() => {
    // 1. Petrol Bike running cost per day
    const fuelCostPerDay = (dailyKm / selectedPetrolBike.consumptionKmPerLitre) * petrolPrice;
    const maintenanceCostPerDay = selectedPetrolBike.maintenancePerKm * dailyKm;
    const totalPetrolCostPerDay = fuelCostPerDay + maintenanceCostPerDay;
    const mPetrol = totalPetrolCostPerDay * 30;

    // 2. ZENTARO EV running cost per day
    // kWh = (V * Ah) / 1000
    const batteryKwh = (selectedModel.voltage * selectedModel.ampHours) / 1000;
    const chargeCost = batteryKwh * electricityRate;
    const costPerKm = chargeCost / selectedModel.rangeKm;
    const totalElectricCostPerDay = costPerKm * dailyKm;
    const mElectric = totalElectricCostPerDay * 30;

    const mSavings = Math.max(0, mPetrol - mElectric);
    const ySavings = mSavings * 12;
    const pctCheaper = mPetrol > 0 ? Math.round(((mPetrol - mElectric) / mPetrol) * 100) : 0;

    setMonthlyPetrolCost(Math.round(mPetrol));
    setMonthlyElectricCost(Math.round(mElectric));
    setMonthlySavings(Math.round(mSavings));
    setYearlySavings(Math.round(ySavings));
    setCheaperPercentage(pctCheaper);

    // Create 5 year projection data for Recharts
    const projections = Array.from({ length: 5 }, (_, i) => ({
      name: `Year ${i + 1}`,
      savings: Math.round(ySavings * (i + 1)),
    }));
    setChartData(projections);

    // Track analytics event on calculator interact
    const debouncer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        properties: {
          calculator_type: "savings",
          model_slug: selectedModel.slug,
          details: { dailyKm, petrolPrice, electricityRate, monthlySavings: Math.round(mSavings) },
        },
      });
    }, 1500);

    return () => clearTimeout(debouncer);
  }, [selectedModel, selectedPetrolBike, dailyKm, petrolPrice, electricityRate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
              STOP BLEEDING PETROL CASH
            </h1>
            <p className="text-muted text-sm font-medium mt-2 max-w-xl mx-auto">
              Compare your current fuel running costs against ZENTARO's highly efficient Lithium LFP battery systems.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Configurator Block */}
            <div className="lg:col-span-5 bg-[#121214] border border-border p-6 rounded-2xl space-y-6">
              <div className="flex items-center space-x-2 border-b border-border pb-3">
                <Calculator className="w-5 h-5 text-volt" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Parameters</h3>
              </div>

              {/* Model Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider block">ZENTARO Model</label>
                <select
                  value={selectedModel.name}
                  onChange={(e) => {
                    const preset = modelPresets.find((m) => m.name === e.target.value);
                    if (preset) setSelectedModel(preset);
                  }}
                  className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                >
                  {modelPresets.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.rangeKm}km Range)
                    </option>
                  ))}
                </select>
              </div>

              {/* Petrol Bike Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider block">Your Current Petrol Bike</label>
                <select
                  value={selectedPetrolBike.name}
                  onChange={(e) => {
                    const preset = petrolPresets.find((p) => p.name === e.target.value);
                    if (preset) setSelectedPetrolBike(preset);
                  }}
                  className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                >
                  {petrolPresets.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.consumptionKmPerLitre} km/L)
                    </option>
                  ))}
                </select>
              </div>

              {/* Daily Running Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                  <span>Daily Commute</span>
                  <span className="text-volt">{dailyKm} km</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={dailyKm}
                  onChange={(e) => setDailyKm(Number(e.target.value))}
                  className="w-full accent-volt bg-border h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted font-bold">
                  <span>10 km</span>
                  <span>150 km</span>
                </div>
              </div>

              {/* Rates input grid */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block">Petrol Price (Rs/L)</label>
                  <input
                    type="number"
                    value={petrolPrice}
                    onChange={(e) => setPetrolPrice(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block">Power Tariff (Rs/kWh)</label>
                  <input
                    type="number"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(Number(e.target.value))}
                    className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Results & Recharts Cumulative Plot */}
            <div className="lg:col-span-7 space-y-8">
              {/* Numeric results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Monthly Savings Card */}
                <div className="p-6 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-volt/35 transition-all">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Monthly Savings</span>
                  <CountUp
                    key={monthlySavings}
                    to={monthlySavings}
                    prefix="Rs "
                    className="font-display text-3xl font-black text-volt glow-text"
                  />
                  <span className="text-[9px] text-muted font-bold block mt-1">Saved from fuel burn</span>
                </div>

                {/* Yearly Savings Card */}
                <div className="p-6 bg-card border border-border rounded-2xl relative overflow-hidden group hover:border-volt/35 transition-all">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">Yearly Savings</span>
                  <CountUp
                    key={yearlySavings}
                    to={yearlySavings}
                    prefix="Rs "
                    className="font-display text-3xl font-black text-white"
                  />
                  <span className="text-[9px] text-muted font-bold block mt-1">Retained cash</span>
                </div>

                {/* Cheaper Percentage */}
                <div className="p-6 bg-card border border-[#BFFF00]/25 rounded-2xl relative overflow-hidden group hover:border-volt/35 transition-all bg-volt/5">
                  <span className="text-[10px] font-bold text-volt uppercase tracking-widest block mb-2">Fuel Efficiency</span>
                  <span className="font-display text-3xl font-black text-volt glow-text">
                    {cheaperPercentage}%
                  </span>
                  <span className="text-[9px] text-muted font-bold block mt-1">Cheaper operating costs</span>
                </div>
              </div>

              {/* Cumulative graph */}
              <div className="p-6 bg-[#121214] border border-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-volt" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      5-Year Cumulative Savings Projection
                    </span>
                  </div>
                  <span className="text-[10px] text-muted font-semibold">Values in PKR</span>
                </div>

                <div className="w-full h-[250px] text-xs">
                  <ResponsiveContainer width="100%" h-full="true">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#BFFF00" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#52525B" tickLine={false} />
                      <YAxis stroke="#52525B" tickLine={false} tickFormatter={(v) => `Rs ${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#121214", borderColor: "#27272A" }}
                        labelStyle={{ fontWeight: "bold", color: "#FFFFFF" }}
                        formatter={(value: any) => [`Rs ${value.toLocaleString()}`, "Saved"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="savings"
                        stroke="#BFFF00"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSavings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pricing comparison audit band */}
              <div className="p-5 bg-card border border-border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white uppercase block">Start Riding Cleaner Today</span>
                  <p className="text-[11px] text-muted font-medium leading-relaxed">
                    Switching to a ZENTARO pays for its initial purchase difference within 12–14 months of average city running.
                  </p>
                </div>
                <Link
                  href={`/models/${selectedModel.slug}`}
                  className="w-full md:w-auto text-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all flex items-center justify-center uppercase"
                >
                  Reserve {selectedModel.name.split(" ")[1]}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
