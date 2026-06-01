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
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Receipt,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSession, UserSession } from "@/lib/services/auth";
import {
  getAdminStatsAction,
  getLeadsAction,
  updateLeadStatusAction,
  getModelsAdminAction,
  createModelAction,
  updateModelAction,
  deleteModelAction,
  getSettingsAction,
  updateSettingsAction,
  getOrdersAction,
  updateOrderStatusAction,
  createVariantAction,
  updateVariantAction,
  deleteVariantAction,
  seedSampleSystemDataAction,
} from "@/app/actions/admin";

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

interface Variant {
  id: number;
  modelId: number;
  name: string;
  batteryType: "LFP" | "Lithium" | "Graphene";
  price: number;
  originalPrice: number | null;
  topSpeedKmh: number;
  rangeKm: number;
  chargingTimeHrs: number;
  batteryLifeYears: number;
  motorWatts: number;
  voltage: number;
  ampHours: number;
  chargeCycles: number;
  warrantyMonths: number;
  weightKg: number;
  loadKg: number;
  brakes: string;
  suspension: string;
  tyres: string;
  ipRating: string;
  smartFeatures: string[];
}

interface ModelCMS {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  type: "motorcycle" | "scooter" | "three_wheeler";
  description: string;
  status: "draft" | "published";
  featured: boolean;
  heroImage: string;
  basePrice: number;
  originalPrice: number | null;
  inStock: boolean;
  variants: Variant[];
  colors: { name: string; hex: string; image: string }[];
}

interface Order {
  id: number;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  modelName: string;
  variantName: string;
  color: string;
  unitPrice: number;
  amountPaid: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  fulfilmentStatus: "pending" | "preparing" | "shipped" | "delivered" | "cancelled";
  paymentProvider: string;
  date: string;
  shippingAddress: string;
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "crm" | "orders" | "cms" | "settings">("dashboard");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    totalLeads: 0,
    salesTrendData: [] as { name: string; sales: number }[],
  });

  // Leads state
  const [leadsList, setLeadsList] = useState<Lead[]>([]);

  // Orders state
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersFilterStatus, setOrdersFilterStatus] = useState("all");

  // CMS state
  const [modelsList, setModelsList] = useState<ModelCMS[]>([]);
  const [expandedModelId, setExpandedModelId] = useState<number | null>(null);
  
  // Model Dialog
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
  const [currentModelId, setCurrentModelId] = useState<number | null>(null);
  const [formSlug, setFormSlug] = useState("");
  const [formName, setFormName] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formType, setFormType] = useState<"motorcycle" | "scooter" | "three_wheeler">("motorcycle");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState<"draft" | "published">("published");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formBasePrice, setFormBasePrice] = useState(300000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | "">("");
  const [formInStock, setFormInStock] = useState(true);
  const [formHeroImage, setFormHeroImage] = useState("/images/models/bolt-hero.png");
  const [formColorsJson, setFormColorsJson] = useState("");

  // Variant Dialog
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [currentVariantId, setCurrentVariantId] = useState<number | null>(null);
  const [variantModelId, setVariantModelId] = useState<number | null>(null);
  const [formVarName, setFormVarName] = useState("");
  const [formVarBatteryType, setFormVarBatteryType] = useState<"LFP" | "Lithium" | "Graphene">("LFP");
  const [formVarPrice, setFormVarPrice] = useState(300000);
  const [formVarOriginalPrice, setFormVarOriginalPrice] = useState<number | "">("");
  const [formVarSpeed, setFormVarSpeed] = useState(85);
  const [formVarRange, setFormVarRange] = useState(120);
  const [formVarChargeTime, setFormVarChargeTime] = useState(4.0);
  const [formVarBatteryLife, setFormVarBatteryLife] = useState(15.0);
  const [formVarMotorWatts, setFormVarMotorWatts] = useState(1500);
  const [formVarVoltage, setFormVarVoltage] = useState(72);
  const [formVarAmphours, setFormVarAmphours] = useState(40);
  const [formVarChargeCycles, setFormVarChargeCycles] = useState(3000);
  const [formVarWarranty, setFormVarWarranty] = useState(36);
  const [formVarWeight, setFormVarWeight] = useState(95);
  const [formVarLoad, setFormVarLoad] = useState(150);
  const [formVarBrakes, setFormVarBrakes] = useState("Front Disk / Rear Drum");
  const [formVarSuspension, setFormVarSuspension] = useState("Hydraulic Telescopic");
  const [formVarTyres, setFormVarTyres] = useState("90/90-12 Tubeless");
  const [formVarIpRating, setFormVarIpRating] = useState("IP67");
  const [formVarSmartFeatures, setFormVarSmartFeatures] = useState("NFC Unlock, Anti-theft GPS");

  // Deletions
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [modelToDeleteId, setModelToDeleteId] = useState<number | null>(null);
  const [isVariantDeleteOpen, setIsVariantDeleteOpen] = useState(false);
  const [variantToDeleteId, setVariantToDeleteId] = useState<number | null>(null);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Settings configs
  const [petrolPrice, setPetrolPrice] = useState(272.5);
  const [electricityRate, setElectricityRate] = useState(50.0);
  const [whatsappNumber, setWhatsappNumber] = useState("+923001234567");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Check admin role authentication and load settings
  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "admin") {
      router.push("/login");
    } else {
      setAdminUser(session);
      loadAllData();
    }
  }, []);

  const loadAllData = async () => {
    setIsLoadingData(true);
    try {
      const [statsRes, leadsRes, ordersRes, modelsRes, settingsRes] = await Promise.all([
        getAdminStatsAction(),
        getLeadsAction(),
        getOrdersAction(),
        getModelsAdminAction(),
        getSettingsAction(),
      ]);

      setStats(statsRes);
      setLeadsList(leadsRes as any[]);
      setOrdersList(ordersRes as any[]);
      setModelsList(modelsRes as any[]);
      setPetrolPrice(settingsRes.petrolPrice);
      setElectricityRate(settingsRes.electricityRate);
      setWhatsappNumber(settingsRes.whatsappNumber);
    } catch (err) {
      console.error("Failed to load data from database", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: number, nextStatus: Lead["status"]) => {
    try {
      const res = await updateLeadStatusAction(leadId, nextStatus);
      if (res.success) {
        setLeadsList((prev) =>
          prev.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead))
        );
        const statsRes = await getAdminStatsAction();
        setStats(statsRes);
      } else {
        alert(res.error || "Failed to update lead status");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving lead status");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    field: "paymentStatus" | "fulfilmentStatus",
    nextValue: any
  ) => {
    try {
      const res = await updateOrderStatusAction(orderId, field, nextValue);
      if (res.success) {
        setOrdersList((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, [field]: nextValue } : order))
        );
        // Refresh dashboard stats on status updates
        const statsRes = await getAdminStatsAction();
        setStats(statsRes);
      } else {
        alert(res.error || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving order status changes");
    }
  };

  const handleExportCSV = () => {
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

  // Seeding sample data
  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    try {
      const res = await seedSampleSystemDataAction();
      if (res.success) {
        await loadAllData();
        alert("Success! 10 orders and 6 CRM leads have been generated.");
      } else {
        alert(res.error || "Failed to seed demo data");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await updateSettingsAction({
        petrolPrice,
        electricityRate,
        whatsappNumber,
      });
      if (res.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        alert(res.error || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings to DB");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Model CMS forms handlers
  const openModelDialog = (model: ModelCMS | null = null) => {
    if (model) {
      setCurrentModelId(model.id);
      setFormSlug(model.slug);
      setFormName(model.name);
      setFormTagline(model.tagline);
      setFormType(model.type);
      setFormDescription(model.description);
      setFormStatus(model.status);
      setFormFeatured(model.featured);
      setFormBasePrice(model.basePrice);
      setFormOriginalPrice(model.originalPrice === null ? "" : model.originalPrice);
      setFormHeroImage(model.heroImage);
      setFormColorsJson(JSON.stringify(model.colors || [], null, 2));
    } else {
      setCurrentModelId(null);
      setFormSlug("zentaro-new-model");
      setFormName("");
      setFormTagline("");
      setFormType("motorcycle");
      setFormDescription("");
      setFormStatus("published");
      setFormFeatured(false);
      setFormBasePrice(350000);
      setFormOriginalPrice("");
      setFormHeroImage("/images/models/bolt-hero.png");
      setFormColorsJson(
        JSON.stringify(
          [
            { name: "Neon Volt", hex: "#BFFF00", image: "/images/models/bolt-hero.png" },
            { name: "Carbon Black", hex: "#1A1A1F", image: "/images/models/bolt-hero.png" },
          ],
          null,
          2
        )
      );
    }
    setIsModelDialogOpen(true);
  };

  const handleModelFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      let colorsArray = [];
      try {
        colorsArray = JSON.parse(formColorsJson);
      } catch {
        alert("Colors JSON is invalid formatting. Please check syntax.");
        setFormSubmitting(false);
        return;
      }

      const payload = {
        slug: formSlug,
        name: formName,
        tagline: formTagline,
        type: formType,
        description: formDescription,
        status: formStatus,
        featured: formFeatured,
        basePrice: Number(formBasePrice),
        originalPrice: formOriginalPrice === "" ? null : Number(formOriginalPrice),
        inStock: formInStock,
        heroImage: formHeroImage,
        colors: colorsArray,
        images: [formHeroImage],
      };

      let res;
      if (currentModelId) {
        res = await updateModelAction(currentModelId, payload);
      } else {
        res = await createModelAction(payload);
      }

      if (res.success) {
        setIsModelDialogOpen(false);
        await loadAllData();
      } else {
        alert(res.error || "Failed to save model");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving model");
    } finally {
      setFormSubmitting(false);
    }
  };

  const triggerDeleteModel = (id: number) => {
    setModelToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteModel = async () => {
    if (!modelToDeleteId) return;
    try {
      const res = await deleteModelAction(modelToDeleteId);
      if (res.success) {
        setIsDeleteDialogOpen(false);
        setModelToDeleteId(null);
        await loadAllData();
      } else {
        alert(res.error || "Failed to delete model");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting model");
    }
  };

  // Variant dialog handlers
  const openVariantDialog = (modelId: number, variant: Variant | null = null) => {
    setVariantModelId(modelId);
    if (variant) {
      setCurrentVariantId(variant.id);
      setFormVarName(variant.name);
      setFormVarBatteryType(variant.batteryType);
      setFormVarPrice(variant.price);
      setFormVarOriginalPrice(variant.originalPrice === null ? "" : variant.originalPrice);
      setFormVarSpeed(variant.topSpeedKmh);
      setFormVarRange(variant.rangeKm);
      setFormVarChargeTime(variant.chargingTimeHrs);
      setFormVarBatteryLife(variant.batteryLifeYears);
      setFormVarMotorWatts(variant.motorWatts);
      setFormVarVoltage(variant.voltage);
      setFormVarAmphours(variant.ampHours);
      setFormVarChargeCycles(variant.chargeCycles);
      setFormVarWarranty(variant.warrantyMonths);
      setFormVarWeight(variant.weightKg);
      setFormVarLoad(variant.loadKg);
      setFormVarBrakes(variant.brakes);
      setFormVarSuspension(variant.suspension);
      setFormVarTyres(variant.tyres);
      setFormVarIpRating(variant.ipRating);
      setFormVarSmartFeatures(variant.smartFeatures.join(", "));
    } else {
      setCurrentVariantId(null);
      setFormVarName("");
      setFormVarBatteryType("LFP");
      setFormVarPrice(350000);
      setFormVarOriginalPrice("");
      setFormVarSpeed(85);
      setFormVarRange(120);
      setFormVarChargeTime(4.0);
      setFormVarBatteryLife(15.0);
      setFormVarMotorWatts(1500);
      setFormVarVoltage(72);
      setFormVarAmphours(40);
      setFormVarChargeCycles(3000);
      setFormVarWarranty(36);
      setFormVarWeight(95);
      setFormVarLoad(150);
      setFormVarBrakes("Front Disk / Rear Drum");
      setFormVarSuspension("Hydraulic Telescopic");
      setFormVarTyres("90/90-12 Tubeless");
      setFormVarIpRating("IP67");
      setFormVarSmartFeatures("NFC Unlock, Anti-theft GPS");
    }
    setIsVariantDialogOpen(true);
  };

  const handleVariantFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantModelId) return;

    setFormSubmitting(true);
    try {
      const payload = {
        modelId: variantModelId,
        name: formVarName,
        batteryType: formVarBatteryType,
        price: Number(formVarPrice),
        originalPrice: formVarOriginalPrice === "" ? null : Number(formVarOriginalPrice),
        topSpeedKmh: Number(formVarSpeed),
        rangeKm: Number(formVarRange),
        chargingTimeHrs: Number(formVarChargeTime),
        batteryLifeYears: Number(formVarBatteryLife),
        motorWatts: Number(formVarMotorWatts),
        voltage: Number(formVarVoltage),
        ampHours: Number(formVarAmphours),
        chargeCycles: Number(formVarChargeCycles),
        warrantyMonths: Number(formVarWarranty),
        weightKg: Number(formVarWeight),
        loadKg: Number(formVarLoad),
        brakes: formVarBrakes,
        suspension: formVarSuspension,
        tyres: formVarTyres,
        ipRating: formVarIpRating,
        smartFeatures: formVarSmartFeatures.split(",").map((s) => s.trim()).filter(Boolean),
      };

      let res;
      if (currentVariantId) {
        res = await updateVariantAction(currentVariantId, payload);
      } else {
        res = await createVariantAction(payload);
      }

      if (res.success) {
        setIsVariantDialogOpen(false);
        await loadAllData();
      } else {
        alert(res.error || "Failed to save variant");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving variant specs");
    } finally {
      setFormSubmitting(false);
    }
  };

  const triggerDeleteVariant = (id: number) => {
    setVariantToDeleteId(id);
    setIsVariantDeleteOpen(true);
  };

  const confirmDeleteVariant = async () => {
    if (!variantToDeleteId) return;
    try {
      const res = await deleteVariantAction(variantToDeleteId);
      if (res.success) {
        setIsVariantDeleteOpen(false);
        setVariantToDeleteId(null);
        await loadAllData();
      } else {
        alert(res.error || "Failed to delete variant");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting variant");
    }
  };

  const toggleModelRow = (modelId: number) => {
    setExpandedModelId((prev) => (prev === modelId ? null : modelId));
  };

  // Filter orders
  const filteredOrders = ordersList.filter((order) => {
    const query = ordersSearch.toLowerCase();
    const matchesQuery =
      order.orderRef.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.modelName.toLowerCase().includes(query);
    
    const matchesFilter =
      ordersFilterStatus === "all" || order.fulfilmentStatus === ordersFilterStatus;

    return matchesQuery && matchesFilter;
  });

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted text-sm font-semibold animate-pulse">
          Authenticating Admin Portal...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050506]">
      <Header />

      <main className="flex-grow pt-10 pb-24 text-xs font-semibold text-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Headline */}
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
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-volt text-background"
                    : "text-muted hover:text-white"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("crm")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "crm" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                CRM Leads
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "orders" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                Order Manager
              </button>
              <button
                onClick={() => setActiveTab("cms")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "cms" ? "bg-volt text-background" : "text-muted hover:text-white"
                }`}
              >
                Product CMS
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-volt text-background"
                    : "text-muted hover:text-white"
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Seed Data Banner on Dashboard if database has 0 orders */}
          {activeTab === "dashboard" && stats.totalOrders === 0 && (
            <div className="mb-6 p-4 bg-volt/10 border border-volt/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-white">
              <div>
                <span className="font-bold flex items-center gap-1.5 text-volt text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Seeding Demo Sandbox
                </span>
                <p className="text-[11px] text-muted font-medium mt-1 leading-relaxed">
                  The orders and leads tables in the database are currently empty. Click the button to load sample operational data and generate the line charts!
                </p>
              </div>
              <button
                onClick={handleSeedDemoData}
                disabled={isSeeding}
                className="px-4 py-2 bg-volt hover:bg-volt-hover disabled:bg-muted text-background font-bold text-xs rounded-xl shadow-md cursor-pointer border-none flex items-center transition-all"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Seeding...
                  </>
                ) : (
                  "Seed Sample Data"
                )}
              </button>
            </div>
          )}

          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-8 h-8 text-volt animate-spin" />
              <span className="text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                Fetching Real Database Records...
              </span>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD METRICS */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                    <div className="p-6 bg-[#0D0D0F] border border-border rounded-2xl">
                      <span className="text-[10px] font-bold text-muted uppercase block">
                        Total Orders
                      </span>
                      <span className="block font-display text-3xl font-black text-white mt-1">
                        {stats.totalOrders}
                      </span>
                    </div>
                    <div className="p-6 bg-[#0D0D0F] border border-[#BFFF00]/20 rounded-2xl bg-volt/5">
                      <span className="text-[10px] font-bold text-volt uppercase block">
                        PKR Revenue
                      </span>
                      <span className="block font-display text-3xl font-black text-volt glow-text mt-1">
                        Rs {stats.totalRevenue > 1000000 
                          ? `${(stats.totalRevenue / 1000000).toFixed(1)}M` 
                          : stats.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-6 bg-[#0D0D0F] border border-border rounded-2xl">
                      <span className="text-[10px] font-bold text-muted uppercase block">
                        Conversion Rate
                      </span>
                      <span className="block font-display text-3xl font-black text-white mt-1">
                        {stats.conversionRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="p-6 bg-[#0D0D0F] border border-border rounded-2xl">
                      <span className="text-[10px] font-bold text-muted uppercase block">
                        Total Leads
                      </span>
                      <span className="block font-display text-3xl font-black text-white mt-1">
                        {stats.totalLeads}
                      </span>
                    </div>
                  </div>

                  {/* Order volume trend line graph */}
                  <div className="p-6 bg-[#0D0D0F] border border-border rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Live System Bookings & Reservations Trends
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted font-bold">Dynamically generated</span>
                        {stats.totalOrders > 0 && (
                          <button
                            onClick={handleSeedDemoData}
                            disabled={isSeeding}
                            className="bg-white/5 border border-border text-[9px] hover:border-volt px-2.5 py-1 text-white rounded font-bold cursor-pointer transition-all flex items-center"
                          >
                            Reset / Re-seed Data
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-[250px] text-xs">
                      {stats.salesTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={stats.salesTrendData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                          >
                            <XAxis dataKey="name" stroke="#52525B" tickLine={false} />
                            <YAxis stroke="#52525B" tickLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#121214", borderColor: "#27272A" }}
                              labelStyle={{ fontWeight: "bold", color: "#FFFFFF" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="sales"
                              stroke="#BFFF00"
                              strokeWidth={3}
                              dot={{ fill: "#BFFF00" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          No trend data available. Try seeding mock bookings above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CRM KANBAN PIPELINE */}
              {activeTab === "crm" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      CRM Lead Pipelines
                    </span>
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
                        <div
                          key={colStatus}
                          className="p-4 bg-[#0D0D0F] border border-border rounded-xl space-y-4 min-h-[400px]"
                        >
                          <div className="flex justify-between items-center border-b border-border pb-2">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider capitalize">
                              {colStatus} ({filtered.length})
                            </span>
                          </div>

                          <div className="space-y-3">
                            {filtered.map((lead) => (
                              <div
                                key={lead.id}
                                className="p-3 bg-[#050506] border border-border rounded-lg space-y-2 text-[10px] font-medium"
                              >
                                <span className="font-bold text-white block">{lead.name}</span>
                                <span className="text-muted block">
                                  {lead.phone} • {lead.city}
                                </span>
                                <span className="text-[9px] text-volt block uppercase tracking-wider">
                                  {lead.source}
                                </span>
                                <span className="text-[9px] text-muted block">
                                  Showroom: {lead.assignedDealer}
                                </span>

                                {/* Update Status Dropdown */}
                                <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
                                  <span className="text-muted/60">Status:</span>
                                  <select
                                    value={lead.status}
                                    onChange={(e) =>
                                      handleUpdateLeadStatus(lead.id, e.target.value as any)
                                    }
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

                            {filtered.length === 0 && (
                              <div className="text-center py-6 text-muted text-[10px] font-normal italic">
                                Empty column
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: ORDER MANAGER */}
              {activeTab === "orders" && (
                <div className="bg-[#0D0D0F] border border-border rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-3">
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wider block">
                        Order & Reservation Manager
                      </span>
                      <p className="text-[10px] text-muted font-medium mt-1">
                        Track live Safepay checkout reservations and update fulfillment status.
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 w-full md:w-auto">
                      <input
                        type="text"
                        value={ordersSearch}
                        onChange={(e) => setOrdersSearch(e.target.value)}
                        placeholder="Search ref or customer..."
                        className="bg-[#050506] border border-border text-white px-3 py-2 rounded-xl outline-none focus:border-volt text-xs font-semibold w-full md:w-48"
                      />

                      <select
                        value={ordersFilterStatus}
                        onChange={(e) => setOrdersFilterStatus(e.target.value)}
                        className="bg-[#050506] border border-border text-white px-3 py-2 rounded-xl outline-none text-xs font-bold cursor-pointer"
                      >
                        <option value="all">All Fulfillment</option>
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto text-left">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border text-white text-[10px] font-bold uppercase tracking-wider pb-2">
                          <th className="py-3">Ref Code</th>
                          <th className="py-3">Customer</th>
                          <th className="py-3">Product Model (Variant)</th>
                          <th className="py-3">Paid Amount</th>
                          <th className="py-3">Date</th>
                          <th className="py-3">Payment Status</th>
                          <th className="py-3">Fulfillment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-white font-medium text-xs">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 font-mono font-bold text-volt">{order.orderRef}</td>
                            <td className="py-3.5">
                              <span className="block font-bold text-white">{order.customerName}</span>
                              <span className="block text-[10px] text-muted">{order.customerPhone}</span>
                            </td>
                            <td className="py-3.5">
                              <span className="block text-white font-bold">{order.modelName}</span>
                              <span className="block text-[10px] text-muted">
                                {order.variantName} • {order.color}
                              </span>
                            </td>
                            <td className="py-3.5 font-mono">
                              <span className="block text-white font-bold">
                                Rs {order.amountPaid.toLocaleString()}
                              </span>
                              <span className="block text-[9px] text-muted uppercase">
                                {order.paymentProvider}
                              </span>
                            </td>
                            <td className="py-3.5 text-muted">{order.date}</td>
                            <td className="py-3.5">
                              <select
                                value={order.paymentStatus}
                                onChange={(e) =>
                                  handleUpdateOrderStatus(order.id, "paymentStatus", e.target.value as any)
                                }
                                className={`border-none outline-none font-bold rounded text-[10px] px-1 py-0.5 cursor-pointer bg-[#121214] ${
                                  order.paymentStatus === "paid"
                                    ? "text-volt"
                                    : order.paymentStatus === "failed"
                                    ? "text-red-400"
                                    : "text-amber-400"
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                              </select>
                            </td>
                            <td className="py-3.5">
                              <select
                                value={order.fulfilmentStatus}
                                onChange={(e) =>
                                  handleUpdateOrderStatus(order.id, "fulfilmentStatus", e.target.value as any)
                                }
                                className={`border border-border outline-none font-bold rounded-xl text-[10px] px-3 py-1 cursor-pointer bg-[#050506] text-white focus:border-volt`}
                              >
                                <option value="pending">Pending</option>
                                <option value="preparing">Preparing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}

                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-10 text-muted italic">
                              No orders match the search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: CATALOG CMS */}
              {activeTab === "cms" && (
                <div className="bg-[#0D0D0F] border border-border rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <div>
                      <span className="text-sm font-bold text-white uppercase tracking-wider block">
                        Catalog Specifications CMS
                      </span>
                      <p className="text-[10px] text-muted font-medium mt-1">
                        Configure vehicles, manage battery/performance variants, and update specifications.
                      </p>
                    </div>

                    <button
                      onClick={() => openModelDialog(null)}
                      className="px-4 py-2 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold flex items-center shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all cursor-pointer border-none"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add New Model
                    </button>
                  </div>

                  <div className="overflow-x-auto text-left">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border text-white text-[10px] font-bold uppercase tracking-wider pb-2">
                          <th className="py-3">Model</th>
                          <th className="py-3">Slug</th>
                          <th className="py-3">Tagline</th>
                          <th className="py-3">Price From</th>
                          <th className="py-3">Status</th>
                          <th className="py-3 text-center">Specs & Variants</th>
                          <th className="py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-white font-medium text-xs">
                        {modelsList.map((model) => (
                          <React.Fragment key={model.id}>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="py-3.5 font-bold text-white text-sm">
                                {model.name}
                              </td>
                              <td className="py-3.5 font-mono">{model.slug}</td>
                              <td className="py-3.5 text-muted">{model.tagline}</td>
                              <td className="py-3.5 font-bold text-volt">
                                Rs {model.basePrice.toLocaleString()}
                              </td>
                              <td className="py-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    model.status === "published"
                                      ? "bg-volt/10 text-volt border border-volt/20"
                                      : "bg-muted/10 text-muted border border-border"
                                  }`}
                                >
                                  {model.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-center">
                                <button
                                  onClick={() => toggleModelRow(model.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-border text-[10px] font-bold text-white hover:border-volt hover:text-volt transition-all cursor-pointer"
                                >
                                  {expandedModelId === model.id ? (
                                    <>
                                      Hide Details <ChevronUp className="w-3.5 h-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      Manage Specs ({model.variants ? model.variants.length : 0}){" "}
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="inline-flex items-center space-x-3">
                                  <button
                                    onClick={() => openModelDialog(model)}
                                    className="p-1 hover:text-volt outline-none text-muted cursor-pointer transition-colors border-none bg-transparent"
                                    title="Edit Model details"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => triggerDeleteModel(model.id)}
                                    className="p-1 hover:text-red-400 outline-none text-muted cursor-pointer transition-colors border-none bg-transparent"
                                    title="Delete Model"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* EXPANDED MODEL DETAILS (VARIANTS & COLORS EDITOR) */}
                            {expandedModelId === model.id && (
                              <tr>
                                <td colSpan={7} className="p-6 bg-[#050506] border-t border-b border-border">
                                  <div className="space-y-6">
                                    {/* Sub-section 1: Variants */}
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-white text-[11px] font-bold uppercase tracking-wider">
                                          Vehicle Specs & Battery Variants
                                        </span>
                                        <button
                                          onClick={() => openVariantDialog(model.id, null)}
                                          className="px-3 py-1 bg-volt hover:bg-volt-hover text-background text-[10px] font-bold rounded-lg cursor-pointer border-none flex items-center transition-all"
                                        >
                                          <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
                                        </button>
                                      </div>

                                      <div className="overflow-x-auto border border-border rounded-xl">
                                        <table className="w-full border-collapse text-[10px]">
                                          <thead>
                                            <tr className="bg-[#121214] text-white font-bold uppercase tracking-wider border-b border-border">
                                              <th className="p-3 text-left">Variant Name</th>
                                              <th className="p-3 text-left">Battery</th>
                                              <th className="p-3 text-left">Price (PKR)</th>
                                              <th className="p-3 text-left">Speed (Kmh)</th>
                                              <th className="p-3 text-left">Range (Km)</th>
                                              <th className="p-3 text-left">Charging</th>
                                              <th className="p-3 text-left">Warranty</th>
                                              <th className="p-3 text-right">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border text-muted font-semibold">
                                            {model.variants && model.variants.map((v) => (
                                              <tr key={v.id} className="hover:bg-white/5">
                                                <td className="p-3 font-bold text-white">{v.name}</td>
                                                <td className="p-3">{v.batteryType}</td>
                                                <td className="p-3 font-mono font-bold text-volt">
                                                  Rs {v.price.toLocaleString()}
                                                </td>
                                                <td className="p-3 font-mono">{v.topSpeedKmh} km/h</td>
                                                <td className="p-3 font-mono">{v.rangeKm} km</td>
                                                <td className="p-3 font-mono">{v.chargingTimeHrs} hrs</td>
                                                <td className="p-3 font-mono">{v.warrantyMonths} months</td>
                                                <td className="p-3 text-right">
                                                  <div className="inline-flex items-center space-x-3">
                                                    <button
                                                      onClick={() => openVariantDialog(model.id, v)}
                                                      className="hover:text-volt text-muted bg-transparent border-none cursor-pointer"
                                                    >
                                                      <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                      onClick={() => triggerDeleteVariant(v.id)}
                                                      className="hover:text-red-400 text-muted bg-transparent border-none cursor-pointer"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}

                                            {(!model.variants || model.variants.length === 0) && (
                                              <tr>
                                                <td colSpan={8} className="text-center py-6 text-muted italic">
                                                  No specs/variants defined. Create one to enable reservation logic.
                                                </td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* Sub-section 2: Color Swatches Preview */}
                                    <div className="space-y-2 border-t border-border pt-4">
                                      <span className="text-white text-[11px] font-bold uppercase tracking-wider block">
                                        Configured Color Swatches
                                      </span>
                                      <div className="flex flex-wrap gap-4 pt-1">
                                        {model.colors && model.colors.map((c, i) => (
                                          <div
                                            key={i}
                                            className="flex items-center gap-2 bg-[#121214] border border-border px-3 py-1.5 rounded-xl text-white text-[10px]"
                                          >
                                            <span
                                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                                              style={{ backgroundColor: c.hex }}
                                            />
                                            <span className="font-bold">{c.name}</span>
                                            <span className="text-muted font-mono">{c.hex}</span>
                                          </div>
                                        ))}

                                        {(!model.colors || model.colors.length === 0) && (
                                          <span className="text-muted text-[10px] italic">
                                            No colors configured for configurator.
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: SETTINGS */}
              {activeTab === "settings" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in">
                  <div className="bg-[#0D0D0F] border border-border p-6 rounded-2xl space-y-4">
                    <span className="text-sm font-bold text-white uppercase tracking-wider block border-b border-border pb-2">
                      System Calculations Config
                    </span>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted block">
                          Default Petrol Price (Rs / Litre)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={petrolPrice}
                          onChange={(e) => setPetrolPrice(Number(e.target.value))}
                          className="w-full bg-[#050506] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-muted block">
                          Utility Electricity Tariff (Rs / Unit)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={electricityRate}
                          onChange={(e) => setElectricityRate(Number(e.target.value))}
                          className="w-full bg-[#050506] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                        />
                      </div>

                      <button
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="w-full py-3 bg-volt hover:bg-volt-hover disabled:bg-muted text-background font-bold text-xs rounded-xl shadow-md uppercase transition-all cursor-pointer border-none animate-none"
                      >
                        {isSavingSettings ? "Saving Settings..." : "Save Config Settings"}
                      </button>
                      
                      {settingsSuccess && (
                        <div className="p-2 border border-volt/20 bg-volt/5 text-volt text-center rounded-lg animate-pulse">
                          Settings saved successfully!
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#0D0D0F] border border-border p-6 rounded-2xl space-y-4">
                    <span className="text-sm font-bold text-white uppercase tracking-wider block border-b border-border pb-2">
                      Brand Contact Options
                    </span>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted block">
                          Official WhatsApp Helpline
                        </label>
                        <input
                          type="text"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="w-full bg-[#050506] border border-border text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-volt transition-colors"
                        />
                      </div>

                      <div className="p-4 bg-[#050506] border border-border rounded-xl space-y-2 text-muted">
                        <p className="text-[10px] font-medium leading-relaxed">
                          This WhatsApp helpline is prefilled on floating click-to-chat widgets
                          across all templates and pages. Ensure it has the correct international
                          suffix (e.g. +92).
                        </p>
                      </div>

                      <button
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="w-full py-3 bg-volt hover:bg-volt-hover disabled:bg-muted text-background font-bold text-xs rounded-xl shadow-md uppercase transition-all cursor-pointer border-none animate-none"
                      >
                        {isSavingSettings ? "Saving Settings..." : "Save Brand Settings"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      {/* 1. CMS ADD/EDIT MODEL DIALOG */}
      {isModelDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121214] border border-[#1A1A1F] w-full max-w-2xl rounded-2xl shadow-2xl p-6 text-white max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
              <span className="font-display text-base font-black text-white uppercase tracking-wider">
                {currentModelId ? `Edit Model Details` : `Add New Vehicle Model`}
              </span>
              <button
                onClick={() => setIsModelDialogOpen(false)}
                className="text-muted hover:text-white p-1 cursor-pointer transition-colors border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModelFormSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Model Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Zentaro Storm"
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Slug (Unique)</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="zentaro-storm"
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Tagline</label>
                  <input
                    type="text"
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="High Performance Cruiser"
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Vehicle Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-bold"
                  >
                    <option value="motorcycle">Motorcycle</option>
                    <option value="scooter">Scooter</option>
                    <option value="three_wheeler">Three Wheeler</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted block uppercase">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide details about the specs, battery configurations, etc."
                  required
                  rows={2}
                  className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Base Price (Rs)</label>
                  <input
                    type="number"
                    value={formBasePrice}
                    onChange={(e) => setFormBasePrice(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Original Price (Rs, Optional)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) =>
                      setFormOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="Strikethrough price"
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Hero Image Path</label>
                  <input
                    type="text"
                    value={formHeroImage}
                    onChange={(e) => setFormHeroImage(e.target.value)}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Catalog Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-bold"
                  >
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Visible)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Featured</label>
                  <select
                    value={formFeatured ? "true" : "false"}
                    onChange={(e) => setFormFeatured(e.target.value === "true")}
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-bold"
                  >
                    <option value="false">No (Standard Catalog)</option>
                    <option value="true">Yes (Homepage Card Spotlight)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Stock Availability</label>
                  <select
                    value={formInStock ? "true" : "false"}
                    onChange={(e) => setFormInStock(e.target.value === "true")}
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-bold"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-muted block uppercase">Colors & Swatches (JSON Array)</label>
                <textarea
                  value={formColorsJson}
                  onChange={(e) => setFormColorsJson(e.target.value)}
                  placeholder='[ { "name": "Volt", "hex": "#BFFF00", "image": "/images/models/bolt-hero.png" } ]'
                  required
                  rows={4}
                  className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-mono text-[10px]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModelDialogOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border bg-transparent text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-volt hover:bg-volt-hover text-background font-bold text-xs flex items-center justify-center transition-all cursor-pointer border-none"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CMS ADD/EDIT VARIANT DIALOG */}
      {isVariantDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121214] border border-[#1A1A1F] w-full max-w-2xl rounded-2xl shadow-2xl p-6 text-white max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-border pb-3 mb-4">
              <span className="font-display text-base font-black text-white uppercase tracking-wider">
                {currentVariantId ? `Edit Variant Specifications` : `Add Variant & Specs`}
              </span>
              <button
                onClick={() => setIsVariantDialogOpen(false)}
                className="text-muted hover:text-white p-1 cursor-pointer transition-colors border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVariantFormSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Variant Name</label>
                  <input
                    type="text"
                    value={formVarName}
                    onChange={(e) => setFormVarName(e.target.value)}
                    placeholder="Standard LFP or Long-Range Pro"
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Battery Type</label>
                  <select
                    value={formVarBatteryType}
                    onChange={(e) => setFormVarBatteryType(e.target.value as any)}
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt font-bold"
                  >
                    <option value="LFP">LFP (Lithium Iron Phosphate)</option>
                    <option value="Lithium">Lithium Ion</option>
                    <option value="Graphene">Graphene</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Price (Rs)</label>
                  <input
                    type="number"
                    value={formVarPrice}
                    onChange={(e) => setFormVarPrice(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Original Price (Rs, Optional)</label>
                  <input
                    type="number"
                    value={formVarOriginalPrice}
                    onChange={(e) =>
                      setFormVarOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="Original price"
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Top Speed (km/h)</label>
                  <input
                    type="number"
                    value={formVarSpeed}
                    onChange={(e) => setFormVarSpeed(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Range (km)</label>
                  <input
                    type="number"
                    value={formVarRange}
                    onChange={(e) => setFormVarRange(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Charge Time (hrs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formVarChargeTime}
                    onChange={(e) => setFormVarChargeTime(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Battery Life (years)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formVarBatteryLife}
                    onChange={(e) => setFormVarBatteryLife(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Motor Watts</label>
                  <input
                    type="number"
                    value={formVarMotorWatts}
                    onChange={(e) => setFormVarMotorWatts(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Voltage (V)</label>
                  <input
                    type="number"
                    value={formVarVoltage}
                    onChange={(e) => setFormVarVoltage(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Amp Hours (Ah)</label>
                  <input
                    type="number"
                    value={formVarAmphours}
                    onChange={(e) => setFormVarAmphours(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Cycles</label>
                  <input
                    type="number"
                    value={formVarChargeCycles}
                    onChange={(e) => setFormVarChargeCycles(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Warranty (Months)</label>
                  <input
                    type="number"
                    value={formVarWarranty}
                    onChange={(e) => setFormVarWarranty(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Weight (kg)</label>
                  <input
                    type="number"
                    value={formVarWeight}
                    onChange={(e) => setFormVarWeight(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Max Load (kg)</label>
                  <input
                    type="number"
                    value={formVarLoad}
                    onChange={(e) => setFormVarLoad(Number(e.target.value))}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Brakes</label>
                  <input
                    type="text"
                    value={formVarBrakes}
                    onChange={(e) => setFormVarBrakes(e.target.value)}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Tyres</label>
                  <input
                    type="text"
                    value={formVarTyres}
                    onChange={(e) => setFormVarTyres(e.target.value)}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Suspension</label>
                  <input
                    type="text"
                    value={formVarSuspension}
                    onChange={(e) => setFormVarSuspension(e.target.value)}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">IP Rating</label>
                  <input
                    type="text"
                    value={formVarIpRating}
                    onChange={(e) => setFormVarIpRating(e.target.value)}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-muted block uppercase">Smart Features (Comma separated)</label>
                  <input
                    type="text"
                    value={formVarSmartFeatures}
                    onChange={(e) => setFormVarSmartFeatures(e.target.value)}
                    required
                    className="w-full bg-[#050506] border border-border rounded-xl px-4 py-2.5 text-white outline-none focus:border-volt"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsVariantDialogOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border bg-transparent text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-volt hover:bg-volt-hover text-background font-bold text-xs flex items-center justify-center transition-all cursor-pointer border-none"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Variant Specs"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CONFIRM DELETE MODEL DIALOG */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121214] border border-[#1A1A1F] w-full max-w-md rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <ShieldAlert className="w-6 h-6" />
              <span className="font-display text-base font-black uppercase tracking-wider">
                Delete Vehicle Model?
              </span>
            </div>
            
            <p className="text-muted leading-relaxed font-medium">
              Are you sure you want to permanently delete this vehicle from the database? This
              action will delete all corresponding variants and specs, and cannot be undone.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-transparent text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteModel}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer border-none"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONFIRM DELETE VARIANT DIALOG */}
      {isVariantDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121214] border border-[#1A1A1F] w-full max-w-md rounded-2xl shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <ShieldAlert className="w-6 h-6" />
              <span className="font-display text-base font-black uppercase tracking-wider">
                Delete Specifications Variant?
              </span>
            </div>
            
            <p className="text-muted leading-relaxed font-medium">
              Are you sure you want to permanently delete this specification variant? This will remove the range, speed, and pricing specs for this tier.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsVariantDeleteOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-transparent text-white hover:bg-white/5 transition-all text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteVariant}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer border-none"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
