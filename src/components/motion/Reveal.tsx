"use client";

import React from "react";
import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  width?: "fit-content" | "100%";
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  width = "fit-content",
}: RevealProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width }}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
