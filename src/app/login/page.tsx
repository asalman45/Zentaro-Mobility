"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, Briefcase, Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn } from "@/components/motion";
import { setSession } from "@/lib/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    
    // Simulate login success - check manual credentials
    setTimeout(() => {
      setIsLoading(false);
      if (email === "admin@zentaro.pk" && password === "admin123") {
        setSession("admin");
        router.push("/admin");
      } else if (email === "clifton@zentaro.pk" && password === "dealer123") {
        setSession("dealer");
        router.push("/dealer");
      } else {
        setSession("customer");
        router.push("/account/dashboard");
      }
    }, 1000);
  };

  const handleQuickLogin = (role: "customer" | "dealer" | "admin") => {
    setIsLoading(true);
    setSession(role);
    
    setTimeout(() => {
      setIsLoading(false);
      if (role === "admin") router.push("/admin");
      else if (role === "dealer") router.push("/dealer");
      else router.push("/account/dashboard");
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex items-center justify-center pt-10 pb-20">
        <div className="w-full max-w-md mx-auto px-4">
          <FadeIn className="bg-card border border-border p-8 rounded-2xl space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="font-display text-2xl font-black text-white tracking-tighter">
                SIGN IN TO ZENTARO
              </span>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                Access your orders & profiles
              </p>
            </div>

            {/* Quick login bypass for review */}
            <div className="p-4 bg-volt/5 border border-[#BFFF00]/20 rounded-xl space-y-3">
              <span className="text-[10px] text-volt font-bold uppercase tracking-wider block">
                Local Testing Accounts
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleQuickLogin("customer")}
                  className="py-2 rounded-lg bg-black hover:bg-white/5 border border-border hover:border-volt text-[10px] font-bold text-white flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-volt" />
                  Customer
                </button>
                <button
                  onClick={() => handleQuickLogin("dealer")}
                  className="py-2 rounded-lg bg-black hover:bg-white/5 border border-border hover:border-volt text-[10px] font-bold text-white flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-volt" />
                  Dealer
                </button>
                <button
                  onClick={() => handleQuickLogin("admin")}
                  className="py-2 rounded-lg bg-black hover:bg-white/5 border border-border hover:border-volt text-[10px] font-bold text-white flex flex-col items-center gap-1 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-volt" />
                  Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4 text-xs font-semibold">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-muted block uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.pk"
                    required
                    className="w-full bg-[#0A0A0B] border border-border rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-volt transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-muted block uppercase">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0A0A0B] border border-border rounded-xl pl-10 pr-10 py-3 text-white outline-none focus:border-volt transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all uppercase flex justify-center items-center cursor-pointer"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
