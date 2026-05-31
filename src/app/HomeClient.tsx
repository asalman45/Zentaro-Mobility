"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Zap,
  Calculator,
  Percent,
  Gauge,
  Timer,
  Battery,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { ModelSpotlight } from "@/components/sections/ModelSpotlight";
import { RidersSpeak } from "@/components/sections/RidersSpeak";
import { BlogHighlight } from "@/components/sections/BlogHighlight";
import { PreFooterCTA } from "@/components/sections/PreFooterCTA";
import { SavingsTeaser } from "@/components/sections/SavingsTeaser";
import { PaveBanner } from "@/components/sections/PaveBanner";
import { FadeIn, CountUp, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { trackEvent } from "@/lib/analytics";

// Dynamically import Leaflet DealersMap to prevent SSR errors
const DealersMap = dynamic(() => import("@/components/dealers/DealersMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] bg-card border border-border rounded-2xl flex items-center justify-center animate-pulse">
      <span className="text-muted text-sm font-semibold">Loading Live Dealer Map...</span>
    </div>
  ),
});

interface HomeClientProps {
  featuredModels: any[];
}

export default function HomeClient({ featuredModels }: HomeClientProps) {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState("All");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* SECTION 1: CINEMATIC HERO */}
        <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
          {/* Background Loop Video */}
          <div className="absolute inset-0 bg-[#050506]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-35"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-modern-motorcycle-on-a-highway-at-night-40348-large.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 space-y-6">
            <FadeIn>
              <span className="text-xs font-bold text-volt tracking-[0.25em] uppercase block">
                ZENTARO MOBILITY
              </span>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-none uppercase">
                POWERS UNBOUND
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-muted text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
                Advanced Lithium LFP technology engineered to conquer Pakistan's climate.
                <br />
                Zero emissions, zero gears, pure economic liberation.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/models"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-volt hover:bg-volt-hover text-background text-base font-bold tracking-tight shadow-[0_0_20px_rgba(191,255,0,0.4)] hover:shadow-[0_0_25px_rgba(191,255,0,0.55)] transition-all duration-300"
              >
                Explore Lineup &gt;
              </Link>
              <Link
                href="/book-test-ride"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#111115] hover:bg-[#181822] text-white hover:text-volt border border-[#1C1C24] transition-all text-base font-bold tracking-tight duration-300"
              >
                Book Test Ride
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* SECTION 2: PRODUCT SHOWCASE SLIDER */}
        <section className="bg-[#050506] border-b border-border">
          <ModelSpotlight />
        </section>

        {/* SECTION 1.5: KEY METRICS ROW */}
        <section className="bg-black border-y border-[#1A1A1F] py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="font-display text-3xl sm:text-4xl font-black text-white block">
                Rs <CountUp to={9200} duration={2.5} />
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mt-2">
                AVG. MONTHLY SAVINGS
              </span>
            </div>
            <div>
              <span className="font-display text-3xl sm:text-4xl font-black text-white block">
                <CountUp to={8} duration={2.0} /> Years
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mt-2">
                LFP BATTERY WARRANTY LIFE
              </span>
            </div>
            <div>
              <span className="font-display text-3xl sm:text-4xl font-black text-white block">
                <CountUp to={130} duration={2.0} /> km/h
              </span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mt-2">
                MAXIMUM TOP SPEED
              </span>
            </div>
            <div>
              <span className="font-display text-3xl sm:text-4xl font-black text-volt block">
                84%
              </span>
              <span className="text-[10px] text-volt font-bold uppercase tracking-widest block mt-2">
                WEEKLY FUEL BILLS SAVED
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: MODEL LINEUP */}
        <section className="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-16 text-center md:text-left">
            <FadeIn>
              <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tighter text-white">
                THE ZENTARO LINEUP
              </h2>
              <p className="text-muted font-medium text-sm sm:text-base max-w-xl">
                Choose the design and range chemistry that power your life. Drive advanced Lithium Iron Phosphate technology.
              </p>
            </FadeIn>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredModels.map((model) => {
              const primaryVariant = model.variants?.[0];
              const topSpeed = primaryVariant ? `${primaryVariant.topSpeedKmh} km/h` : "N/A";
              const range = primaryVariant ? `${primaryVariant.rangeKm} km` : "N/A";
              const charge = primaryVariant ? `${primaryVariant.chargingTimeHrs} h` : "N/A";
              const batteryLife = primaryVariant ? `${primaryVariant.batteryLifeYears} yr` : "N/A";

              return (
                <StaggerItem key={model.slug}>
                  <div className="group relative flex flex-col justify-between h-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-3xl p-6 transition-all duration-500 hover:border-volt/30 hover:shadow-[0_0_35px_rgba(191,255,0,0.06)]">
                    <div>
                      {/* Badge */}
                      <div className="flex justify-between items-start">
                        <span className="px-3.5 py-1 rounded-full bg-black/40 border border-white/5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                          {model.type}
                        </span>
                      </div>

                      {/* Image Area - Dark Placeholder with monospaced indicator */}
                      <div className="relative w-full h-[280px] my-6 bg-[#0E0E11] border border-[#1A1A1F] rounded-xl flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(191,255,0,0.02)_0%, transparent_65%) opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <span className="font-mono text-xs text-muted/40 group-hover:text-volt/65 tracking-[0.15em] transition-all duration-500 select-none">
                          [ {model.name.toUpperCase()} IMAGE ]
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <h3 className="font-display text-xl font-bold text-white group-hover:text-volt transition-colors duration-300">
                          {model.name}
                        </h3>
                        <p className="text-sm text-muted-foreground/80 font-medium">{model.tagline}</p>
                      </div>

                      {/* Specs Grid (2x2 outlined capsules) */}
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="border border-[#1A1A1F] rounded-2xl p-3 flex items-center gap-3 bg-black/20">
                          <Gauge className="w-5 h-5 text-volt" />
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">TOP SPEED</span>
                            <span className="text-sm font-bold text-white block">{topSpeed}</span>
                          </div>
                        </div>
                        <div className="border border-[#1A1A1F] rounded-2xl p-3 flex items-center gap-3 bg-black/20">
                          <Battery className="w-5 h-5 text-volt" />
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">RANGE</span>
                            <span className="text-sm font-bold text-white block">{range}</span>
                          </div>
                        </div>
                        <div className="border border-[#1A1A1F] rounded-2xl p-3 flex items-center gap-3 bg-black/20">
                          <Zap className="w-5 h-5 text-volt" />
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">CHARGE</span>
                            <span className="text-sm font-bold text-white block">{charge}</span>
                          </div>
                        </div>
                        <div className="border border-[#1A1A1F] rounded-2xl p-3 flex items-center gap-3 bg-black/20">
                          <Timer className="w-5 h-5 text-volt" />
                          <div>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest block font-bold">WARRANTY</span>
                            <span className="text-sm font-bold text-white block">{batteryLife}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Action */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-volt font-display tracking-tight">
                          Rs {model.basePrice.toLocaleString()}
                        </span>
                        {model.originalPrice && (
                          <span className="text-sm text-muted-foreground/50 line-through">
                            Rs {model.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-4">
                        <Link
                          href={`/models/${model.slug}`}
                          onClick={() => {
                            trackEvent({
                              name: "hero_cta_clicked",
                              properties: { cta_label: "Explore", destination: `/models/${model.slug}` }
                            });
                          }}
                          className="w-[45%] inline-flex items-center justify-center py-3.5 rounded-full border border-border/80 hover:border-white text-white hover:bg-white/5 text-sm font-semibold tracking-wide transition-all duration-300 bg-transparent"
                        >
                          Explore
                        </Link>
                        <Link
                          href={`/reserve/${model.slug}`}
                          onClick={() => {
                            trackEvent({
                              name: "hero_cta_clicked",
                              properties: { cta_label: "Reserve", destination: `/reserve/${model.slug}` }
                            });
                          }}
                          className="w-[55%] inline-flex items-center justify-center py-3.5 rounded-full bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(191,255,0,0.25)] hover:shadow-[0_0_20px_rgba(191,255,0,0.35)] transition-all duration-300"
                        >
                          Reserve
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        {/* SECTION 4: PETROL IS BLEEDING YOU */}
        <section className="py-24 bg-[#0A0A0B] relative overflow-hidden border-y border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(191,255,0,0.03),transparent_40%)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Economic Crisis</span>
                </div>
                
                <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white leading-none">
                  {t("savings.title")}
                </h2>
                
                <p className="text-muted leading-relaxed font-medium">
                  Petrol prices in Pakistan are volatile and tuning costs are bleeding commuters dry. A standard 70cc/125cc bike drains thousands of rupees every single week.
                </p>
                <p className="text-muted leading-relaxed font-medium">
                  With ZENTARO's highly efficient battery management systems, charge your ride for less than a quarter of a fuel tank and commute without borders.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/savings-calculator"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Monthly Savings
                  </Link>

                  <Link
                    href="/financing"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border text-foreground hover:border-volt hover:text-volt bg-white/5 transition-all text-sm font-bold tracking-tight"
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Own it from Rs 11,500/mo
                  </Link>
                </div>
              </FadeIn>

              {/* Graphic Element / Visual Hook */}
              <FadeIn direction="left" className="relative p-8 rounded-2xl bg-card border border-border shadow-2xl flex flex-col justify-between h-[300px]">
                <div className="space-y-4">
                  <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Visualizing Fuel Drain</span>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-muted mb-1 font-semibold">
                        <span>Petrol bike cost / km</span>
                        <span className="text-red-400">Rs 7.50</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-red-500" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted mb-1 font-semibold">
                        <span>ZENTARO EV cost / km</span>
                        <span className="text-volt">Rs 1.20</span>
                      </div>
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-[16%] h-full bg-volt" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mt-6 text-center">
                  <span className="font-display text-4xl font-extrabold text-volt glow-text">84%</span>
                  <span className="text-xs text-muted font-bold tracking-wider block mt-1">
                    Cheaper Per Commute Kilometer
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SECTION: SAVINGS CALCULATOR TEASER */}
        <SavingsTeaser />

        {/* SECTION: PAVE SCHEME SUBSIDY BANNER */}
        <PaveBanner />

        {/* SECTION: RIDERS SPEAK TESTIMONIALS */}
        <RidersSpeak />

        {/* SECTION: JOURNAL / LATEST BLOGS */}
        <BlogHighlight />

        {/* SECTION 5: DEALERS LOCATOR MAP */}
        <section className="py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <FadeIn className="space-y-3 text-center md:text-left">
              <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tighter text-white">
                NATIONWIDE NETWORK
              </h2>
              <p className="text-muted text-sm font-medium">
                Locate your nearest authorized ZENTARO showroom, service hub, or charging point.
              </p>
            </FadeIn>

            {/* City selectors filter buttons */}
            <FadeIn className="flex flex-wrap items-center justify-center gap-2">
              {["All", "Karachi", "Lahore", "Islamabad"].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                    selectedCity === city
                      ? "bg-volt border-volt text-background shadow-[0_0_12px_rgba(191,255,0,0.3)]"
                      : "bg-card border-border text-muted hover:border-volt hover:text-volt"
                  }`}
                >
                  {city}
                </button>
              ))}
            </FadeIn>
          </div>

          <FadeIn duration={0.8}>
            <DealersMap selectedCity={selectedCity} />
          </FadeIn>
        </section>

        {/* SECTION: PRE-FOOTER CALL TO ACTION */}
        <PreFooterCTA />
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
