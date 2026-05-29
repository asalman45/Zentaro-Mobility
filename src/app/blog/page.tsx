"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Calendar, User, Clock, ArrowRight, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

const mockPosts: BlogPost[] = [
  {
    slug: "is-electric-bike-saving-money-pakistan",
    title: "Is Switching to an Electric Bike Worth It in Pakistan in 2026?",
    excerpt: "With petrol prices hovering around Rs 270+ per litre, we run down the exact numbers to see how fast a ZENTARO EV pays for itself.",
    category: "Financing & Savings",
    author: "ZENTARO Tech Labs",
    date: "May 29, 2026",
    readTime: "4 min read",
  },
  {
    slug: "lfp-vs-graphene-which-battery-to-choose",
    title: "LFP vs Graphene Batteries: Which ZENTARO Variant is Best for You?",
    excerpt: "Unpacking the chemistry, cycle life, thermal safety, and pricing of LFP vs Graphene batteries to help you choose the right fit.",
    category: "Tech & Battery",
    author: "Product Engineering Team",
    date: "May 27, 2026",
    readTime: "6 min read",
  },
];

export default function BlogIndexPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "Financing & Savings", "Tech & Battery"];

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      activeCategory === "all" || post.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24 text-xs font-semibold text-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
              ZENTARO JOURNAL
            </h1>
            <p className="text-muted text-sm font-medium mt-2 max-w-xl mx-auto">
              Explore the latest insights, calculation logs, and EV battery comparisons from our research division.
            </p>
          </FadeIn>

          {/* Search and Category Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card border border-border p-4 rounded-2xl mb-10">
            {/* Category tabs */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto scrollbar-hide p-1 bg-[#0A0A0B] rounded-xl border border-border">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-[10px] font-bold rounded-lg capitalize whitespace-nowrap transition-all ${
                    activeCategory === cat ? "bg-volt text-background" : "text-muted hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0A0A0B] border border-border rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-volt transition-colors"
              />
            </div>
          </div>

          {/* Articles Grid list */}
          {filteredPosts.length === 0 ? (
            <p className="text-center text-sm py-12">No articles matched your search filters.</p>
          ) : (
            <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <StaggerItem key={post.slug}>
                  <div className="group bg-[#121214] border border-border hover:border-volt/35 rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between h-[300px] transition-all duration-300 shadow-xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-volt">{post.category}</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-volt transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-muted leading-relaxed font-medium line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4 mt-6 flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-2 text-muted/70">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center font-bold text-white group-hover:text-volt transition-colors"
                      >
                        Read Article
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
