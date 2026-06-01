"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface WhatsAppFloatingProps {
  number?: string;
  message?: string;
}

export function WhatsAppFloating({
  number = "+923001234567",
  message = "Hi ZENTARO Mobility, I am interested in booking a test ride / reserving an EV motorcycle!",
}: WhatsAppFloatingProps) {
  const { t } = useLanguage();
  const [whatsappNo, setWhatsappNo] = useState(number);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.whatsappNumber) {
          setWhatsappNo(data.whatsappNumber);
        }
      })
      .catch((err) => console.error("Error loading dynamic whatsapp number:", err));
  }, []);
  
  // Format number to remove symbols and keep digits for wa.me API
  const formattedNumber = whatsappNo.replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] cursor-pointer outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contact ZENTARO on WhatsApp"
    >
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-35 animate-ping -z-10" />
      <svg
        className="w-7 h-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.386 9.807-9.778.002-2.611-1.013-5.067-2.86-6.918C16.374 2.06 13.93 1.047 11.96 1.047c-5.403 0-9.802 4.387-9.806 9.778-.001 1.702.447 3.361 1.299 4.81l-.979 3.57 3.68-.956.103.062zM16.89 13.91c-.267-.134-1.58-.78-1.823-.867-.243-.088-.42-.132-.596.133-.176.265-.682.864-.836 1.041-.154.177-.308.2-.575.066-.267-.133-1.129-.417-2.15-1.328-.795-.71-1.332-1.588-1.488-1.854-.156-.266-.017-.409.117-.541.12-.12.267-.31.4-.464.133-.155.178-.266.267-.442.089-.177.044-.332-.022-.464-.066-.133-.596-1.436-.816-1.967-.215-.518-.452-.447-.621-.456-.16-.008-.343-.01-.525-.01-.182 0-.476.069-.724.34-.249.271-.95.928-.95 2.264 0 1.335.972 2.625 1.107 2.802.135.177 1.914 2.923 4.637 4.101.648.281 1.153.448 1.547.573.651.207 1.243.178 1.71.109.522-.078 1.58-.646 1.802-1.24.221-.593.221-1.101.155-1.207-.066-.107-.243-.173-.51-.307z" />
      </svg>
    </motion.a>
  );
}
