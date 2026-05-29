"use server";

import { smsService } from "@/lib/services/sms";
import { emailService } from "@/lib/services/email";
import { db } from "@/lib/db";
import { testRideBookings, leads } from "@/lib/db/schema";

interface TestRideBookingInput {
  name: string;
  email: string;
  phone: string;
  city: string;
  modelSlug: string;
  showroomName: string;
  date: string;
  timeSlot: string;
}

export async function bookTestRideAction(input: TestRideBookingInput) {
  try {
    const { name, email, phone, city, modelSlug, showroomName, date, timeSlot } = input;

    // 1. Find model and showroom IDs from database
    const model = await db.query.models.findFirst({
      where: (models, { eq }) => eq(models.slug, modelSlug),
    });

    const showroom = await db.query.dealers.findFirst({
      where: (dealers, { eq, and }) => and(
        eq(dealers.name, showroomName),
        eq(dealers.city, city)
      ),
    });

    if (!model || !showroom) {
      throw new Error("Invalid model or showroom selection");
    }

    // 2. Insert into test_ride_bookings
    const [booking] = await db
      .insert(testRideBookings)
      .values({
        name,
        email,
        phone,
        modelId: model.id,
        dealerId: showroom.id,
        date,
        timeSlot,
        status: "pending",
      })
      .returning();

    // 3. Create lead as well
    await db
      .insert(leads)
      .values({
        name,
        email,
        phone,
        city,
        source: "test_ride",
        modelId: model.id,
        status: "new",
        assignedDealerId: showroom.id,
        notes: `Test Ride scheduled for ${date} at ${timeSlot} at ${showroomName}`,
      });

    // 4. Generate reference
    const ref = `TR-${booking.id + 100000}`;

    // 5. Send notifications
    await smsService.sendSms(
      phone,
      `ZENTARO: Your test ride booking ${ref} for ${model.name} on ${date} at ${timeSlot} is CONFIRMED. Bring your CNIC.`
    );

    await emailService.sendEmail({
      to: email,
      subject: `ZENTARO Test Ride Confirmation [${ref}]`,
      body: `
        <h3>Hello ${name},</h3>
        <p>Your test ride booking at ZENTARO Mobility has been scheduled successfully.</p>
        <hr/>
        <p><b>Booking Reference:</b> ${ref}</p>
        <p><b>Model:</b> ${model.name}</p>
        <p><b>Showroom:</b> ${showroom.name} (${showroom.address})</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Timeslot:</b> ${timeSlot}</p>
        <hr/>
        <p>Please arrive 10 minutes early with a valid CNIC and driving license.</p>
      `,
    });

    return { success: true, bookingRef: ref };
  } catch (error: any) {
    console.error("bookTestRideAction error:", error);
    return { success: false, error: error.message || "Failed to book test ride" };
  }
}
