"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function PreFooterCTA() {
  return (
    <section className="py-16 sm:py-24 bg-[#050506] relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Rounded Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-[#161619] bg-[#0A0A0C] p-12 sm:p-16 text-center shadow-2xl hover:shadow-[0_0_50px_rgba(191,255,0,0.02)] transition-shadow duration-500">
          
          {/* Subtle Green Radial Light Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,255,0,0.05),transparent_65%)] pointer-events-none" />

          {/* Card Contents */}
          <div className="relative z-10 space-y-6">
            
            {/* Title */}
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
              Ride into the <span className="text-volt glow-text">future.</span>
            </h2>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto font-medium leading-relaxed">
              Reserve your Zentaro today with a fully refundable deposit. Or chat with us on WhatsApp &mdash; we reply in minutes.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              
              {/* Reserve Button */}
              <Link
                href="/models"
                onClick={() => {
                  trackEvent({
                    name: "hero_cta_clicked",
                    properties: { cta_label: "Reserve Now", destination: "/models" },
                  });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-wide shadow-[0_0_15px_rgba(191,255,0,0.25)] hover:shadow-[0_0_25px_rgba(191,255,0,0.35)] transition-all duration-300"
              >
                Reserve Now &rarr;
              </Link>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/923000000000" // Generic placeholders aligned with standard app patterns
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent({
                    name: "whatsapp_clicked",
                    properties: { cta_location: "pre_footer_cta" },
                  });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-border/80 hover:border-white text-white hover:bg-white/5 text-sm font-semibold tracking-wide transition-all duration-300"
              >
                Chat on WhatsApp
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
