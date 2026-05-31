"use client";

import React from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

interface BlogCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  renderName: string;
}

const latestPosts: BlogCard[] = [
  {
    slug: "pave-scheme-explained",
    title: "PAVE Scheme Explained: Get Rs 80,000 Off Your Electric Bike",
    excerpt: "Pakistan's new EV subsidy program is here. Here's how to qualify and apply in under 10 minutes.",
    category: "Policy",
    date: "12-May-2026",
    renderName: "[ POLICY ]",
  },
  {
    slug: "petrol-vs-electric-2026",
    title: "Petrol vs Electric in 2026: The Real Numbers",
    excerpt: "We tracked a Honda CD70 and a Zentaro Bolt for 90 days. The savings are bigger than you think.",
    category: "Comparison",
    date: "28-Apr-2026",
    renderName: "[ COMPARISON ]",
  },
  {
    slug: "lfp-battery-care",
    title: "LFP Battery Care: Make It Last 15 Years",
    excerpt: "Five simple habits that protect your battery and keep range at 100% for over a decade.",
    category: "Tips",
    date: "15-Apr-2026",
    renderName: "[ TIPS ]",
  },
];

export function BlogHighlight() {
  return (
    <section className="py-24 bg-[#050506] border-b border-border relative overflow-hidden select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header and link */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-1">
            <span className="text-volt font-bold text-xs uppercase tracking-[0.2em] block">
              JOURNAL
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tighter">
              Latest from the blog.
            </h2>
          </div>
          
          <Link
            href="/blog"
            onClick={() => {
              trackEvent({
                name: "hero_cta_clicked",
                properties: { cta_label: "All posts", destination: "/blog" },
              });
            }}
            className="text-sm font-semibold text-volt hover:text-volt-hover transition-colors duration-300 flex items-center gap-1 cursor-pointer"
          >
            All posts &rarr;
          </Link>
        </div>

        {/* Grid list of posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={() => {
                trackEvent({
                  name: "hero_cta_clicked",
                  properties: { cta_label: post.title, destination: `/blog/${post.slug}` },
                });
              }}
              className="group flex flex-col justify-between h-[520px] bg-[#0A0A0C] border border-[#161619] hover:border-volt/20 rounded-2xl p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(191,255,0,0.03)]"
            >
              <div>
                {/* Upper graphic/placeholder area */}
                <div className="relative w-full h-[280px] bg-[#0E0E11] border border-[#1A1A1F] rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient(circle, rgba(191,255,0,0.02)_0%, transparent_65%) opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="font-mono text-xs text-muted/40 group-hover:text-volt/65 tracking-[0.15em] transition-all duration-500">
                    {post.renderName}
                  </span>
                </div>

                {/* Metadata & Title */}
                <div className="mt-5 text-[11px] text-muted-foreground/60 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>&bull;</span>
                  <span className="text-volt">{post.category}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-white group-hover:text-volt transition-colors duration-300 mt-2.5 leading-snug">
                  {post.title}
                </h3>
              </div>

              {/* Excerpt */}
              <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed mt-4">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
