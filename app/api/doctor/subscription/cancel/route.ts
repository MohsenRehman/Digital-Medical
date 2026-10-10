import { NextRequest, NextResponse } from "next/server";
import { SubscriptionEngine } from "@/lib/doctor/subscription/subscriptionEngine";

function getAuthenticatedDoctorId(req: NextRequest): string {
  const headerDoctorId = req.headers.get("x-doctor-id");
  if (headerDoctorId) return headerDoctorId;
  const cookieDoctorId = req.cookies.get("dm_doctor_id")?.value;
  if (cookieDoctorId) return cookieDoctorId;
  return "doc-tariq-01";
}

export async function POST(req: NextRequest) {
  try {
    const doctorId = getAuthenticatedDoctorId(req);
    const body = await req.json();

    const immediate = Boolean(body.immediate);
    const reason = body.reason || "Doctor voluntary cancellation";

    const result = await SubscriptionEngine.cancelSubscription(doctorId, { immediate, reason });
    const entitlement = SubscriptionEngine.evaluateEntitlement(result.subscription);

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      entitlement,
      message: immediate
        ? "Subscription cancelled immediately. New public online bookings are now blocked."
        : `Subscription will end on ${new Date(result.subscription.currentPeriodEnd).toLocaleDateString()}. Public bookings remain available until then.`,
    });
  } catch (error) {
    console.error("Error cancelling subscription", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel subscription." },
      { status: 500 }
    );
  }
}
