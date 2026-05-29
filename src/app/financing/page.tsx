"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import { Percent, Shield, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";

interface ModelPreset {
  name: string;
  price: number;
  slug: string;
}

const modelPresets: ModelPreset[] = [
  { name: "ZENTARO Thunder Pro", price: 679000, slug: "zentaro-thunder" },
  { name: "ZENTARO Thunder Standard", price: 549000, slug: "zentaro-thunder" },
  { name: "ZENTARO Alpha LFP", price: 429000, slug: "zentaro-alpha" },
  { name: "ZENTARO Breeze Pro", price: 329000, slug: "zentaro-breeze" },
];

const planPresets = [
  {
    name: "ZENTARO Easy Installments",
    markupPct: 0.0, // interest-free
    tenureMonths: 12,
    downPaymentPct: 20.0,
    desc: "Direct interest-free financing from ZENTARO for up to 12 months with zero hidden costs.",
  },
  {
    name: "Standard Bank Lease Partnership",
    markupPct: 11.5,
    tenureMonths: 24,
    downPaymentPct: 25.0,
    desc: "Leasing packages through partnering banks (Meezan / Al Baraka) spread across 24 months.",
  },
  {
    name: "Long-term Commercial Lease",
    markupPct: 14.5,
    tenureMonths: 36,
    downPaymentPct: 30.0,
    desc: "3-year leasing. Ideal for fleet operators, logistics companies, and corporate packages.",
  },
];

// Zod Validation Schema for the Application Lead
const applySchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^((\+92)|(0092)|(03))\d{9}$/, "Please enter a valid Pakistani phone (e.g. 03001234567)"),
  city: z.string().min(3, "City must be at least 3 characters"),
  b_spam: z.string().optional(), // Honeypot spam trap
});

type ApplyFormInputs = z.infer<typeof applySchema>;

export default function FinancingPage() {
  const [selectedModel, setSelectedModel] = useState<ModelPreset>(modelPresets[0]);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20.0);
  const [tenure, setTenure] = useState<number>(12); // Months
  
  // Results
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [markupPct, setMarkupPct] = useState(0);
  const [totalMarkup, setTotalMarkup] = useState(0);
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplyFormInputs>({
    resolver: zodResolver(applySchema),
  });

  // Calculate finance numbers dynamically
  useEffect(() => {
    // Determine markup based on tenure selection matching Pakistani leasing benchmarks
    let activeMarkup = 0;
    if (tenure === 24) activeMarkup = 11.5;
    else if (tenure === 36) activeMarkup = 14.5;
    setMarkupPct(activeMarkup);

    const dpAmt = selectedModel.price * (downPaymentPct / 100);
    const loanAmt = selectedModel.price - dpAmt;
    const markupAmt = loanAmt * (activeMarkup / 100) * (tenure / 12);
    const mInstallment = (loanAmt + markupAmt) / tenure;

    setDownPaymentAmount(Math.round(dpAmt));
    setPrincipal(Math.round(loanAmt));
    setTotalMarkup(Math.round(markupAmt));
    setMonthlyInstallment(Math.round(mInstallment));

    // Debounce track analytics
    const timer = setTimeout(() => {
      trackEvent({
        name: "calculator_used",
        properties: {
          calculator_type: "financing",
          model_slug: selectedModel.slug,
          details: { downPaymentPct, tenure, monthlyInstallment: Math.round(mInstallment) },
        },
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedModel, downPaymentPct, tenure]);

  const onFormSubmit = async (data: ApplyFormInputs) => {
    // 1. Check Honeypot spam trap
    if (data.b_spam) {
      console.warn("Spam honeypot filled. Dropping request silently.");
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        reset();
      }, 1000);
      return;
    }

    // 2. Client-side Rate Limiting (prevent double submissions within 60s)
    const now = Date.now();
    if (lastSubmitTime && now - lastSubmitTime < 60000) {
      alert("Please wait 1 minute before submitting another installment request.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API submit delay (normally writing database leads + applications)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#BFFF00", "#FFFFFF", "#121214"],
      });

      trackEvent({
        name: "lead_generated",
        properties: {
          source: "installment",
          city: data.city,
          model_slug: selectedModel.slug,
        },
      });

      setLastSubmitTime(now);
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
              EASY MONTHLY INSTALLMENTS
            </h1>
            <p className="text-muted text-sm font-medium mt-2 max-w-xl mx-auto">
              Configure down payment ratios, select leasing tenure, and submit applications directly to our underwriting team.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Installments Configurator (Left Side) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#121214] border border-border p-6 rounded-2xl space-y-6">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <Percent className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Installment Parameters</h3>
                </div>

                {/* Model Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block">Target ZENTARO Model</label>
                  <select
                    value={selectedModel.name}
                    onChange={(e) => {
                      const preset = modelPresets.find((m) => m.name === e.target.value);
                      if (preset) setSelectedModel(preset);
                    }}
                    className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                  >
                    {modelPresets.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} (Rs {m.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Down Payment Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                    <span>Down Payment Ratio</span>
                    <span className="text-volt">{downPaymentPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-volt bg-border h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted font-bold">
                    <span>20% (Minimum)</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Tenure Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block">Leasing Tenure</label>
                  <div className="grid grid-cols-3 gap-2 bg-[#0A0A0B] p-1 rounded-xl">
                    {[12, 24, 36].map((months) => (
                      <button
                        key={months}
                        onClick={() => setTenure(months)}
                        className={`py-2 text-xs font-bold rounded-lg transition-all ${
                          tenure === months ? "bg-volt text-background shadow-md" : "text-muted hover:text-white"
                        }`}
                      >
                        {months} Months {months === 12 ? "(0% Markup)" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Installment breakdown card */}
              <div className="bg-volt/5 border border-[#BFFF00]/25 p-6 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Down Payment</span>
                  <span className="text-lg font-black text-white block mt-1">Rs {downPaymentAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Loan Principal</span>
                  <span className="text-lg font-black text-white block mt-1">Rs {principal.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Annual Markup</span>
                  <span className="text-lg font-black text-white block mt-1">{markupPct}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-volt font-bold uppercase tracking-wider block">Monthly Payment</span>
                  <span className="text-xl font-black text-volt glow-text block mt-1">Rs {monthlyInstallment.toLocaleString()}</span>
                </div>
              </div>

              {/* Leasing plan card layouts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planPresets.map((plan) => (
                  <div
                    key={plan.name}
                    className="p-5 bg-card border border-border rounded-xl space-y-2 text-xs"
                  >
                    <span className="font-bold text-white block">{plan.name}</span>
                    <span className="text-volt font-bold block">
                      {plan.markupPct === 0 ? "0% Markup Interest-Free" : `${plan.markupPct}% Flat Markup`}
                    </span>
                    <p className="text-muted leading-relaxed font-medium">{plan.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Lead capture Form (Right Side) */}
            <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl">
              {submitSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-volt mx-auto animate-bounce" />
                  <h3 className="font-display text-2xl font-bold text-white">Application Received</h3>
                  <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
                    Our leasing consultant will review your credit application and contact you on WhatsApp/Phone within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="inline-flex items-center text-xs font-bold text-volt hover:underline"
                  >
                    Apply for another variant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 text-xs font-medium">
                  <div className="border-b border-border pb-3 mb-4">
                    <span className="text-sm font-bold text-white uppercase tracking-wider block">Apply for Installments</span>
                    <span className="text-[11px] text-muted mt-0.5 block">No credit card lock-ins required to apply.</span>
                  </div>

                  {/* Honeypot Field */}
                  <input
                    type="text"
                    {...register("b_spam")}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block font-semibold">Full Name</label>
                    <input
                      type="text"
                      {...register("fullName")}
                      placeholder="Muhammad Ali"
                      className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                    />
                    {errors.fullName && <p className="text-red-400 text-[10px] mt-1">{errors.fullName.message}</p>}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block font-semibold">Email Address</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="ali@example.pk"
                      className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                    />
                    {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block font-semibold">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      {...register("phone")}
                      placeholder="03001234567"
                      className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                    />
                    {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>}
                  </div>

                  {/* City Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block font-semibold">City</label>
                    <input
                      type="text"
                      {...register("city")}
                      placeholder="Karachi, Lahore, Islamabad..."
                      className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                    />
                    {errors.city && <p className="text-red-400 text-[10px] mt-1">{errors.city.message}</p>}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all uppercase flex items-center justify-center cursor-pointer"
                    >
                      {isSubmitting ? "Processing..." : "Submit Installment Application"}
                    </button>
                  </div>

                  <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-muted font-semibold">
                    <Shield className="w-3.5 h-3.5 text-volt" />
                    <span>Your credit information is fully encrypted and stored securely.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
