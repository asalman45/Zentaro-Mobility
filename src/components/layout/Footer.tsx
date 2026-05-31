"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export function Footer() {
  const { t, locale } = useLanguage();
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: "ZENTARO Thunder (Motorcycle)", href: "/models/zentaro-thunder" },
    { name: "ZENTARO Alpha (Motorcycle)", href: "/models/zentaro-alpha" },
    { name: "ZENTARO Breeze (Scooter)", href: "/models/zentaro-breeze" },
    { name: "Compare Lineup", href: "/compare" },
  ];

  const toolsLinks = [
    { name: t("nav.savingsCalculator"), href: "/savings-calculator" },
    { name: t("nav.financing"), href: "/financing" },
    { name: t("common.bookTestRide"), href: "/book-test-ride" },
    { name: "Find Dealer Showrooms", href: "/dealer" },
  ];

  const companyLinks = [
    { name: "About ZENTARO", href: "/about" },
    { name: "Official Blog", href: "/blog" },
    { name: "Contact Support", href: "/contact" },
    { name: "Careers", href: "#" },
  ];

  const socialLinks = [
    { icon: <FacebookIcon className="w-5 h-5" />, href: "#" },
    { icon: <InstagramIcon className="w-5 h-5" />, href: "#" },
    { icon: <LinkedinIcon className="w-5 h-5" />, href: "#" },
    { icon: <YoutubeIcon className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="w-full bg-[#050506] border-t border-border mt-auto pt-16 pb-8 text-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">
          {/* Slogan and Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="font-display text-3xl font-black tracking-tighter text-white">
              ZENTARO<span className="text-volt">.</span>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs text-muted">
              Pakistan's premier high-performance electric two-wheelers. Charging a greener,
              petrol-free Pakistan.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-volt/20 bg-volt/5 text-volt text-xs font-semibold uppercase tracking-wider">
              <span>{t("common.taglineUrdu")}</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="p-2 rounded-lg bg-card border border-border text-muted hover:border-volt hover:text-volt transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Directory Links columns */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Products</h3>
            <ul className="space-y-3">
              {productLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Utility Tools</h3>
            <ul className="space-y-3">
              {toolsLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">ZENTARO Mobility</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors duration-150">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Corporate details + copyright bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-xs font-medium">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-muted">
              © {currentYear} ZENTARO Mobility (Pvt) Ltd. All rights reserved.
            </p>
            <p className="text-[10px] text-muted/60">
              Disclaimer: All finance calculations are indicative values. Final installment figures depend on credit appraisal and matching bank rates.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors flex items-center space-x-1">
              <span>Safepay Certified</span>
              <ArrowUpRight className="w-3 h-3 text-volt" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
