"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Battery,
  Shield,
  MapPin,
  FileText,
  Calculator,
  Percent,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, CountUp, MagneticButton, Reveal, Stagger, StaggerItem } from "@/components/motion";
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

export default function Home() {
  const { t, locale } = useLanguage();
  const [selectedCity, setSelectedCity] = useState("All");

  const featuredModels = [
    {
      slug: "zentaro-thunder",
      name: "ZENTARO Thunder",
      type: "Motorcycle",
      tagline: "Unleash the Storm",
      basePrice: 549000,
      originalPrice: 599000,
      speed: "105 km/h",
      range: "220 km",
      charge: "3.5 hrs",
      battery: "LFP Dual Pro",
      image: "/images/models/thunder-lime.png",
      colors: ["#BFFF00", "#1A1A1A", "#00E5FF"],
    },
    {
      slug: "zentaro-alpha",
      name: "ZENTARO Alpha",
      type: "Motorcycle",
      tagline: "The City Commute, Redefined",
      basePrice: 429000,
      originalPrice: 459000,
      speed: "85 km/h",
      range: "140 km",
      charge: "4.0 hrs",
      battery: "LFP Long-Range",
      image: "/images/models/alpha-grey.png",
      colors: ["#4A4A4F", "#DC2626"],
    },
    {
      slug: "zentaro-breeze",
      name: "ZENTARO Breeze",
      type: "Scooter",
      tagline: "Glide Through Traffic",
      basePrice: 329000,
      originalPrice: 349000,
      speed: "70 km/h",
      range: "110 km",
      charge: "3.0 hrs",
      battery: "LFP Pro Smart",
      image: "/images/models/breeze-white.png",
      colors: ["#FFFFFF", "#0D0D0D", "#F472B6"],
    },
  ];

  const featuresList = [
    {
      icon: <Battery className="w-8 h-8 text-volt" />,
      title: "LFP Ultra-Safe Battery Pack",
      desc: "LFP cells are thermally secure, run up to 8 years (3,000+ charges) with zero risk of combustion in hot climates.",
    },
    {
      icon: <Zap className="w-8 h-8 text-volt" />,
      title: "Immediate Peak Torque Hubs",
      desc: "Electric motor delivers instantaneous speed with zero carbon emissions, belts, gears, or engine oil tuning.",
    },
    {
      icon: <Shield className="w-8 h-8 text-volt" />,
      title: "Smart App Integration",
      desc: "NFC smart keyless startup, geofenced GPS navigation, remote system locking, and OTA diagnostic updates.",
    },
  ];

  const latestBlogs = [
    {
      slug: "is-electric-bike-saving-money-pakistan",
      title: "Is Switching to an Electric Bike Worth It in Pakistan in 2026?",
      date: "May 29, 2026",
      readTime: "4 min read",
    },
    {
      slug: "lfp-vs-graphene-which-battery-to-choose",
      title: "LFP vs Graphene Batteries: Which ZENTARO Variant is Best for You?",
      date: "May 27, 2026",
      readTime: "6 min read",
    },
  ];

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
            {/* Ambient vignette masks */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 z-10">
            <FadeIn duration={0.8}>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-volt/20 bg-volt/5 text-volt text-xs font-bold uppercase tracking-widest mb-2">
                <span>{t("common.taglineUrdu")}</span>
              </div>
            </FadeIn>

            <Reveal className="mx-auto select-none" width="100%">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter leading-none text-white">
                {t("hero.title")}
              </h1>
            </Reveal>

            <FadeIn delay={0.3} duration={0.8} className="max-w-2xl mx-auto">
              <p className="text-base sm:text-lg lg:text-xl text-muted font-medium leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </FadeIn>

            <FadeIn delay={0.5} duration={0.8} className="pt-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton
                  onClick={() => {
                    trackEvent({ name: "hero_cta_clicked", properties: { cta_label: "Reserve Yours", destination: "/models" } });
                    window.location.href = "/models";
                  }}
                  className="w-full sm:w-auto"
                >
                  <span className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-volt hover:bg-volt-hover text-background text-base font-bold tracking-tight shadow-[0_0_20px_rgba(191,255,0,0.4)] transition-all">
                    {t("hero.ctaPrimary")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </MagneticButton>

                <Link
                  href="/book-test-ride"
                  onClick={() => {
                    trackEvent({ name: "hero_cta_clicked", properties: { cta_label: "Book Free Test Ride", destination: "/book-test-ride" } });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-border text-foreground hover:border-volt hover:text-volt bg-white/5 hover:bg-white/10 text-base font-bold tracking-tight transition-all duration-300"
                >
                  {t("hero.ctaSecondary")}
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Animated Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-65">
            <span className="text-[10px] text-muted font-bold tracking-widest uppercase mb-1">Scroll Down</span>
            <div className="w-5 h-8 border border-border rounded-full p-1 flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-volt rounded-full"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: SAVINGS IMPACT BAND */}
        <section className="py-12 bg-card border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="py-4 md:py-0">
                <CountUp
                  to={1450}
                  suffix="+"
                  className="block font-display text-4xl sm:text-5xl font-extrabold text-volt glow-text"
                />
                <span className="text-xs font-bold text-muted uppercase tracking-widest mt-1 block">
                  Trees Planted Equivalents
                </span>
              </div>
              <div className="py-4 md:py-0">
                <CountUp
                  to={85200}
                  suffix=" kg"
                  className="block font-display text-4xl sm:text-5xl font-extrabold text-volt glow-text"
                />
                <span className="text-xs font-bold text-muted uppercase tracking-widest mt-1 block">
                  CO2 Emissions Saved
                </span>
              </div>
              <div className="py-4 md:py-0">
                <CountUp
                  to={38400}
                  prefix="Rs "
                  className="block font-display text-4xl sm:text-5xl font-extrabold text-volt glow-text"
                />
                <span className="text-xs font-bold text-muted uppercase tracking-widest mt-1 block">
                  Weekly Fuel Bills Bleed Stopped
                </span>
              </div>
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
                Choose the design and range chemistry that power your life. Drive advanced Lithium
                Iron Phosphate technology.
              </p>
            </FadeIn>
          </div>

          <Stagger className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredModels.map((model) => (
              <StaggerItem key={model.slug}>
                <div className="group relative flex flex-col justify-between h-full bg-[#121214] border border-border hover:border-volt/35 rounded-2xl overflow-hidden p-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]">
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-border text-[10px] font-bold uppercase tracking-wider text-muted group-hover:text-volt transition-colors">
                        {model.type}
                      </span>
                      <span className="text-xs text-muted font-semibold group-hover:text-white">
                        {model.battery}
                      </span>
                    </div>

                    {/* Image Area - Gradient Placeholder */}
                    <div className="relative w-full h-44 my-6 flex items-center justify-center rounded-xl bg-gradient-to-b from-[#1a1a1f] to-transparent overflow-hidden">
                      <div className="absolute inset-0 bg-radial-gradient(circle, rgba(191,255,0,0.05)_0%, transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Placeholder Bike Box with Electric Lime Energy Glow lines */}
                      <div className="text-center space-y-2">
                        <Zap className="w-12 h-12 text-volt/20 group-hover:text-volt group-hover:scale-110 transition-all duration-500 mx-auto" />
                        <span className="text-[10px] text-muted group-hover:text-white font-bold tracking-widest uppercase block transition-colors">
                          {model.name} Render
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl font-bold text-white group-hover:text-volt transition-colors">
                        {model.name}
                      </h3>
                      <p className="text-xs text-muted font-medium italic">{model.tagline}</p>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-4 border-t border-border mt-5 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-muted block uppercase tracking-wider">Top Speed</span>
                        <span className="font-bold text-white mt-0.5 block">{model.speed}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted block uppercase tracking-wider">Range</span>
                        <span className="font-bold text-white mt-0.5 block">{model.range}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted block uppercase tracking-wider">Charging</span>
                        <span className="font-bold text-white mt-0.5 block">{model.charge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-border mt-4 flex items-center justify-between">
                    <div>
                      {model.originalPrice && (
                        <span className="text-xs text-muted/65 line-through block">
                          Rs {model.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-lg font-black text-white group-hover:text-volt transition-colors block">
                        Rs {model.basePrice.toLocaleString()}
                      </span>
                    </div>

                    <Link
                      href={`/models/${model.slug}`}
                      className="inline-flex items-center justify-center p-3 rounded-xl bg-card border border-border group-hover:border-volt text-muted group-hover:text-background group-hover:bg-volt transition-all duration-300"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
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
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
