"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface SpotlightCard {
  slug: string;
  name: string;
  type: string;
  tagline: string;
  price: string;
  originalPrice: string;
  renderName: string;
}

const spotlightModels: SpotlightCard[] = [
  {
    slug: "zentaro-storm",
    name: "Zentaro Storm",
    type: "MOTORCYCLE",
    tagline: "Where torque meets thrill.",
    price: "Rs 489,000",
    originalPrice: "Rs 549,000",
    renderName: "[ ZENTARO STORM RENDER ]",
  },
  {
    slug: "zentaro-apex",
    name: "Zentaro Apex",
    type: "MOTORCYCLE",
    tagline: "Flagship power. Future ride.",
    price: "Rs 749,000",
    originalPrice: "Rs 829,000",
    renderName: "[ ZENTARO APEX RENDER ]",
  },
  {
    slug: "zentaro-glide",
    name: "Zentaro Glide",
    type: "SCOOTER",
    tagline: "Effortless urban scooter.",
    price: "Rs 219,000",
    originalPrice: "Rs 259,000",
    renderName: "[ ZENTARO GLIDE RENDER ]",
  },
];

export function ModelSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Synchronize dot indicator with manual scroll on mobile
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / clientWidth);
    if (index >= 0 && index < spotlightModels.length) {
      setActiveIndex(index);
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: index * clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
    trackEvent({
      name: "spotlight_slide_changed",
      properties: { model_slug: spotlightModels[index].slug, index },
    });
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % spotlightModels.length;
    scrollToCard(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + spotlightModels.length) % spotlightModels.length;
    scrollToCard(prevIndex);
  };

  return (
    <section className="py-24 bg-[#050506] border-b border-border relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header section with arrows */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-lg sm:text-xl font-bold tracking-[0.2em] text-white uppercase">
            MODEL SPOTLIGHT
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous model"
              className="w-10 h-10 rounded-full border border-border/80 hover:border-volt/50 bg-black/40 hover:bg-white/5 flex items-center justify-center text-muted hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next model"
              className="w-10 h-10 rounded-full border border-border/80 hover:border-volt/50 bg-black/40 hover:bg-white/5 flex items-center justify-center text-muted hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8"
        >
          {spotlightModels.map((model, idx) => (
            <div
              key={model.slug}
              className="min-w-full sm:min-w-[50%] lg:min-w-0 snap-start snap-always"
            >
              <div className="group relative flex flex-col justify-between h-[520px] bg-[#0A0A0C] border border-[#161619] hover:border-volt/20 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(191,255,0,0.03)] overflow-hidden">
                
                {/* Upper Half (Card Render Area) */}
                <div className="relative w-full h-[280px] bg-[#0E0E11] border border-[#1A1A1F] rounded-xl flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/40 border border-white/5 text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                    {model.type}
                  </span>

                  {/* Ambient Lighting Grid Behind Text */}
                  <div className="absolute inset-0 bg-radial-gradient(circle, rgba(191,255,0,0.02)_0%, transparent_65%) opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Text Render Placeholder */}
                  <span className="font-mono text-xs text-muted/40 group-hover:text-volt/65 tracking-[0.15em] transition-all duration-500 select-none">
                    {model.renderName}
                  </span>
                </div>

                {/* Lower Half (Details and CTA) */}
                <div className="flex-grow flex flex-col justify-between pt-6">
                  <div className="space-y-1">
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-volt transition-colors duration-300">
                      {model.name}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 font-medium">
                      {model.tagline}
                    </p>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Price Grid */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-volt font-display tracking-tight">
                        {model.price}
                      </span>
                      <span className="text-xs text-muted-foreground/50 line-through">
                        {model.originalPrice}
                      </span>
                    </div>

                    {/* Explore Link Button */}
                    <Link
                      href={`/models/${model.slug}`}
                      onClick={() => {
                        trackEvent({
                          name: "spotlight_explore_clicked",
                          properties: { model_slug: model.slug },
                        });
                      }}
                      className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full border border-border/80 hover:border-volt text-white hover:text-volt bg-transparent hover:bg-volt/5 text-sm font-semibold tracking-wide transition-all duration-300"
                    >
                      Explore &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators/Dots Footer */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {spotlightModels.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToCard(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 bg-volt"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
