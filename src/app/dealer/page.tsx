"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  Clock,
  Phone,
  Settings,
  ChevronRight,
  TrendingUp,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/motion";
import { getSession, UserSession } from "@/lib/services/auth";

interface DealerLead {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: "new" | "contacted" | "won" | "lost";
  date: string;
}

const mockDealerLeads: DealerLead[] = [
  { id: 101, name: "Hamza Abbasi", phone: "03001112223", email: "hamza@example.pk", source: "Test Ride Booking", status: "new", date: "May 29, 2026" },
  { id: 102, name: "Bilal Farooq", phone: "03214445556", email: "bilal@gmail.pk", source: "Installment Application", status: "contacted", date: "May 28, 2026" },
  { id: 103, name: "Aisha Bibi", phone: "03338889999", email: "aisha@outlook.pk", source: "Reservation Checkout", status: "won", date: "May 27, 2026" },
];

export default function DealerPortalPage() {
  const router = useRouter();
  const [dealerUser, setDealerUser] = useState<UserSession | null>(null);
  const [leads, setLeads] = useState<DealerLead[]>(mockDealerLeads);
  const [dealerStatus, setDealerStatus] = useState("Open (Accepting Bookings)");

  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "dealer") {
      router.push("/login");
    } else {
      setDealerUser(session);
    }
  }, []);

  const handleUpdateStatus = (leadId: number, nextStatus: DealerLead["status"]) => {
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l)));
  };

  const handleToggleShowroomStatus = () => {
    setDealerStatus((prev) =>
      prev.includes("Open") ? "Closed (Temporary Service Mode)" : "Open (Accepting Bookings)"
    );
  };

  if (!dealerUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted text-sm font-semibold animate-pulse">Authenticating Dealer Portal...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24 text-xs font-semibold text-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Showroom Welcome Banner */}
          <FadeIn className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-volt/10 border border-volt/20 flex items-center justify-center text-volt">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-volt font-bold uppercase tracking-wider block">Authorized Dealer Panel</span>
                <h1 className="font-display text-xl font-bold text-white leading-none">
                  {dealerUser.name} - Clifton Branch
                </h1>
                <p className="text-[11px] text-muted font-medium">📍 Karachi Region Showroom & Service Hub</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="text-right">
                <span className="text-[10px] text-muted block uppercase">Showroom status</span>
                <span className="font-bold text-white block mt-0.5">{dealerStatus}</span>
              </div>
              <button
                onClick={handleToggleShowroomStatus}
                className="px-4 py-2 rounded-lg bg-white/5 border border-border hover:border-volt hover:text-volt text-xs font-bold transition-all cursor-pointer"
              >
                Toggle Status
              </button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assigned Leads Grid */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-border pb-3">
                <Users className="w-5 h-5 text-volt" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Showroom Assigned Leads</h3>
              </div>

              <div className="space-y-3">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-[#0A0A0B] border border-border p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{lead.name}</span>
                        <span className="text-[9px] text-volt border border-volt/20 px-2 py-0.5 rounded bg-volt/5 uppercase font-bold tracking-wider">
                          {lead.source}
                        </span>
                      </div>
                      <div className="text-muted text-[10px] font-medium leading-none">
                        <span>📞 {lead.phone}</span>
                        <span className="mx-2">•</span>
                        <span>✉️ {lead.email}</span>
                        <span className="mx-2">•</span>
                        <span>{lead.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Outbound WhatsApp CTA */}
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(lead.name)},%20this%20is%20Zentaro%20Clifton%20Showroom...`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>

                      {/* Lead Status Select */}
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as any)}
                        className="bg-[#121214] text-white border border-border px-3 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="won">Won (Delivered)</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-8">
              {/* Showroom metrics */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <TrendingUp className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Branch Performance</h3>
                </div>

                <div className="space-y-4 text-xs font-semibold text-muted">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Leads Assigned this Month:</span>
                    <span className="text-white font-bold">42</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span>Test Rides Conducted:</span>
                    <span className="text-white font-bold">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handover Deliveries:</span>
                    <span className="text-volt font-bold">9 Bikes</span>
                  </div>
                </div>
              </div>

              {/* Showroom Reminders */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl text-xs font-medium text-muted">
                <div className="flex items-center space-x-2 border-b border-border pb-3">
                  <AlertCircle className="w-5 h-5 text-volt" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Operations Warning</h3>
                </div>

                <p className="leading-relaxed">
                  LFP battery packs must be stored in cool, ventilated zones. Ensure portable chargers are packed inside vehicle cargo compartments before conducting customer handovers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
