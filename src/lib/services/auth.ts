"use client";

import { useState, useEffect } from "react";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "dealer" | "admin";
  city: string;
}

const mockUsers: Record<string, UserSession> = {
  customer: {
    id: "cust-01",
    name: "Muhammad Ali",
    email: "ali@example.pk",
    phone: "03001234567",
    role: "customer",
    city: "Karachi",
  },
  dealer: {
    id: "deal-01",
    name: "ZENTARO Clifton Manager",
    email: "clifton@zentaro.pk",
    phone: "03009212001",
    role: "dealer",
    city: "Karachi",
  },
  admin: {
    id: "admin-01",
    name: "ZENTARO Global Admin",
    email: "admin@zentaro.pk",
    phone: "03009999999",
    role: "admin",
    city: "Lahore",
  },
};

export const getSession = (): UserSession | null => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("zentaro-session");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  // Default to customer on first load for easy local review
  const defaultUser = mockUsers.customer;
  localStorage.setItem("zentaro-session", JSON.stringify(defaultUser));
  return defaultUser;
};

export const setSession = (role: "customer" | "dealer" | "admin") => {
  if (typeof window === "undefined") return;
  const user = mockUsers[role];
  localStorage.setItem("zentaro-session", JSON.stringify(user));
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("zentaro-session");
};
