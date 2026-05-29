"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import "leaflet/dist/leaflet.css";

// Define interface matching our database schemas
interface Dealer {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  type: "showroom" | "service_center" | "charging_point";
  hours: string;
  lat: number;
  lng: number;
}

const mockDealers: Dealer[] = [
  {
    id: 1,
    name: "ZENTARO Clifton Showroom",
    city: "Karachi",
    address: "Main Clifton Road, Block 4, Clifton, Karachi",
    lat: 24.8152,
    lng: 67.0315,
    phone: "+922135831201",
    whatsapp: "+923009212001",
    type: "showroom",
    hours: "10:00 AM - 9:00 PM",
  },
  {
    id: 2,
    name: "ZENTARO Shahra-e-Faisal Service & Charge",
    city: "Karachi",
    address: "Main Shahra-e-Faisal, PECHS, Karachi",
    lat: 24.8623,
    lng: 67.0734,
    phone: "+922134534012",
    whatsapp: "+923009212002",
    type: "service_center",
    hours: "9:00 AM - 6:00 PM",
  },
  {
    id: 3,
    name: "ZENTARO Gulberg Flagship Showroom",
    city: "Lahore",
    address: "MM Alam Road, Gulberg III, Lahore",
    lat: 31.5126,
    lng: 74.3512,
    phone: "+924235759102",
    whatsapp: "+923008412001",
    type: "showroom",
    hours: "11:00 AM - 9:30 PM",
  },
  {
    id: 4,
    name: "ZENTARO DHA Phase 5 Service Hub",
    city: "Lahore",
    address: "CCA, Phase 5 DHA, Lahore",
    lat: 31.4697,
    lng: 74.4372,
    phone: "+924235691023",
    whatsapp: "+923008412002",
    type: "service_center",
    hours: "9:00 AM - 7:00 PM",
  },
  {
    id: 5,
    name: "ZENTARO Blue Area Showroom",
    city: "Islamabad",
    address: "Jinnah Avenue, G 7/3 Blue Area, Islamabad",
    lat: 33.7121,
    lng: 73.0645,
    phone: "+92512821205",
    whatsapp: "+923005112001",
    type: "showroom",
    hours: "10:00 AM - 8:30 PM",
  },
];

export default function DealersMap({
  dealersList = mockDealers,
  selectedCity = "All",
}: {
  dealersList?: Dealer[];
  selectedCity?: string;
}) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [MapContainer, setMapContainer] = useState<any>(null);
  const [TileLayer, setTileLayer] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Popup, setPopup] = useState<any>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Dynamically load react-leaflet to prevent SSR errors
    import("react-leaflet").then((mod) => {
      setMapContainer(() => mod.MapContainer);
      setTileLayer(() => mod.TileLayer);
      setMarker(() => mod.Marker);
      setPopup(() => mod.Popup);
    });

    import("leaflet").then((L) => {
      // Create a premium Volt-green marker icon override
      const icon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div class="w-8 h-8 rounded-full bg-black border-2 border-[#BFFF00] flex items-center justify-center shadow-[0_0_12px_rgba(191,255,0,0.5)]"><div class="w-2.5 h-2.5 rounded-full bg-[#BFFF00] animate-pulse"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      setCustomIcon(() => icon);
    });
  }, []);

  const filteredDealers =
    selectedCity === "All"
      ? dealersList
      : dealersList.filter((d) => d.city.toLowerCase() === selectedCity.toLowerCase());

  if (!isMounted || !MapContainer || !TileLayer || !Marker || !Popup || !customIcon) {
    return (
      <div className="w-full h-[450px] bg-card/50 border border-border rounded-2xl flex items-center justify-center animate-pulse">
        <span className="text-muted text-sm font-semibold">{t("common.loading")}</span>
      </div>
    );
  }

  // Centering: default to Karachi center if multi-city, or the first dealer's coordinates
  const mapCenter: [number, number] =
    filteredDealers.length > 0 ? [filteredDealers[0].lat, filteredDealers[0].lng] : [30.3753, 69.3451];

  const mapZoom = selectedCity === "All" ? 6 : 12;

  return (
    <div className="w-full h-[450px] border border-border rounded-2xl overflow-hidden shadow-2xl relative z-10">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Premium Dark-mode CartoDB map tile
        />
        {filteredDealers.map((dealer) => (
          <Marker
            key={dealer.id}
            position={[dealer.lat, dealer.lng]}
            icon={customIcon}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-2 space-y-1 bg-[#121214] text-white border border-[#27272A] rounded-lg text-xs font-sans">
                <h4 className="font-bold text-sm text-[#BFFF00]">{dealer.name}</h4>
                <p className="text-muted leading-snug">{dealer.address}</p>
                <div className="pt-2 border-t border-[#27272A] mt-2 flex items-center justify-between text-[10px]">
                  <span>📞 {dealer.phone}</span>
                  <a
                    href={`https://wa.me/${dealer.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#25D366] font-bold hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
