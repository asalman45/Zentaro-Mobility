"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Fuel, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function SavingsTeaser() {
  return (
    <section className="py-12 bg-[#050506] relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Card Grid */}
        <div className="relative overflow-hidden rounded-3xl border border-[#161619] bg-[#0A0A0C] p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center hover:shadow-[0_0_40px_rgba(191,255,0,0.02)] transition-shadow duration-500">
          
          {/* Accent lighting leak */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[radial-gradient(circle_at_top_right,rgba(191,255,0,0.04),transparent_60%)] pointer-events-none" />

          {/* Left Column: Savings Teaser */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-volt">
              <TrendingUp className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-widest sm:tracking-[0.15em]">
                REAL NUMBERS
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                You could save
              </h3>
              <p className="font-display text-5xl sm:text-6xl font-black text-volt glow-text leading-none tracking-tighter pt-1">
                Rs 9,200
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground/60 font-medium block pt-1">
                per month vs a 70cc petrol bike
              </p>
            </div>
          </div>

          {/* Right Column: Visual Breakdown List & Calculator CTA */}
          <div className="space-y-4 relative z-10 w-full">
            
            {/* Petrol Row */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/80">
                  <Fuel className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Petrol (Honda CD70)</span>
                  <span className="text-[10px] text-muted-foreground/50 block font-medium mt-0.5">~9,500/mo at current rates</span>
                </div>
              </div>
              <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">Rs 9,500</span>
            </div>

            {/* Zentaro EV Row */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-volt/20 bg-volt/[0.04] gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border border-volt/20 bg-volt/[0.08] flex items-center justify-center text-volt">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">Zentaro Bolt</span>
                  <span className="text-[10px] text-volt/60 block font-medium mt-0.5">Charging at home, mostly off-peak</span>
                </div>
              </div>
              <span className="text-sm font-bold text-volt tracking-tight whitespace-nowrap">Rs 300</span>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/savings-calculator"
                onClick={() => {
                  trackEvent({
                    name: "hero_cta_clicked",
                    properties: { cta_label: "Calculate your savings", destination: "/savings-calculator" },
                  });
                }}
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-full bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(191,255,0,0.2)] transition-all duration-300"
              >
                Calculate your savings &rarr;
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
