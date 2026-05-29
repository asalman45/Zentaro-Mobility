"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number; // Distance in pixels to displace
  className?: string;
}

export function Parallax({ children, offset = 80, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll position relative to target element bounds
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Interpolate progress to vertical displacement
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
