import { NextRequest, NextResponse } from "next/server";
import { SubscriptionEngine } from "@/lib/doctor/subscription/subscriptionEngine";

export const dynamic = "force-dynamic";

function getAuthenticatedDoctorId(req: NextRequest): string {
  const headerDoctorId = req.headers.get("x-doctor-id");
  if (headerDoctorId) return headerDoctorId;
  const cookieDoctorId = req.cookies.get("dm_doctor_id")?.value;
  if (cookieDoctorId) return cookieDoctorId;
  return "doc-tariq-01";
}

export async function GET(req: NextRequest) {
  try {
    const doctorId = getAuthenticatedDoctorId(req);

    // Multi-tenant protection
    const queryDoctorId = req.nextUrl.searchParams.get("doctorId");
    if (queryDoctorId && queryDoctorId !== doctorId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to audit logs." },
        { status: 403 }
      );
    }

    const logs = SubscriptionEngine.getAuditLogs(doctorId);
    return NextResponse.json({
      success: true,
      doctorId,
      logs,
    });
  } catch (error) {
    console.error("Error retrieving subscription audit logs", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve audit logs." },
      { status: 500 }
    );
  }
}
