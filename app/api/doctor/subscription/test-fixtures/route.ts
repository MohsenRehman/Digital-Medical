import { NextRequest, NextResponse } from "next/server";
import { SubscriptionEngine } from "@/lib/doctor/subscription/subscriptionEngine";
import { DoctorSubscription } from "@/lib/doctor/subscription/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, state } = body;

    if (!doctorId) {
      return NextResponse.json({ success: false, error: "doctorId required" }, { status: 400 });
    }

    const updated = await SubscriptionEngine.setTestSubscriptionState(
      doctorId,
      state as Partial<DoctorSubscription>
    );

    const entitlement = SubscriptionEngine.evaluateEntitlement(updated);

    return NextResponse.json({
      success: true,
      subscription: updated,
      entitlement,
    });
  } catch (error) {
    console.error("Failed to set test subscription fixture", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId") || "doc-tariq-01";
    const sub = await SubscriptionEngine.getSubscription(doctorId);
    const entitlement = SubscriptionEngine.evaluateEntitlement(sub);
    return NextResponse.json({ success: true, subscription: sub, entitlement });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
