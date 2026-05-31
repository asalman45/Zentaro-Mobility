"use client";

import React from "react";
import {
  BatteryCharging,
  Cpu,
  Key,
  ShieldAlert,
  RotateCcw,
  Disc,
  Droplets,
  Calendar,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";

export function WhyZentaro() {
  const points = [
    {
      icon: BatteryCharging,
      title: "Lithium LFP Battery",
      description: "Safer chemistry, 15-year design life, zero-maintenance.",
    },
    {
      icon: Cpu,
      title: "Brushless Motor",
      description: "Powerful, silent, virtually no moving-part wear.",
    },
    {
      icon: Key,
      title: "NFC Keyless Unlock",
      description: "Tap to start. No keys to lose, no fuel-cap fiddle.",
    },
    {
      icon: ShieldAlert,
      title: "Remote Anti-theft",
      description: "Smart alarm + GPS tracking from your phone.",
    },
    {
      icon: RotateCcw,
      title: "Reverse Mode",
      description: "Tight parking? Reverse out with a tap.",
    },
    {
      icon: Disc,
      title: "Combined Braking (CBS)",
      description: "Synchronized stopping for shorter brake distances.",
    },
    {
      icon: Droplets,
      title: "IP67 Water-Resistant",
      description: "Engineered for Pakistani monsoons and puddles.",
    },
    {
      icon: Calendar,
      title: "15-Year Battery Life",
      description: "Backed by Pakistan's longest battery promise.",
    },
  ];

  return (
    <section className="py-24 bg-[#050506] relative overflow-hidden select-none border-t border-border/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="space-y-3 mb-16 text-left">
          <FadeIn>
            <span className="text-xs font-bold text-volt tracking-widest uppercase block mb-1">
              WHY ZENTARO
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tighter text-white leading-tight max-w-2xl">
              Engineered for Pakistan, built for the future.
            </h2>
          </FadeIn>
        </div>

        {/* Feature Grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, index) => {
            const Icon = point.icon;
            return (
              <StaggerItem key={index}>
                <div className="group relative flex flex-col h-full bg-[#0D0D0F] border border-[#1A1A1F] rounded-3xl p-6 transition-all duration-300 hover:border-volt/30 hover:shadow-[0_0_30px_rgba(191,255,0,0.04)]">
                  {/* Icon Circular Green Badge */}
                  <div className="w-10 h-10 rounded-full border border-volt/20 bg-volt/[0.08] flex items-center justify-center text-volt mb-6 group-hover:bg-volt group-hover:text-black transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-volt transition-colors duration-300">
                      {point.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground/60 leading-relaxed font-medium">
                      {point.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

      </div>
    </section>
  );
}
