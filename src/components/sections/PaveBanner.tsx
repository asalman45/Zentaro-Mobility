"use client";

import React from "react";
import Link from "next/link";
import { Percent } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function PaveBanner() {
  return (
    <section className="pb-16 bg-[#050506] relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Banner container card in branding Volt green */}
        <div className="bg-volt rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(191,255,0,0.1)]">
          
          {/* Left Side: Shield Badge & Copy */}
          <div className="flex items-center gap-5 text-left w-full md:max-w-2xl">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0A0A0C] flex items-center justify-center flex-shrink-0 text-volt">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#0A0A0C]/70 block leading-none">
                GOVT OF PAKISTAN
              </span>
              <h2 className="font-display text-lg sm:text-2xl lg:text-3xl font-black text-[#0A0A0C] tracking-tight mt-2 leading-tight">
                Get up to Rs 80,000 subsidy + interest-free financing under the PAVE Scheme.
              </h2>
            </div>
          </div>

          {/* Right Side: Action Button */}
          <div className="w-full md:w-auto">
            <Link
              href="/blog/pave-scheme-explained"
              onClick={() => {
                trackEvent({
                  name: "hero_cta_clicked",
                  properties: { cta_label: "Check your eligibility", destination: "/blog/pave-scheme-explained" },
                });
              }}
              className="w-full md:w-auto inline-flex items-center justify-center py-3.5 px-7 rounded-full bg-[#0A0A0C] hover:bg-[#1A1A1F] text-volt hover:text-white text-sm font-bold tracking-wide shadow-lg whitespace-nowrap transition-all duration-300"
            >
              Check your eligibility &rarr;
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
