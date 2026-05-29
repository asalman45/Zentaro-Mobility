"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MessageSquare, Mail, Phone, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { FadeIn } from "@/components/motion";
import { trackEvent } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^((\+92)|(0092)|(03))\d{9}$/, "Please enter a valid Pakistani phone (e.g. 03001234567)"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  b_spam: z.string().optional(),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormInputs) => {
    if (data.b_spam) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        reset();
      }, 1000);
      return;
    }

    const now = Date.now();
    if (lastSubmitTime && now - lastSubmitTime < 60000) {
      alert("Please wait 1 minute before sending another message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      trackEvent({
        name: "lead_generated",
        properties: {
          source: "contact",
          city: "unknown",
        },
      });

      setLastSubmitTime(now);
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const branches = [
    {
      city: "Karachi (Headquarters)",
      address: "Main Clifton Road, Block 4, Clifton, Karachi",
      phone: "+92 21 111 936 827",
      email: "khi@zentaro.pk",
      hours: "10:00 AM - 9:00 PM (Monday - Saturday)",
    },
    {
      city: "Lahore Showroom",
      address: "MM Alam Road, Gulberg III, Lahore",
      phone: "+92 42 3575 9102",
      email: "lhe@zentaro.pk",
      hours: "11:00 AM - 9:30 PM (Daily)",
    },
    {
      city: "Islamabad Showroom",
      address: "Jinnah Avenue, G 7/3 Blue Area, Islamabad",
      phone: "+92 51 282 1205",
      email: "isb@zentaro.pk",
      hours: "10:00 AM - 8:30 PM (Sunday Closed)",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow pt-10 pb-24 text-xs font-semibold text-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-white">
              CONTACT ZENTARO MOBILITY
            </h1>
            <p className="text-muted text-sm font-medium mt-2 max-w-xl mx-auto">
              Get in touch with our team for bulk dealer orders, customer assistance, or media inquiries.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Showrooms details column */}
            <div className="lg:col-span-5 space-y-6">
              {branches.map((branch, idx) => (
                <div key={idx} className="p-6 bg-card border border-border rounded-2xl space-y-3 shadow-lg">
                  <span className="font-display text-sm font-bold text-white block">{branch.city}</span>
                  <div className="space-y-2 text-[11px] font-medium leading-relaxed">
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-volt shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-volt" />
                      <span>{branch.phone}</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-volt" />
                      <span>{branch.email}</span>
                    </p>
                    <p className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-volt" />
                      <span>{branch.hours}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inquiry Form column */}
            <div className="lg:col-span-7 bg-[#121214] border border-border p-6 sm:p-8 rounded-2xl shadow-xl">
              {submitSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-volt mx-auto animate-bounce" />
                  <h3 className="font-display text-2xl font-bold text-white">Message Dispatched</h3>
                  <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                    Your inquiry has been cataloged. Our corporate relations desk will contact you via email or phone shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-5 py-2.5 rounded-lg border border-border text-xs font-bold text-white hover:border-volt hover:text-volt"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-border pb-3 mb-4">
                    Send General Inquiry
                  </h3>

                  {/* Honeypot field */}
                  <input
                    type="text"
                    {...register("b_spam")}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted block">Full Name</label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Muhammad Ali"
                        className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                      />
                      {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-muted block">Email Address</label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="ali@example.pk"
                        className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                      />
                      {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted block">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="03001234567"
                        className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                      />
                      {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-muted block">Subject</label>
                      <input
                        type="text"
                        {...register("subject")}
                        placeholder="Dealership Inquiry, Support, etc."
                        className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors"
                      />
                      {errors.subject && <p className="text-red-400 text-[10px] mt-1">{errors.subject.message}</p>}
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted block">Message</label>
                    <textarea
                      {...register("message")}
                      placeholder="Explain your request in detail..."
                      rows={5}
                      className="w-full bg-[#0A0A0B] border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-volt transition-colors resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-[10px] mt-1">{errors.message.message}</p>}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-volt hover:bg-volt-hover text-background text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(191,255,0,0.3)] transition-all uppercase flex items-center justify-center cursor-pointer"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Dispatching..." : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </div>
  );
}
