"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight, Printer } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderRef, setOrderRef] = useState("ZN-2026-MOCK");
  const [paymentStatus, setPaymentStatus] = useState("paid");

  useEffect(() => {
    const ref = searchParams.get("order_ref") || searchParams.get("reference") || `ZN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const status = searchParams.get("status") || "paid";
    setOrderRef(ref);
    setPaymentStatus(status);

    // Track checkout completion
    trackEvent({
      name: "checkout_step_completed",
      properties: {
        step: 4,
        step_name: "payment_success",
        order_ref: ref,
      },
    });

    // Fire confetti splash!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#BFFF00", "#FFFFFF", "#121214"],
    });
  }, [searchParams]);

  return (
    <main className="flex-grow flex items-center justify-center pt-10 pb-20">
      <div className="w-full max-w-xl mx-auto px-4">
        <FadeIn className="bg-card border border-border p-8 rounded-2xl text-center space-y-6 shadow-2xl">
          <CheckCircle2 className="w-20 h-20 text-volt mx-auto animate-bounce" />
          
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-black text-white tracking-tighter">
              RESERVATION COMPLETED
            </h1>
            <p className="text-xs text-volt font-bold uppercase tracking-wider">
              Thank you for choosing ZENTARO
            </p>
          </div>

          <div className="p-5 bg-[#0A0A0B] border border-border rounded-xl text-left text-xs font-semibold text-muted space-y-3 max-w-sm mx-auto">
            <div className="flex justify-between border-b border-border pb-2">
              <span>Order Reference:</span>
              <span className="text-white font-bold">{orderRef}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span>Payment Status:</span>
              <span className="text-emerald-400 font-bold uppercase">{paymentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipment:</span>
              <span className="text-white font-bold">14 - 21 Days</span>
            </div>
          </div>

          <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
            Your vehicle booking has been logged. An email invoice confirmation has been sent to your address. Our logistics coordinator will reach out to schedule showroom handover.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-sm mx-auto pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-border text-xs font-bold text-white transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-1.5 text-volt" />
              Print Invoice
            </button>

            <Link
              href="/account/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold uppercase tracking-wide shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}

export default function ReserveSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={
        <main className="flex-grow flex items-center justify-center pt-10 pb-20">
          <span className="text-muted text-sm font-semibold animate-pulse">Loading Success Details...</span>
        </main>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
