"use client";

import React, { useEffect, useRef } from "react";
import { useInView, motion, useMotionValue, useTransform, animate } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(from);
  
  // Create animated text representation
  const rounded = useTransform(count, (latest) => {
    const formatted = latest.toFixed(decimals);
    // Format large numbers with commas, e.g., 549,000
    if (decimals === 0) {
      return Number(formatted).toLocaleString("en-US");
    }
    return formatted;
  });

  useEffect(() => {
    if (!inView) return;

    const timer = setTimeout(() => {
      const controls = animate(count, to, {
        duration,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [inView, to, count, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
