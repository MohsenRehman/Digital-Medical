import { NextRequest, NextResponse } from "next/server";
import { SubscriptionEngine } from "@/lib/doctor/subscription/subscriptionEngine";
import { DOCTOR_PLANS, PLAN_COMPARISON_MATRIX } from "@/lib/doctor/subscription/planDefinitions";

export const dynamic = "force-dynamic";

function getAuthenticatedDoctorId(req: NextRequest): string {
  // 1. Check custom header (from authenticated doctor client or test)
  const headerDoctorId = req.headers.get("x-doctor-id");
  if (headerDoctorId) return headerDoctorId;

  // 2. Check cookie
  const cookieDoctorId = req.cookies.get("dm_doctor_id")?.value;
  if (cookieDoctorId) return cookieDoctorId;

  // 3. Fallback to default authenticated doctor in development/demo
  return "doc-tariq-01";
}

export async function GET(req: NextRequest) {
  try {
    const doctorId = getAuthenticatedDoctorId(req);

    // Multi-tenant check: if an explicit query param doctorId is provided and differs from authenticated doctor, block!
    const queryDoctorId = req.nextUrl.searchParams.get("doctorId");
    if (queryDoctorId && queryDoctorId !== doctorId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: You cannot access or inspect another doctor's subscription records.",
        },
        { status: 403 }
      );
    }

    const subscription = await SubscriptionEngine.getSubscription(doctorId);
    const entitlement = SubscriptionEngine.evaluateEntitlement(subscription);

    return NextResponse.json({
      success: true,
      doctorId,
      subscription,
      entitlement,
      plans: DOCTOR_PLANS,
      comparison: PLAN_COMPARISON_MATRIX,
    });
  } catch (error) {
    console.error("Failed to retrieve doctor subscription", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve doctor subscription.",
      },
      { status: 500 }
    );
  }
}
