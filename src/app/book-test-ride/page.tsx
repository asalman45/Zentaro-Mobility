"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Calendar, MapPin, User, ChevronRight, ChevronLeft, CheckCircle2, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn, Reveal } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";
import { bookTestRideAction } from "@/app/actions/testRide";

// Configured local mock parameters
const modelsList = [
  { slug: "zentaro-thunder", name: "ZENTARO Thunder", battery: "LFP Dual Pro", type: "motorcycle" },
  { slug: "zentaro-alpha", name: "ZENTARO Alpha", battery: "LFP Long-Range", type: "motorcycle" },
  { slug: "zentaro-breeze", name: "ZENTARO Breeze", battery: "LFP Pro Smart", type: "scooter" },
];

const showroomsList = [
  { id: 1, name: "ZENTARO Clifton Showroom", city: "Karachi", address: "Main Clifton Road, Karachi" },
  { id: 3, name: "ZENTARO Gulberg Flagship Showroom", city: "Lahore", address: "MM Alam Road, Lahore" },
  { id: 5, name: "ZENTARO Blue Area Showroom", city: "Islamabad", address: "Jinnah Avenue, Blue Area" },
  { id: 6, name: "ZENTARO Rawalpindi Saddar Showroom", city: "Rawalpindi", address: "Canning Road, Saddar" },
];

const timeSlots = [
  "10:00 AM - 11:30 AM",
  "11:30 AM - 01:00 PM",
  "02:00 PM - 03:30 PM",
  "03:30 PM - 05:00 PM",
  "05:00 PM - 06:30 PM",
];

export default function BookTestRidePage() {
  const [step, setStep] = useState(1);

  // Form selections state
  const [selectedModel, setSelectedModel] = useState(modelsList[0]);
  const [selectedCity, setSelectedCity] = useState("Karachi");
  const [selectedShowroom, setSelectedShowroom] = useState(showroomsList[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);

  // Contact details
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bSpam, setBSpam] = useState(""); // Honeypot field

  // Submissions state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const filteredShowrooms = showroomsList.filter(
    (s) => s.city.toLowerCase() === selectedCity.toLowerCase()
  );

  const handleNextStep = () => {
    // Basic validation per step
    if (step === 2 && filteredShowrooms.length > 0 && !selectedShowroom) {
      alert("Please select a showroom.");
      return;
    }
    if (step === 3 && !selectedDate) {
      alert("Please choose a date for your test ride.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) {
      alert("Please fill all contact fields.");
      return;
    }

    // Phone validation
    const phoneRegex = /^((\+92)|(0092)|(03))\d{9}$/;
    if (!phoneRegex.test(contactPhone)) {
      alert("Please enter a valid Pakistani phone (e.g., 03001234567)");
      return;
    }

    // Honeypot spam test
    if (bSpam) {
      console.warn("Spam bot triggered honeypot.");
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1000);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await bookTestRideAction({
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        city: selectedCity,
        modelSlug: selectedModel.slug,
        showroomName: selectedShowroom.name,
        date: selectedDate,
        timeSlot: selectedSlot,
      });

      if (!res.success) {
        throw new Error(res.error);
      }

      setBookingRef(res.bookingRef || "");

      trackEvent({
        name: "lead_generated",
        properties: {
          source: "test_ride",
          city: selectedCity,
          model_slug: selectedModel.slug,
        },
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FadeIn className="text-center mb-10">
            <h1 className="font-display text-4xl font-black text-white tracking-tighter">
              BOOK A FREE TEST RIDE
            </h1>
            <p className="text-muted text-sm font-semibold uppercase tracking-wider mt-1 block">
              Experience the power of LFP batteries
            </p>
          </FadeIn>

          {isSuccess ? (
            <div className="bg-[#121214] border border-border p-8 rounded-2xl text-center space-y-6 shadow-2xl">
              <CheckCircle2 className="w-16 h-16 text-volt mx-auto animate-bounce" />
              <h2 className="font-display text-2xl font-bold text-white">Ride Scheduled</h2>
              <div className="p-4 bg-[#0A0A0B] border border-border rounded-xl space-y-2 text-xs font-semibold max-w-sm mx-auto text-left text-muted">
                <p>Booking Reference: <span className="text-white font-bold">{bookingRef}</span></p>
                <p>Vehicle model: <span className="text-white font-bold">{selectedModel.name}</span></p>
                <p>Showroom: <span className="text-white font-bold">{selectedShowroom.name}</span></p>
                <p>Schedule: <span className="text-volt font-bold">{selectedDate} @ {selectedSlot}</span></p>
              </div>
              <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                Confirmation details have been dispatched to your phone via SMS and email. Please bring a valid CNIC and driving license to your scheduled showroom.
              </p>
              <Link
                href="/account/dashboard"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold uppercase tracking-wide shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Stepper Progress bar */}
              <div className="flex justify-between items-center text-[10px] font-bold text-muted uppercase tracking-wider border-b border-border pb-4">
                <span className={step >= 1 ? "text-volt" : ""}>1. Vehicle</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className={step >= 2 ? "text-volt" : ""}>2. Location</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className={step >= 3 ? "text-volt" : ""}>3. Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className={step >= 4 ? "text-volt" : ""}>4. Contact</span>
              </div>

              {/* STEP 1: VEHICLE */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select EV Vehicle</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modelsList.map((model) => (
                      <button
                        key={model.slug}
                        onClick={() => setSelectedModel(model)}
                        className={`p-5 rounded-xl border text-left flex flex-col justify-between h-32 transition-all ${
                          selectedModel.slug === model.slug
                            ? "bg-volt/5 border-volt"
                            : "bg-[#0A0A0B] border-border hover:border-white/20"
                        }`}
                      >
                        <Zap className={`w-6 h-6 ${selectedModel.slug === model.slug ? "text-volt" : "text-muted"}`} />
                        <div>
                          <span className="font-bold text-white block text-sm">{model.name}</span>
                          <span className="text-[10px] text-muted block mt-0.5 uppercase">{model.battery}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Select Showroom City</h3>
                  <div className="flex items-center space-x-2 bg-[#0A0A0B] p-1 rounded-xl">
                    {["Karachi", "Lahore", "Islamabad", "Rawalpindi"].map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          // Default showroom to first matching showroom in city
                          const matches = showroomsList.filter((s) => s.city === city);
                          if (matches.length > 0) setSelectedShowroom(matches[0]);
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          selectedCity === city ? "bg-volt text-background" : "text-muted hover:text-white"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 pt-2">
                    {filteredShowrooms.map((showroom) => (
                      <button
                        key={showroom.id}
                        onClick={() => setSelectedShowroom(showroom)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center space-x-4 ${
                          selectedShowroom.id === showroom.id
                            ? "bg-volt/5 border-volt"
                            : "bg-[#0A0A0B] border-border hover:border-white/20"
                        }`}
                      >
                        <MapPin className={`w-5 h-5 ${selectedShowroom.id === showroom.id ? "text-volt" : "text-muted"}`} />
                        <div>
                          <span className="font-bold text-white block text-sm">{showroom.name}</span>
                          <span className="text-[10px] text-muted block mt-0.5">{showroom.address}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: SCHEDULE */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Schedule Test Ride Date & Slot</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted font-bold uppercase tracking-wider block">Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted font-bold uppercase tracking-wider block">Time Slot</label>
                      <div className="space-y-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full py-2 text-xs font-bold rounded-lg border transition-all ${
                              selectedSlot === slot
                                ? "bg-volt border-volt text-background"
                                : "bg-[#0A0A0B] border-border text-muted hover:border-white"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT INFO */}
              {step === 4 && (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-border pb-2">
                    Enter Contact Details
                  </h3>

                  {/* Honeypot Field */}
                  <input
                    type="text"
                    value={bSpam}
                    onChange={(e) => setBSpam(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Full Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Muhammad Ali"
                      required
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Email Address</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="ali@example.pk"
                      required
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="03001234567"
                      required
                      className="w-full bg-[#0A0A0B] border border-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-volt transition-colors"
                    />
                  </div>
                </form>
              )}

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-6 border-t border-border">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-border text-muted hover:border-white hover:text-white transition-all text-xs font-bold tracking-tight cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-volt hover:bg-volt-hover text-background text-xs font-bold tracking-tight shadow-[0_0_12px_rgba(191,255,0,0.3)] transition-all cursor-pointer"
                  >
                    {isSubmitting ? "Booking..." : "Schedule Ride Appointment"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
