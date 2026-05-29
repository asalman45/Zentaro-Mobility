"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  ShieldAlert,
  Users,
  Layers,
  Settings,
  TrendingUp,
  Download,
  Plus,
  Edit2,
  Trash2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession, UserSession } from "@/lib/services/auth";

// Mock metrics data for admin dashboard
const salesTrendData = [
  { name: "Week 1", sales: 12 },
  { name: "Week 2", sales: 19 },
  { name: "Week 3", sales: 15 },
  { name: "Week 4", sales: 26 },
];

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "won" | "lost";
  assignedDealer: string;
  date: string;
}

const mockLeads: Lead[] = [
  { id: 1, name: "Muhammad Ali", phone: "03001234567", email: "ali@example.pk", city: "Karachi", source: "Installment Application", status: "new", assignedDealer: "Clifton Showroom", date: "May 28, 2026" },
  { id: 2, name: "Dr. Ayesha Malik", phone: "03001112223", email: "ayesha@hospital.pk", city: "Lahore", source: "Test Ride Booking", status: "contacted", assignedDealer: "Gulberg Showroom", date: "May 27, 2026" },
  { id: 3, name: "Zeeshan Butt", phone: "03007654321", email: "zeeshan@example.pk", city: "Rawalpindi", source: "Reservation Checkout", status: "won", assignedDealer: "Saddar Showroom", date: "May 28, 2026" },
  { id: 4, name: "Sara Khan", phone: "03339876543", email: "sara@gmail.pk", city: "Karachi", source: "Newsletter Signup", status: "lost", assignedDealer: "None", date: "May 25, 2026" },
];

export default function AdminPortalPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "crm" | "cms" | "settings">("dashboard");

  // Leads state for Kanban updates
  const [leadsList, setLeadsList] = useState<Lead[]>(mockLeads);

  // Settings configs
  const [petrolPrice, setPetrolPrice] = useState(272.5);
  const [electricityRate, setElectricityRate] = useState(50.0);
  const [whatsappNumber, setWhatsappNumber] = useState("+923001234567");

  // Check admin role authentication
  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.push("/login");
    } else {
      setAdminUser(session);
    }
  }, []);

  const handleUpdateLeadStatus = (leadId: number, nextStatus: Lead["status"]) => {
    const updated = leadsList.map((lead) =>
      lead.id === leadId ? { ...lead, status: nextStatus } : lead
    );
    setLeadsList(updated);
  };

  const handleExportCSV = () => {
    // Generate simple csv file layout string and trigger save
    const headers = "ID,Name,Phone,Email,City,Source,Status,AssignedDealer,Date\n";
    const rows = leadsList
      .map(
        (l) =>
          `${l.id},"${l.name}",${l.phone},${l.email},${l.city},"${l.source}",${l.status},"${l.assignedDealer}",${l.date}`
      )
      .join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `ZENTARO_leads_export_${Date.now()}.csv`);
    a.click();
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted text-sm font-semibold animate-pulse">Authenticating Admin Portal...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24 text-xs font-semibold text-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-volt" />
              <h1 className="font-display text-2xl font-black text-white tracking-tighter uppercase">
                ADMIN OPERATIONS PORTAL
              </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1.5 bg-[#121214] p-1 rounded-xl border border-border w-full md:w-auto overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "dashboard" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("crm")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "crm" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                CRM Leads
              </button>
              <button
                onClick={() => setActiveTab("cms")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "cms" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                Catalog CMS
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "settings" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="p-6 bg-card border border-border rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Total Orders</span>
                  <span className="block font-display text-3xl font-black text-white mt-1">264</span>
                </div>
                <div className="p-6 bg-card border border-[#BFFF00]/20 rounded-2xl bg-volt/5">
                  <span className="text-[10px] font-bold text-volt uppercase block">PKR Revenue</span>
                  <span className="block font-display text-3xl font-black text-volt glow-text mt-1">Rs 142.6M</span>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Conversion Rate</span>
                  <span className="block font-display text-3xl font-black text-white mt-1">8.42%</span>
                </div>
                <div className="p-6 bg-card border border-border rounded-2xl">
                  <span className="text-[10px] font-bold text-muted uppercase block">Total Leads</span>
                  <span className="block font-display text-3xl font-black text-white mt-1">{leadsList.length}</span>
                </div>
              </div>

              {/* Order volume trend line graph */}
              <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Weekly Bookings Trends</span>
                  <span className="text-[10px] text-muted font-bold">Updated live</span>
                </div>
                <div className="w-full h-[250px] text-xs">
                  <ResponsiveContainer width="100%" h-full="true">
                    <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#52525B" tickLine={false} />
                      <YAxis stroke="#52525B" tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#121214", borderColor: "#27272A" }}
                        labelStyle={{ fontWeight: "bold", color: "#FFFFFF" }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#BFFF00" strokeWidth={3} dot={{ fill: "#BFFF00" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CRM KANBAN PIPELINE */}
          {activeTab === "crm" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-sm font-bold text-white uppercase tracking-wider">CRM Lead Pipelines</span>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white/5 border border-border text-xs font-bold text-white hover:border-volt hover:text-volt transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5 text-volt" />
                  Export CSV
                </button>
              </div>

              {/* Kanban board layout */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                {(["new", "contacted", "qualified", "won", "lost"] as const).map((colStatus) => {
                  const filtered = leadsList.filter((l) => l.status === colStatus);
                  return (
                    <div key={colStatus} className="p-4 bg-card border border-border rounded-xl space-y-4 min-h-[400px]">
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider capitalize">
                          {colStatus} ({filtered.length})
                        </span>
                      </div>

                      <div className="space-y-3">
                        {filtered.map((lead) => (
                          <div
                            key={lead.id}
                            className="p-3 bg-[#0A0A0B] border border-border rounded-lg space-y-2 text-[10px] font-medium"
                          >
                            <span className="font-bold text-white block">{lead.name}</span>
                            <span className="text-muted block">{lead.phone} • {lead.city}</span>
                            <span className="text-[9px] text-volt block uppercase tracking-wider">{lead.source}</span>
                            
                            {/* Update Status Dropdown */}
                            <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                              <span className="text-muted/60">Status:</span>
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                                className="bg-[#121214] text-white border-none outline-none focus:ring-0 cursor-pointer font-bold rounded"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="won">Won</option>
                                <option value="lost">Lost</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CATALOG CRUD CMS */}
          {activeTab === "cms" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <span className="text-sm font-bold text-white uppercase tracking-wider">CMS Pricing & Models Catalog</span>
                <button className="px-4 py-2 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold flex items-center shadow-[0_0_12px_rgba(191,255,0,0.3)]">
                  <Plus className="w-4 h-4 mr-1" />
                  Add New Model
                </button>
              </div>

              <div className="overflow-x-auto text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-white text-[10px] font-bold uppercase tracking-wider pb-2">
                      <th className="py-3">Slug</th>
                      <th className="py-3">Name</th>
                      <th className="py-3">Variant Price</th>
                      <th className="py-3">Battery Variant</th>
                      <th className="py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-white font-medium text-xs">
                    <tr>
                      <td className="py-3.5 font-bold">zentaro-thunder</td>
                      <td className="py-3.5">ZENTARO Thunder</td>
                      <td className="py-3.5 font-bold">Rs 549,000</td>
                      <td className="py-3.5 text-muted">LFP Standard</td>
                      <td className="py-3.5 flex items-center space-x-2">
                        <button className="p-1 hover:text-volt outline-none"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1 hover:text-red-400 outline-none"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">zentaro-alpha</td>
                      <td className="py-3.5">ZENTARO Alpha</td>
                      <td className="py-3.5 font-bold">Rs 429,000</td>
                      <td className="py-3.5 text-muted">LFP Long-Range</td>
                      <td className="py-3.5 flex items-center space-x-2">
                        <button className="p-1 hover:text-volt outline-none"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1 hover:text-red-400 outline-none"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-bold">zentaro-breeze</td>
                      <td className="py-3.5">ZENTARO Breeze</td>
                      <td className="py-3.5 font-bold">Rs 329,000</td>
                      <td className="py-3.5 text-muted">LFP Pro Smart</td>
                      <td className="py-3.5 flex items-center space-x-2">
                        <button className="p-1 hover:text-volt outline-none"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1 hover:text-red-400 outline-none"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS CRUD CMS */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in">
              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                <span className="text-sm font-bold text-white uppercase tracking-wider block border-b border-border pb-2">
                  System Calculations Config
                </span>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Default Petrol Price (Rs / Litre)</label>
                    <input
                      type="number"
                      value={petrolPrice}
                      onChange={(e) => setPetrolPrice(Number(e.target.value))}
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Utility Electricity Tariff (Rs / Unit)</label>
                    <input
                      type="number"
                      value={electricityRate}
                      onChange={(e) => setElectricityRate(Number(e.target.value))}
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                    />
                  </div>

                  <button className="w-full py-3 bg-volt hover:bg-volt-hover text-background font-bold text-xs rounded-xl shadow-md uppercase">
                    Save Config Settings
                  </button>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-2xl space-y-4">
                <span className="text-sm font-bold text-white uppercase tracking-wider block border-b border-border pb-2">
                  Brand Contact Options
                </span>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Official WhatsApp Helpline</label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                    />
                  </div>

                  <div className="p-4 bg-[#0A0A0B] border border-border rounded-xl space-y-2 text-muted">
                    <p className="text-[10px] font-medium leading-relaxed">
                      This WhatsApp helpline is prefilled on floating click-to-chat widgets across all product detail templates. Ensure it has the correct international suffix (e.g. +92).
                    </p>
                  </div>

                  <button className="w-full py-3 bg-volt hover:bg-volt-hover text-background font-bold text-xs rounded-xl shadow-md uppercase">
                    Save Brand Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
