import { NextRequest, NextResponse } from "next/server";
import { SubscriptionEngine } from "@/lib/doctor/subscription/subscriptionEngine";

interface RouteParams {
  params: {
    doctorId: string;
  };
}

/**
 * GET /api/public/doctors/[doctorId]/appointments
 * Checks doctor public booking eligibility before booking form submission.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { doctorId } = params;
    const entitlement = await SubscriptionEngine.canReceiveOnlineBooking(doctorId);

    if (!entitlement.canReceiveBookings) {
      return NextResponse.json(
        {
          success: false,
          code: entitlement.code,
          message: entitlement.message,
          plan: entitlement.planId,
          used: entitlement.bookingsUsed,
          limit: entitlement.bookingLimit,
          upgradeRequired: entitlement.upgradeRequired,
        },
        { status: entitlement.code === "BOOKING_LIMIT_REACHED" ? 409 : 403 }
      );
    }

    return NextResponse.json({
      success: true,
      code: "ALLOWED",
      message: "Doctor is eligible to receive online patient bookings.",
      plan: entitlement.planId,
      used: entitlement.bookingsUsed,
      limit: entitlement.bookingLimit,
      remaining: entitlement.bookingsRemaining,
      unlimited: entitlement.unlimited,
    });
  } catch (error) {
    console.error("Error evaluating public booking eligibility", error);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "Failed to verify doctor availability.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/public/doctors/[doctorId]/appointments
 * Atomically checks entitlement and consumes 1 public booking slot,
 * returning structured error if blocked.
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { doctorId } = params;
    const body = await req.json().catch(() => ({}));

    // Verify booking source:
    // Only public online patient bookings consume quota.
    // Internal walk-in, manual doctor appointments, or reschedules do NOT consume quota.
    const isInternalWalkIn = body.source === "reception_walk_in" || body.source === "doctor_manual";
    const isReschedule = Boolean(body.isReschedule);

    if (isInternalWalkIn || isReschedule) {
      // Internal or reschedule does not consume quota!
      const appointmentId = `apt_int_${Date.now()}`;
      return NextResponse.json(
        {
          success: true,
          appointmentId,
          bookingRef: `DM-INT-${Math.floor(1000 + Math.random() * 9000)}`,
          quotaConsumed: false,
          reason: isReschedule ? "Patient reschedule" : "Internal clinical appointment",
          message: "Internal appointment recorded without consuming public online quota.",
        },
        { status: 201 }
      );
    }

    // Atomic transaction: verify entitlement and consume slot
    const appointmentId = body.appointmentId || `apt_${Date.now()}`;
    const result = await SubscriptionEngine.consumeBookingSlot(doctorId, {
      patientName: body.patientName || "Online Patient",
      appointmentId,
    });

    if (!result.success) {
      const ent = result.entitlement;
      const statusHttp = ent.code === "BOOKING_LIMIT_REACHED" ? 409 : 403;

      return NextResponse.json(
        {
          success: false,
          code: ent.code,
          message: ent.message,
          plan: ent.planId,
          used: ent.bookingsUsed,
          limit: ent.bookingLimit,
          upgradeRequired: ent.upgradeRequired,
        },
        { status: statusHttp }
      );
    }

    // Successfully consumed quota!
    const bookingRef = `DM-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json(
      {
        success: true,
        appointmentId,
        bookingRef,
        quotaConsumed: true,
        plan: result.entitlement.planId,
        used: result.entitlement.bookingsUsed,
        limit: result.entitlement.bookingLimit,
        remaining: result.entitlement.bookingsRemaining,
        unlimited: result.entitlement.unlimited,
        message: "Public online appointment successfully scheduled.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating public appointment", error);
    return NextResponse.json(
      {
        success: false,
        code: "SERVER_ERROR",
        message: "An unexpected error occurred while scheduling the appointment.",
      },
      { status: 500 }
    );
  }
}
