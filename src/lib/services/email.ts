export interface EmailConfig {
  to: string;
  subject: string;
  body: string; // Plain text or HTML string
}

export interface EmailProvider {
  sendEmail(config: EmailConfig): Promise<{ success: boolean; error?: string }>;
}

export class ResendEmailProvider implements EmailProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || "mock_resend_key";
  }

  async sendEmail(config: EmailConfig) {
    if (this.apiKey === "mock_resend_key" || !this.apiKey) {
      console.log(`✉️ [Mock Email] Sending to ${config.to}`);
      console.log(`Subject: "${config.subject}"`);
      console.log(`Body:\n${config.body}`);
      return { success: true };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: "ZENTARO Mobility <updates@zentaro.pk>",
          to: [config.to],
          subject: config.subject,
          html: config.body,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, error: errText };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Resend API failed:", err);
      return { success: false, error: err.message };
    }
  }
}

export const emailService = new ResendEmailProvider();
