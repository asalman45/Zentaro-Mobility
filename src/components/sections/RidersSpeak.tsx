"use client";

import React, { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Switched from a 70cc — I'm saving over Rs 8,000 every month on fuel. The Bolt is genuinely faster than my old bike.",
    author: "Ahmed Raza",
    location: "Lahore",
    stars: 5,
  },
  {
    id: 2,
    quote: "The Glide is perfect for school runs. Silent, smooth, and the keyless unlock feels like magic.",
    author: "Sana Iqbal",
    location: "Karachi",
    stars: 5,
  },
  {
    id: 3,
    quote: "I run a food delivery setup with 4 Zentaro Cargo bikes. Zero fuel cost, zero downtime so far.",
    author: "Bilal Khan",
    location: "Islamabad",
    stars: 5,
  },
  {
    id: 4,
    quote: "Beautiful design and riding comfort, exactly as promised. Highly recommend Zentaro!",
    author: "Hira Malik",
    location: "Rawalpindi",
    stars: 5,
  },
];

export function RidersSpeak() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth === 0) return;
    const index = Math.round(scrollLeft / clientWidth);
    if (index >= 0 && index < testimonials.length) {
      setActiveIndex(index);
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.children[index] as HTMLElement;
    if (card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
      setActiveIndex(index);
      trackEvent({
        name: "whatsapp_clicked", // use allowed events or avoid trackEvent if not needed
        properties: { cta_location: `testimonials_slide_${index}` },
      });
    }
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % testimonials.length;
    scrollToCard(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    scrollToCard(prevIndex);
  };

  return (
    <section className="py-24 bg-[#050506] border-b border-border relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header and Controls */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-1">
            <span className="text-volt font-bold text-xs uppercase tracking-[0.2em] block">
              RIDERS SPEAK
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tighter">
              12,000+ happy riders.
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-border/80 hover:border-volt/50 bg-black/40 hover:bg-white/5 flex items-center justify-center text-muted hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-border/80 hover:border-volt/50 bg-black/40 hover:bg-white/5 flex items-center justify-center text-muted hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8"
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-full md:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-start snap-always"
            >
              <div className="group relative flex flex-col justify-between h-[280px] bg-[#0A0A0C] border border-[#161619] hover:border-volt/20 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(191,255,0,0.03)]">
                
                {/* Stars and Review Text */}
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-volt fill-volt"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base font-medium text-white/90 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Author Metadata & Link */}
                <div className="flex items-end justify-between pt-4 border-t border-border/20">
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {t.author}
                    </span>
                    <span className="text-xs text-muted-foreground/60 block mt-0.5">
                      {t.location}
                    </span>
                  </div>

                  <a
                    href="https://google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-volt hover:text-volt-hover font-semibold transition-colors duration-300 flex items-center gap-1"
                  >
                    Google Review &rarr;
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Indicators/Dots Footer */}
        <div className="flex items-center justify-center gap-2 mt-4 md:hidden">
          {testimonials.map((_, idx) => (
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
