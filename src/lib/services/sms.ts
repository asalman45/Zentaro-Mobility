import { db } from "../db";
import { smsLogs } from "../db/schema";

export interface SmsProvider {
  sendSms(phone: string, message: string): Promise<{ success: boolean; logId?: number }>;
}

export class DatabaseSmsProvider implements SmsProvider {
  async sendSms(phone: string, message: string) {
    try {
      console.log(`📱 [SMS Notification] Sending to ${phone}: "${message}"`);
      
      // Persist the transaction into the db SMS logs table
      const [inserted] = await db
        .insert(smsLogs)
        .values({
          phone,
          message,
          status: "sent",
        })
        .returning();

      return {
        success: true,
        logId: inserted.id,
      };
    } catch (err) {
      console.error("Failed to log SMS notification to database:", err);
      return { success: false };
    }
  }
}

export const smsService = new DatabaseSmsProvider();
