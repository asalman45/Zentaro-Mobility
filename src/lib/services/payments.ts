export interface PaymentSessionConfig {
  amount: number;
  currency: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  cancelUrl: string;
  successUrl: string;
}

export interface PaymentProvider {
  createSession(config: PaymentSessionConfig): Promise<{
    success: boolean;
    sessionUrl?: string;
    providerRef: string;
    error?: string;
  }>;
  verifyPayment(providerRef: string): Promise<{
    success: boolean;
    status: "paid" | "failed" | "pending";
    error?: string;
  }>;
}

// 1. SAFEPAY GATEWAY PROVIDER (Real Pakistani Cards Gateway)
export class SafepayProvider implements PaymentProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.SAFEPAY_API_URL || "https://sandbox.api.safepay.co";
    this.apiKey = process.env.SAFEPAY_API_KEY || "";
  }

  async createSession(config: PaymentSessionConfig) {
    try {
      // Direct integration call to Safepay checkout session endpoint
      const response = await fetch(`${this.apiUrl}/checkout/v1/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: config.amount,
          currency: config.currency,
          reference: config.orderRef,
          redirect_url: config.successUrl,
          cancel_url: config.cancelUrl,
          customer: {
            name: config.customerName,
            email: config.customerEmail,
            phone: config.customerPhone,
          },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, providerRef: "", error: errText };
      }

      const data = await response.json();
      return {
        success: true,
        sessionUrl: data.session_url || `${this.apiUrl}/checkout/pay?session_id=${data.id}`,
        providerRef: data.id,
      };
    } catch (err: any) {
      return { success: false, providerRef: "", error: err.message };
    }
  }

  async verifyPayment(providerRef: string) {
    try {
      const response = await fetch(`${this.apiUrl}/checkout/v1/session/${providerRef}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        return { success: false, status: "pending" as const, error: "Failed to verify session" };
      }

      const data = await response.json();
      // Safepay status logic mapping: completed -> paid
      const isCompleted = data.status === "completed" || data.state === "paid";
      return {
        success: true,
        status: isCompleted ? ("paid" as const) : ("pending" as const),
      };
    } catch (err: any) {
      return { success: false, status: "pending" as const, error: err.message };
    }
  }
}

// 2. MOCK PAYMENT PROVIDER
export class MockPaymentProvider implements PaymentProvider {
  async createSession(config: PaymentSessionConfig) {
    console.log(`💳 [Mock Payment] Initiating Rs ${config.amount} session for ${config.orderRef}`);
    const mockRef = `mock_ref_${Math.random().toString(36).substring(7)}`;
    
    // In mock mode, redirect straight to success URL with mock parameters
    const redirectUrl = `${config.successUrl}?order_ref=${config.orderRef}&reference=${mockRef}&status=paid`;
    
    return {
      success: true,
      sessionUrl: redirectUrl,
      providerRef: mockRef,
    };
  }

  async verifyPayment(providerRef: string) {
    return {
      success: true,
      status: "paid" as const,
    };
  }
}

// 3. FACTORY INITIALIZER BASED ON ENV VAR
export const getPaymentProvider = (): PaymentProvider => {
  const isMock = process.env.NEXT_PUBLIC_PAYMENT_MOCK === "true";
  if (isMock) {
    return new MockPaymentProvider();
  }
  return new SafepayProvider();
};
