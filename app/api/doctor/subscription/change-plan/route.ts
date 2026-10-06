import { NextRequest, NextResponse } from "next/server";
import { SubscriptionEngine } from "@/lib/doctor/subscription/subscriptionEngine";
import { SubscriptionPlanId, BillingCycle } from "@/lib/doctor/subscription/types";

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

    const planId: SubscriptionPlanId = body.planId;
    const billingCycle: BillingCycle = body.billingCycle || "MONTHLY";

    if (!["FREE", "PRO", "PREMIUM"].includes(planId)) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription plan specified." },
        { status: 400 }
      );
    }

    const result = await SubscriptionEngine.changePlan(doctorId, planId, billingCycle);
    const entitlement = SubscriptionEngine.evaluateEntitlement(result.subscription);

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      entitlement,
      message: `Successfully switched to ${result.subscription.planName}.`,
    });
  } catch (error) {
    console.error("Error changing subscription plan", error);
    return NextResponse.json(
      { success: false, error: "Failed to update subscription plan." },
      { status: 500 }
    );
  }
}
