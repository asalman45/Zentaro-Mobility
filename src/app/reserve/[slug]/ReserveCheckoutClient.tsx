"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, ChevronRight, User, Shield, CreditCard, ArrowLeft, ArrowRight, Zap, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, Reveal } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";
import { getPaymentProvider } from "@/lib/services/payments";

interface ColorOption {
  name: string;
  hex: string;
}

interface Variant {
  id: number;
  name: string;
  batteryType: string;
  price: number;
  originalPrice?: number | null;
  rangeKm: number;
  topSpeedKmh: number;
}

interface ModelData {
  slug: string;
  name: string;
  type: string;
  colors: ColorOption[];
  variants: Variant[];
}

interface ReserveCheckoutClientProps {
  model: ModelData;
}

export default function ReserveCheckoutClient({ model }: ReserveCheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  // Stepper state
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<"full" | "token">("token"); // Default token booking deposit Rs 20,000

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [bSpam, setBSpam] = useState(""); // Honeypot spam trap

  const [isCheckoutRunning, setIsCheckoutRunning] = useState(false);

  useEffect(() => {
    if (model) {
      // Match variant from search parameters or fallback to default
      const vId = Number(searchParams.get("variant"));
      const matchV = model.variants.find((v) => v.id === vId) || model.variants[0];
      setSelectedVariant(matchV);

      // Match color
      const matchC = searchParams.get("color") || model.colors[0]?.name || "";
      setSelectedColor(matchC);
    }
  }, [model, searchParams]);

  if (!model || !selectedVariant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted text-sm font-semibold animate-pulse">Loading Configurator Details...</span>
      </div>
    );
  }

  // Calculate payment details
  const bookingTokenAmount = 20000; // Flat booking token rate in PKR
  const amountToCharge = paymentType === "full" ? selectedVariant.price : bookingTokenAmount;

  const handleNextStep = () => {
    if (step === 2) {
      if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
        alert("Please fill all checkout fields.");
        return;
      }
      const phoneRegex = /^((\+92)|(0092)|(03))\d{9}$/;
      if (!phoneRegex.test(customerPhone)) {
        alert("Please enter a valid Pakistani phone (e.g. 03001234567)");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bSpam) {
      console.warn("Spam honeypot triggered on checkout.");
      setIsCheckoutRunning(true);
      setTimeout(() => {
        setIsCheckoutRunning(false);
        router.push(`/reserve/success?order_ref=ZN-${Math.floor(10000 + Math.random() * 90000)}&status=paid`);
      }, 1000);
      return;
    }

    setIsCheckoutRunning(true);

    try {
      // 1. Generate Order Reference
      const orderRef = `ZN-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      // 2. Fetch payment provider adapter
      const provider = getPaymentProvider();

      // 3. Initiate payment session
      const checkoutResult = await provider.createSession({
        amount: amountToCharge,
        currency: "PKR",
        orderRef,
        customerName,
        customerEmail,
        customerPhone,
        cancelUrl: `${window.location.origin}/reserve/${model.slug}?variant=${selectedVariant.id}&status=cancelled`,
        successUrl: `${window.location.origin}/reserve/success`,
      });

      trackEvent({
        name: "checkout_step_completed",
        properties: {
          step: 3,
          step_name: "payment_initiated",
          order_ref: orderRef,
        },
      });

      if (checkoutResult.success && checkoutResult.sessionUrl) {
        // Redirect browser to payment session URL (Safepay or Mock gateway)
        window.location.href = checkoutResult.sessionUrl;
      } else {
        alert(`Checkout initiation failed: ${checkoutResult.error || "Unknown Error"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Checkout error. Please try again.");
    } finally {
      setIsCheckoutRunning(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex items-center space-x-3 mb-8">
            <Link
              href={`/models/${model.slug}`}
              className="p-2 rounded-lg border border-border text-muted hover:border-volt hover:text-volt transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-3xl font-black text-white tracking-tighter uppercase">
              Reserve Your Ride
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Stepper details */}
            <div className="lg:col-span-7 bg-card border border-border p-6 rounded-2xl space-y-6 shadow-2xl">
              {/* Stepper Header */}
              <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-wider border-b border-border pb-4">
                <span className={step >= 1 ? "text-volt" : ""}>1. Order Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className={step >= 2 ? "text-volt" : ""}>2. Delivery Info</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className={step >= 3 ? "text-volt" : ""}>3. Payment Choice</span>
              </div>

              {/* STEP 1: SUMMARY SUMMARY */}
              {step === 1 && (
                <div className="space-y-4 text-xs font-semibold">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Booking Preference</h3>
                  
                  {/* Select token vs full payment */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType("token")}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                        paymentType === "token"
                          ? "bg-volt/5 border-volt"
                          : "bg-[#0A0A0B] border-border hover:border-white/20"
                      }`}
                    >
                      <ShoppingBag className={`w-5 h-5 ${paymentType === "token" ? "text-volt" : "text-muted"}`} />
                      <div>
                        <span className="font-bold text-white block text-sm">Booking Token</span>
                        <span className="text-[10px] text-muted block mt-0.5">Pay Rs 20,000 to lock price</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType("full")}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                        paymentType === "full"
                          ? "bg-volt/5 border-volt"
                          : "bg-[#0A0A0B] border-border hover:border-white/20"
                      }`}
                    >
                      <CreditCard className={`w-5 h-5 ${paymentType === "full" ? "text-volt" : "text-muted"}`} />
                      <div>
                        <span className="font-bold text-white block text-sm">Full Upfront Payment</span>
                        <span className="text-[10px] text-muted block mt-0.5">Pay Rs {selectedVariant.price.toLocaleString()}</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-4 bg-[#0A0A0B] border border-border rounded-xl space-y-2 text-muted">
                    <p className="text-[11px] font-medium leading-relaxed">
                      💡 Selecting <span className="text-white font-bold">Booking Token</span> locks your configuration and queue priority. The remaining balance can be self-financed, leased via partner banks, or converted into installments at showroom pickup.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: SHIPPING / CUSTOMER INFO */}
              {step === 2 && (
                <div className="space-y-4 text-xs font-semibold">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-border pb-2">
                    Enter Shipping & Contact Details
                  </h3>

                  {/* Honeypot field */}
                  <input
                    type="text"
                    value={bSpam}
                    onChange={(e) => setBSpam(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Muhammad Ali"
                      required
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                    />
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted block">Email Address</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ali@example.pk"
                        required
                        className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted block">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="03001234567"
                        required
                        className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                      />
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Delivery Address (Karachi/Lahore/Islamabad)</label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="House No., Street Name, Sector/Block, City"
                      rows={3}
                      required
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT GATEWAY SELECTION */}
              {step === 3 && (
                <div className="space-y-4 text-xs font-semibold">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Checkout Gateway</h3>
                  
                  <div className="bg-[#0A0A0B] border border-border p-5 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Safepay Payment Gateway</span>
                      <span className="px-2 py-0.5 rounded bg-volt/10 text-volt border border-volt/20 text-[9px] font-bold uppercase">
                        Mock Enabled
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed font-medium">
                      Pay securely with credit cards or local wallets. SafePay checkout is compliant with Pakistani financial systems.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-muted font-bold">
                    <Shield className="w-3.5 h-3.5 text-volt" />
                    <span>Refund policy: booking tokens are fully refundable up to vehicle shipment dispatch.</span>
                  </div>
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border text-muted hover:border-white hover:text-white transition-all text-xs font-bold tracking-tight cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckoutSubmit}
                    disabled={isCheckoutRunning}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all cursor-pointer"
                  >
                    {isCheckoutRunning ? "Initiating Gateway..." : `Checkout Rs ${amountToCharge.toLocaleString()}`}
                  </button>
                )}
              </div>
            </div>

            {/* Configured Summary Panel (Right Side) */}
            <div className="lg:col-span-5 bg-[#121214] border border-border p-6 rounded-2xl space-y-4">
              <div className="border-b border-border pb-3">
                <span className="text-[10px] text-volt font-bold uppercase tracking-wider block">Reservation Summary</span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">{model.name}</h3>
              </div>

              {/* Color swatch */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Color Swatch:</span>
                <span className="font-bold text-white">{selectedColor}</span>
              </div>

              {/* Variant Specs */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Battery variant:</span>
                <span className="font-bold text-white">{selectedVariant.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Battery Type:</span>
                <span className="font-bold text-white uppercase">{selectedVariant.batteryType} Cell</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-border pb-3">
                <span className="text-muted">Est. Range:</span>
                <span className="font-bold text-white">{selectedVariant.rangeKm} km</span>
              </div>

              {/* Total charges */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted">Net Vehicle Price:</span>
                  <span className="font-semibold text-white">Rs {selectedVariant.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="font-bold text-white">Due Checkout:</span>
                  <span className="font-black text-volt">Rs {amountToCharge.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
