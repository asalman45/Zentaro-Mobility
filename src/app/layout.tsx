import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZENTARO Mobility | Next-Generation EV Motorcycles & Scooters",
  description:
    "Experience Pakistan's premium high-performance electric two-wheelers. Drive the future with zero petrol, advanced LFP battery variants, and easy financing. Sab Ki Apni Ride.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground bg-gradient-mesh">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
