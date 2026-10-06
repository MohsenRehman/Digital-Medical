/**
 * Doctor Subscription & Plan Entitlement Types
 * Digital Medical Healthcare Platform
 */

export type SubscriptionPlanId = "FREE" | "PRO" | "PREMIUM";

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELLED"
  | "EXPIRED"
  | "PAST_DUE"
  | "TRIALING";

export type BillingCycle = "MONTHLY" | "ANNUAL";

export type EntitlementDecisionCode =
  | "ALLOWED"
  | "BOOKING_LIMIT_REACHED"
  | "SUBSCRIPTION_CANCELLED"
  | "SUBSCRIPTION_EXPIRED"
  | "SUBSCRIPTION_PAST_DUE"
  | "NO_ACTIVE_SUBSCRIPTION"
  | "DOCTOR_NOT_FOUND";

export interface DoctorPlanDefinition {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  bookingLimit: number | null; // null = unlimited
  maxDoctors: number;
  maxLocations: number;
  features: string[];
  recommended?: boolean;
}

export interface DoctorSubscription {
  id: string;
  doctorId: string;
  doctorName?: string;
  planId: SubscriptionPlanId;
  planName: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string; // ISO date string
  currentPeriodEnd: string;   // ISO date string
  bookingLimit: number | null; // null for unlimited
  bookingsUsed: number;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  expiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingEntitlementResult {
  canReceiveBookings: boolean;
  code: EntitlementDecisionCode;
  message: string;
  planId: SubscriptionPlanId;
  status: SubscriptionStatus;
  bookingLimit: number | null;
  bookingsUsed: number;
  bookingsRemaining: number | null; // null for unlimited
  unlimited: boolean;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  upgradeRequired: boolean;
}

export type SubscriptionAuditEventType =
  | "plan_created"
  | "plan_upgraded"
  | "plan_downgraded"
  | "subscription_cancelled"
  | "subscription_reactivated"
  | "subscription_expired"
  | "payment_succeeded"
  | "payment_failed"
  | "booking_limit_reached"
  | "period_renewed"
  | "online_booking_consumed";

export interface SubscriptionAuditLog {
  id: string;
  doctorId: string;
  eventType: SubscriptionAuditEventType;
  actorId: string;
  actorRole: "doctor" | "system" | "admin" | "patient";
  description: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface PlanComparisonFeature {
  name: string;
  category: "Bookings & Practice" | "Clinical Workflow" | "Support & Compliance";
  free: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
}
