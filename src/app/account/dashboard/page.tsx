"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Calendar,
  CreditCard,
  LogOut,
  FileText,
  Download,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn } from "@/components/motion";
import { getSession, clearSession, UserSession } from "@/lib/services/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
    } else {
      setUser(session);
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  // Mock active user transactions
  const mockOrders = [
    {
      id: 1,
      orderRef: "ZN-2026-10254",
      modelName: "ZENTARO Thunder Pro",
      color: "Electric Lime",
      price: 679000,
      paymentType: "token",
      amountPaid: 20000,
      paymentStatus: "paid",
      fulfilmentStatus: "preparing",
      date: "May 28, 2026",
    },
  ];

  const mockTestRides = [
    {
      id: 1,
      modelName: "ZENTARO Thunder",
      showroomName: "ZENTARO Clifton Showroom",
      date: "2026-06-05",
      timeSlot: "11:30 AM - 01:00 PM",
      status: "confirmed",
    },
  ];

  const mockInstallments = [
    {
      id: 1,
      modelName: "ZENTARO Thunder Pro",
      downPayment: 135800,
      tenureMonths: 12,
      estimatedMonthly: 45266,
      status: "approved",
      date: "May 28, 2026",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted text-sm font-semibold animate-pulse">Checking Session...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Dashboard Banner */}
          <FadeIn className="flex flex-col md:flex-row justify-between items-start md:items-center bg-card border border-border p-6 sm:p-8 rounded-2xl gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center text-volt text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
                  <span className="px-2 py-0.5 rounded bg-volt/10 text-volt border border-volt/20 text-[9px] font-bold uppercase">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-muted font-medium mt-0.5">{user.email} • {user.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex-1 md:flex-none text-center px-4 py-2 rounded-lg border border-volt text-volt hover:bg-volt hover:text-background text-xs font-bold transition-all"
                >
                  Admin Panel
                </Link>
              )}
              {user.role === "dealer" && (
                <Link
                  href="/dealer"
                  className="flex-1 md:flex-none text-center px-4 py-2 rounded-lg border border-volt text-volt hover:bg-volt hover:text-background text-xs font-bold transition-all"
                >
                  Dealer Portal
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Reservations & Invoices */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Reservations */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <ShoppingBag className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">My Reservations</h3>
                </div>

                {mockOrders.length === 0 ? (
                  <p className="text-xs text-muted py-6">You have no active vehicle reservations.</p>
                ) : (
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#0A0A0B] border border-border p-4 rounded-xl space-y-4 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-border">
                          <div>
                            <span className="font-bold text-white block">{order.modelName}</span>
                            <span className="text-[10px] text-muted block mt-0.5">Order Ref: {order.orderRef} • {order.date}</span>
                          </div>
                          <div className="flex space-x-2 text-[9px] font-bold uppercase">
                            <span className="px-2 py-0.5 rounded bg-volt/10 text-volt border border-volt/20">
                              Payment: {order.paymentStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-border text-white">
                              Status: {order.fulfilmentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-[11px] font-medium text-muted">
                          <div>
                            <span>Color Swatch: <span className="text-white font-bold">{order.color}</span></span>
                            <span className="mx-2">•</span>
                            <span>Deposit Amount: <span className="text-white font-bold">Rs {order.amountPaid.toLocaleString()}</span></span>
                          </div>

                          <button
                            onClick={() => window.print()}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-border text-[10px] font-bold text-white transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-volt" />
                            Print Receipt Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Installment applications */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <CreditCard className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Installment Application Audits</h3>
                </div>

                {mockInstallments.length === 0 ? (
                  <p className="text-xs text-muted py-6">No pending installment requests found.</p>
                ) : (
                  <div className="space-y-4">
                    {mockInstallments.map((inst) => (
                      <div
                        key={inst.id}
                        className="bg-[#0A0A0B] border border-border p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-semibold text-muted"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-white block">{inst.modelName}</span>
                          <span className="text-[10px] block font-medium">
                            Tenure: {inst.tenureMonths} Months • Down Payment: Rs {inst.downPayment.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <span className="text-xs font-bold text-white block">Rs {inst.estimatedMonthly.toLocaleString()}/mo</span>
                            <span className="text-[9px] block text-muted">Est. Installment</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                            {inst.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Test Rides & Schedule */}
            <div className="space-y-8">
              {/* Test Ride Bookings */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <Calendar className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Scheduled Test Rides</h3>
                </div>

                {mockTestRides.length === 0 ? (
                  <p className="text-xs text-muted py-6">You have no test rides scheduled.</p>
                ) : (
                  <div className="space-y-4">
                    {mockTestRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="bg-[#0A0A0B] border border-border p-4 rounded-xl space-y-3 text-xs"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{ride.modelName}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">
                            {ride.status}
                          </span>
                        </div>

                        <div className="space-y-1 text-muted text-[11px] font-medium leading-relaxed">
                          <p>📍 {ride.showroomName}</p>
                          <p>📅 Date: {ride.date}</p>
                          <p>⏰ Slot: {ride.timeSlot}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  href="/book-test-ride"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-border hover:border-volt hover:text-volt bg-white/5 hover:bg-white/10 text-xs font-bold tracking-tight transition-all duration-200"
                >
                  Schedule Another Test Ride
                </Link>
              </div>

              {/* Saved Comparisons links */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-xs font-medium text-muted">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <AlertCircle className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Reminders</h3>
                </div>
                
                <p className="leading-relaxed">
                  Make sure to bring your CNIC and matching booking token receipts when picking up your reserved vehicle from Clifton / Gulberg showrooms.
                </p>

                <div className="pt-2">
                  <Link
                    href="/compare"
                    className="text-volt font-bold hover:underline flex items-center"
                  >
                    View Saved Comparisons
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Link>
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
