type FunnelEvent =
  | { name: "hero_cta_clicked"; properties: { cta_label: string; destination: string } }
  | { name: "calculator_used"; properties: { calculator_type: "savings" | "financing"; model_slug?: string; details?: any } }
  | { name: "comparison_added"; properties: { model_name: string; count: number } }
  | { name: "checkout_step_completed"; properties: { step: number; step_name: string; order_ref?: string } }
  | { name: "whatsapp_clicked"; properties: { cta_location: string; model_slug?: string } }
  | { name: "lead_generated"; properties: { source: string; city: string; model_slug?: string } };

export const trackEvent = (event: FunnelEvent) => {
  // In development, log the event structured data for validation
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `📊 [Analytics Event] ${event.name.toUpperCase()}:`,
      JSON.stringify(event.properties, null, 2)
    );
  }

  // Abstract placeholder to wire up Mixpanel, Google Analytics 4, or Facebook Pixel
  try {
    if (typeof window !== "undefined") {
      // e.g., window.gtag('event', event.name, event.properties);
      // or window.mixpanel.track(event.name, event.properties);
      
      // Store in simple temporary session storage for admin metrics dashboard audits
      const logs = JSON.parse(sessionStorage.getItem("zentaro_analytics_logs") || "[]");
      logs.push({
        event: event.name,
        properties: event.properties,
        timestamp: new Date().toISOString(),
      });
      sessionStorage.setItem("zentaro_analytics_logs", JSON.stringify(logs.slice(-100))); // Keep last 100 entries
    }
  } catch (error) {
    console.error("Failed to persist analytics event:", error);
  }
};
