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
    const result = await SubscriptionEngine.reactivateSubscription(doctorId);
    const entitlement = SubscriptionEngine.evaluateEntitlement(result.subscription);

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      entitlement,
      message: `Subscription reactivated successfully. Continuous auto-renewal restored.`,
    });
  } catch (error) {
    console.error("Error reactivating subscription", error);
    return NextResponse.json(
      { success: false, error: "Failed to reactivate subscription." },
      { status: 500 }
    );
  }
}
