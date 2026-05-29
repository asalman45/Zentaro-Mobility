"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function Header() {
  const { locale, setLocale, t, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Navigation Links
  const navItems = [
    { name: t("nav.models"), href: "/models" },
    { name: t("nav.savingsCalculator"), href: "/savings-calculator" },
    { name: t("nav.financing"), href: "/financing" },
    { name: t("nav.compare"), href: "/compare" },
    { name: t("nav.dealers"), href: "/dealers" },
    { name: t("nav.blog"), href: "/blog" },
  ];

  const handleLanguageToggle = () => {
    setLocale(locale === "en" ? "ur" : "en");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-display text-2xl font-black tracking-tighter text-white hover:text-volt transition-colors">
                ZENTARO<span className="text-volt">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 outline-none",
                    isActive ? "text-volt" : "text-muted hover:text-white"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-volt"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions (Bilingual, Auth, WhatsApp) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Locale Selector Button */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:border-volt hover:text-volt transition-all duration-200"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "اردو" : "EN"}</span>
            </button>

            {/* Profile Portal Placeholder */}
            <Link
              href="/account/dashboard"
              className="flex items-center justify-center p-2 rounded-lg border border-border text-muted hover:border-volt hover:text-volt transition-colors"
              aria-label="User Account"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Main Reservation Call-To-Action */}
            <Link
              href="/models"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] hover:shadow-[0_0_20px_rgba(191,255,0,0.5)] transition-all duration-200"
            >
              {t("common.reserveNow")}
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={handleLanguageToggle}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold hover:border-volt hover:text-volt transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "اردو" : "EN"}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted hover:text-white outline-none"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden glass-panel border-t border-border"
          >
            <div className="space-y-1 px-4 py-4 pb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-base font-semibold transition-colors",
                    pathname === item.href
                      ? "bg-volt/10 text-volt"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-border mt-4 flex flex-col space-y-3">
                <Link
                  href="/account/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-muted hover:bg-white/5 hover:text-white"
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{t("nav.account")}</span>
                </Link>

                <Link
                  href="/models"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-3 rounded-lg bg-volt hover:bg-volt-hover text-background font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all"
                >
                  {t("common.reserveNow")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
