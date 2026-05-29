"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glow" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 outline-none focus:ring-2 focus:ring-volt focus:ring-offset-2 focus:ring-offset-background";

  const variants = {
    primary: "bg-volt text-background hover:bg-volt-hover hover:shadow-[0_0_15px_rgba(191,255,0,0.35)]",
    secondary: "bg-card text-foreground border border-border hover:bg-white/5",
    outline: "bg-transparent border border-border text-foreground hover:border-volt hover:text-volt",
    ghost: "bg-transparent text-muted hover:text-white hover:bg-white/5",
    glow: "bg-volt text-background hover:bg-volt-hover shadow-[0_0_20px_rgba(191,255,0,0.4)] hover:shadow-[0_0_25px_rgba(191,255,0,0.6)] border border-volt",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    icon: "p-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
