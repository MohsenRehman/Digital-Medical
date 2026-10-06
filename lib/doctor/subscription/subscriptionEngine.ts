/**
 * Production-grade Doctor Subscription & Plan Entitlement Engine
 * Source of truth for doctor subscriptions, limits, and booking entitlements.
 */

import {
  DoctorSubscription,
  SubscriptionPlanId,
  BookingEntitlementResult,
  SubscriptionAuditLog,
  SubscriptionAuditEventType,
  BillingCycle,
} from "./types";
import { DOCTOR_PLANS } from "./planDefinitions";

// In-memory persistent state store for server runtime
interface SubscriptionStoreState {
  subscriptions: Map<string, DoctorSubscription>;
  auditLogs: SubscriptionAuditLog[];
}

// Mutex for ensuring atomic transactions and concurrency safety
class AsyncLock {
  private queues: Map<string, Array<() => void>> = new Map();

  async acquire(key: string): Promise<() => void> {
    if (!this.queues.has(key)) {
      this.queues.set(key, []);
      return () => this.release(key);
    }

    return new Promise((resolve) => {
      const queue = this.queues.get(key)!;
      queue.push(() => resolve(() => this.release(key)));
    });
  }

  private release(key: string): void {
    const queue = this.queues.get(key);
    if (!queue || queue.length === 0) {
      this.queues.delete(key);
      return;
    }
    const next = queue.shift()!;
    next();
  }
}

const lock = new AsyncLock();

// Initial mock baseline subscription (Dr. Tariq Mahmood)
const PRIMARY_DOCTOR_ID = "doc-tariq-01";

function createInitialFreeSubscription(doctorId: string, name?: string): DoctorSubscription {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  return {
    id: `sub_${doctorId}_${Date.now()}`,
    doctorId,
    doctorName: name || (doctorId === PRIMARY_DOCTOR_ID ? "Dr. Tariq Mahmood" : "Doctor"),
    planId: "FREE",
    planName: DOCTOR_PLANS.FREE.name,
    status: "ACTIVE",
    billingCycle: "MONTHLY",
    currentPeriodStart: periodStart,
    currentPeriodEnd: periodEnd,
    bookingLimit: 50,
    bookingsUsed: doctorId === PRIMARY_DOCTOR_ID ? 37 : 0, // Baseline 37/50 used
    cancelAtPeriodEnd: false,
    createdAt: periodStart,
    updatedAt: now.toISOString(),
  };
}

// Global server singleton store across HMR (Next.js hot-reloads)
declare global {
  // eslint-disable-next-line no-var
  var __dm_subscription_store: SubscriptionStoreState | undefined;
}

function getStore(): SubscriptionStoreState {
  if (!global.__dm_subscription_store) {
    const defaultSub = createInitialFreeSubscription(PRIMARY_DOCTOR_ID, "Dr. Tariq Mahmood");
    const subMap = new Map<string, DoctorSubscription>();
    subMap.set(PRIMARY_DOCTOR_ID, defaultSub);

    // Initial audit log
    const initialLogs: SubscriptionAuditLog[] = [
      {
        id: `audit_init_${Date.now()}`,
        doctorId: PRIMARY_DOCTOR_ID,
        eventType: "plan_created",
        actorId: PRIMARY_DOCTOR_ID,
        actorRole: "system",
        description: "Initial Free Plan provisioned with 50 booking limit.",
        timestamp: defaultSub.createdAt,
      },
    ];

    global.__dm_subscription_store = {
      subscriptions: subMap,
      auditLogs: initialLogs,
    };
  }
  return global.__dm_subscription_store;
}

export class SubscriptionEngine {
  /**
   * Log an audit event
   */
  private static addAuditLog(
    doctorId: string,
    eventType: SubscriptionAuditEventType,
    description: string,
    metadata?: Record<string, unknown>,
    actorRole: "doctor" | "system" | "admin" | "patient" = "doctor"
  ): void {
    const store = getStore();
    const log: SubscriptionAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      doctorId,
      eventType,
      actorId: doctorId,
      actorRole,
      description,
      metadata,
      timestamp: new Date().toISOString(),
    };
    store.auditLogs.unshift(log);
  }

  /**
   * Get all audit logs for a doctor
   */
  static getAuditLogs(doctorId: string): SubscriptionAuditLog[] {
    const store = getStore();
    return store.auditLogs.filter((l) => l.doctorId === doctorId);
  }

  /**
   * Rollover monthly billing period if current period has ended
   */
  private static checkAndRolloverPeriod(sub: DoctorSubscription, now: Date = new Date()): DoctorSubscription {
    const periodEnd = new Date(sub.currentPeriodEnd);

    if (now <= periodEnd) {
      return sub;
    }

    // Period has expired!
    const subCopy: DoctorSubscription = { ...sub };

    if (sub.planId === "FREE") {
      // Free plan automatic monthly reset
      const newPeriodStart = periodEnd.toISOString();
      const nextEndDate = new Date(periodEnd);
      nextEndDate.setMonth(nextEndDate.getMonth() + 1);

      subCopy.currentPeriodStart = newPeriodStart;
      subCopy.currentPeriodEnd = nextEndDate.toISOString();
      subCopy.bookingsUsed = 0; // RESET TO 0 FOR NEW BILLING PERIOD
      subCopy.status = "ACTIVE";
      subCopy.updatedAt = now.toISOString();

      this.addAuditLog(
        sub.doctorId,
        "period_renewed",
        `Monthly billing period rolled over. Online booking count reset to 0 / 50.`,
        { oldPeriodEnd: sub.currentPeriodEnd, newPeriodEnd: subCopy.currentPeriodEnd },
        "system"
      );
    } else {
      // Paid plan (PRO / PREMIUM)
      if (sub.cancelAtPeriodEnd) {
        // Scheduled cancellation takes effect at end of period
        subCopy.status = "EXPIRED";
        subCopy.expiredAt = sub.currentPeriodEnd;
        subCopy.updatedAt = now.toISOString();

        this.addAuditLog(
          sub.doctorId,
          "subscription_expired",
          `Paid ${sub.planName} period ended. Subscription transitioned to EXPIRED.`,
          { expiredAt: subCopy.expiredAt },
          "system"
        );
      } else {
        // Active auto-renewing paid subscription
        const newPeriodStart = periodEnd.toISOString();
        const nextEndDate = new Date(periodEnd);
        if (sub.billingCycle === "ANNUAL") {
          nextEndDate.setFullYear(nextEndDate.getFullYear() + 1);
        } else {
          nextEndDate.setMonth(nextEndDate.getMonth() + 1);
        }

        subCopy.currentPeriodStart = newPeriodStart;
        subCopy.currentPeriodEnd = nextEndDate.toISOString();
        subCopy.updatedAt = now.toISOString();

        this.addAuditLog(
          sub.doctorId,
          "period_renewed",
          `Subscription auto-renewed for another ${sub.billingCycle.toLowerCase()} cycle.`,
          { nextEndDate: subCopy.currentPeriodEnd },
          "system"
        );
      }
    }

    return subCopy;
  }

  /**
   * Fetch current subscription for doctor, automatically handling period rollover
   */
  static async getSubscription(doctorId: string, now: Date = new Date()): Promise<DoctorSubscription> {
    const release = await lock.acquire(doctorId);
    try {
      const store = getStore();
      let sub = store.subscriptions.get(doctorId);

      if (!sub) {
        sub = createInitialFreeSubscription(doctorId);
        store.subscriptions.set(doctorId, sub);
        this.addAuditLog(
          doctorId,
          "plan_created",
          `Provisioned standard Free tier for doctor ${doctorId}.`,
          undefined,
          "system"
        );
      }

      // Check for billing period rollover
      const updatedSub = this.checkAndRolloverPeriod(sub, now);
      if (updatedSub !== sub) {
        store.subscriptions.set(doctorId, updatedSub);
        sub = updatedSub;
      }

      return { ...sub };
    } finally {
      release();
    }
  }

  /**
   * Synchronously evaluate entitlement from a given subscription record and point in time
   */
  static evaluateEntitlement(sub: DoctorSubscription, now: Date = new Date()): BookingEntitlementResult {
    const isFree = sub.planId === "FREE";
    const limit = sub.bookingLimit;
    const used = sub.bookingsUsed;
    const remaining = limit !== null ? Math.max(0, limit - used) : null;
    const periodEnd = new Date(sub.currentPeriodEnd);

    // 1. Check if past current period
    if (now > periodEnd && sub.status !== "EXPIRED" && sub.status !== "CANCELLED") {
      if (sub.cancelAtPeriodEnd) {
        return {
          canReceiveBookings: false,
          code: "SUBSCRIPTION_EXPIRED",
          message: "Your subscription has expired. Choose a plan to receive new online bookings.",
          planId: sub.planId,
          status: "EXPIRED",
          bookingLimit: limit,
          bookingsUsed: used,
          bookingsRemaining: 0,
          unlimited: false,
          cancelAtPeriodEnd: true,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          upgradeRequired: true,
        };
      }
    }

    // 2. Status checks
    if (sub.status === "CANCELLED") {
      return {
        canReceiveBookings: false,
        code: "SUBSCRIPTION_CANCELLED",
        message: "Your plan has been cancelled. Online bookings are currently unavailable.",
        planId: sub.planId,
        status: "CANCELLED",
        bookingLimit: limit,
        bookingsUsed: used,
        bookingsRemaining: 0,
        unlimited: false,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        upgradeRequired: true,
      };
    }

    if (sub.status === "EXPIRED") {
      return {
        canReceiveBookings: false,
        code: "SUBSCRIPTION_EXPIRED",
        message: "Your subscription has expired. Choose a plan to receive new online bookings.",
        planId: sub.planId,
        status: "EXPIRED",
        bookingLimit: limit,
        bookingsUsed: used,
        bookingsRemaining: 0,
        unlimited: false,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        upgradeRequired: true,
      };
    }

    if (sub.status === "PAST_DUE") {
      return {
        canReceiveBookings: false,
        code: "SUBSCRIPTION_PAST_DUE",
        message: "Your subscription payment is past due. Please update billing to resume bookings.",
        planId: sub.planId,
        status: "PAST_DUE",
        bookingLimit: limit,
        bookingsUsed: used,
        bookingsRemaining: 0,
        unlimited: false,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        upgradeRequired: true,
      };
    }

    // 3. Paid plans with ACTIVE status
    if (sub.planId === "PRO" || sub.planId === "PREMIUM") {
      return {
        canReceiveBookings: true,
        code: "ALLOWED",
        message: "Unlimited public online bookings active.",
        planId: sub.planId,
        status: sub.status,
        bookingLimit: null,
        bookingsUsed: used,
        bookingsRemaining: null,
        unlimited: true,
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
        upgradeRequired: false,
      };
    }

    // 4. Free Plan Quota Check
    if (isFree) {
      if (used < (limit ?? 50)) {
        return {
          canReceiveBookings: true,
          code: "ALLOWED",
          message: `${remaining} online booking${remaining === 1 ? "" : "s"} remaining this period.`,
          planId: "FREE",
          status: sub.status,
          bookingLimit: limit ?? 50,
          bookingsUsed: used,
          bookingsRemaining: remaining,
          unlimited: false,
          cancelAtPeriodEnd: false,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          upgradeRequired: false,
        };
      } else {
        // Limit reached: 50/50
        return {
          canReceiveBookings: false,
          code: "BOOKING_LIMIT_REACHED",
          message: "Your monthly online booking limit has been reached (50 of 50 used).",
          planId: "FREE",
          status: sub.status,
          bookingLimit: limit ?? 50,
          bookingsUsed: used,
          bookingsRemaining: 0,
          unlimited: false,
          cancelAtPeriodEnd: false,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          upgradeRequired: true,
        };
      }
    }

    return {
      canReceiveBookings: false,
      code: "NO_ACTIVE_SUBSCRIPTION",
      message: "No active subscription found.",
      planId: sub.planId,
      status: sub.status,
      bookingLimit: 0,
      bookingsUsed: 0,
      bookingsRemaining: 0,
      unlimited: false,
      cancelAtPeriodEnd: false,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      upgradeRequired: true,
    };
  }

  /**
   * Public check for booking entitlement
   */
  static async canReceiveOnlineBooking(doctorId: string, now: Date = new Date()): Promise<BookingEntitlementResult> {
    const sub = await this.getSubscription(doctorId, now);
    return this.evaluateEntitlement(sub, now);
  }

  /**
   * ATOMIC TRANSACTION: Check entitlement and consume 1 public booking slot.
   * Prevents race conditions (e.g. two concurrent patients booking slot 50/50).
   */
  static async consumeBookingSlot(
    doctorId: string,
    appointmentMeta: { patientName?: string; appointmentId?: string },
    now: Date = new Date()
  ): Promise<{ success: boolean; entitlement: BookingEntitlementResult; error?: string }> {
    const release = await lock.acquire(doctorId);
    try {
      const store = getStore();
      let sub = store.subscriptions.get(doctorId);

      if (!sub) {
        sub = createInitialFreeSubscription(doctorId);
        store.subscriptions.set(doctorId, sub);
      }

      // Check rollover
      sub = this.checkAndRolloverPeriod(sub, now);
      store.subscriptions.set(doctorId, sub);

      // Evaluate entitlement under lock
      const entitlement = this.evaluateEntitlement(sub, now);

      if (!entitlement.canReceiveBookings) {
        // Blocked!
        return {
          success: false,
          entitlement,
          error: entitlement.message,
        };
      }

      // If allowed, increment booking quota atomically for Free plan
      if (sub.planId === "FREE") {
        const nextUsed = sub.bookingsUsed + 1;
        sub.bookingsUsed = nextUsed;
        sub.updatedAt = now.toISOString();
        store.subscriptions.set(doctorId, sub);

        this.addAuditLog(
          doctorId,
          "online_booking_consumed",
          `Public patient online booking consumed 1 slot (${nextUsed}/${sub.bookingLimit}). Patient: ${appointmentMeta.patientName || "Anonymous"}`,
          { appointmentId: appointmentMeta.appointmentId, bookingsUsed: nextUsed },
          "patient"
        );

        if (nextUsed >= (sub.bookingLimit ?? 50)) {
          this.addAuditLog(
            doctorId,
            "booking_limit_reached",
            `Doctor reached monthly online booking limit (50/50). New public bookings are now blocked until period renewal or plan upgrade.`,
            { limit: sub.bookingLimit },
            "system"
          );
        }
      } else {
        // Paid unlimited plan
        sub.bookingsUsed += 1;
        sub.updatedAt = now.toISOString();
        store.subscriptions.set(doctorId, sub);

        this.addAuditLog(
          doctorId,
          "online_booking_consumed",
          `Public patient online booking recorded on unlimited ${sub.planName}.`,
          { appointmentId: appointmentMeta.appointmentId },
          "patient"
        );
      }

      const updatedEntitlement = this.evaluateEntitlement(sub, now);

      return {
        success: true,
        entitlement: updatedEntitlement,
      };
    } finally {
      release();
    }
  }

  /**
   * Cancel subscription (immediate vs at period end)
   */
  static async cancelSubscription(
    doctorId: string,
    options: { immediate: boolean; reason?: string },
    now: Date = new Date()
  ): Promise<{ success: boolean; subscription: DoctorSubscription }> {
    const release = await lock.acquire(doctorId);
    try {
      const store = getStore();
      const sub = await this.getSubscription(doctorId, now);

      if (options.immediate) {
        sub.status = "CANCELLED";
        sub.cancelAtPeriodEnd = false;
        sub.cancelledAt = now.toISOString();
        sub.updatedAt = now.toISOString();

        this.addAuditLog(
          doctorId,
          "subscription_cancelled",
          `Subscription cancelled with IMMEDIATE effect. New public patient bookings blocked immediately. Reason: ${options.reason || "Doctor voluntary cancellation"}.`,
          { immediate: true, reason: options.reason },
          "doctor"
        );
      } else {
        sub.cancelAtPeriodEnd = true;
        sub.cancelledAt = now.toISOString();
        sub.updatedAt = now.toISOString();

        this.addAuditLog(
          doctorId,
          "subscription_cancelled",
          `Subscription scheduled for cancellation at period end (${sub.currentPeriodEnd}). Public bookings remain active until period expiry. Reason: ${options.reason || "Doctor voluntary cancellation"}.`,
          { immediate: false, currentPeriodEnd: sub.currentPeriodEnd },
          "doctor"
        );
      }

      store.subscriptions.set(doctorId, sub);
      return { success: true, subscription: { ...sub } };
    } finally {
      release();
    }
  }

  /**
   * Upgrade or change subscription plan
   */
  static async changePlan(
    doctorId: string,
    newPlanId: SubscriptionPlanId,
    billingCycle: BillingCycle = "MONTHLY",
    now: Date = new Date()
  ): Promise<{ success: boolean; subscription: DoctorSubscription }> {
    const release = await lock.acquire(doctorId);
    try {
      const store = getStore();
      const currentSub = await this.getSubscription(doctorId, now);
      const targetPlan = DOCTOR_PLANS[newPlanId];

      const periodStart = now.toISOString();
      const nextEnd = new Date(now);
      if (billingCycle === "ANNUAL") {
        nextEnd.setFullYear(nextEnd.getFullYear() + 1);
      } else {
        nextEnd.setMonth(nextEnd.getMonth() + 1);
      }

      const isUpgrade =
        (currentSub.planId === "FREE" && (newPlanId === "PRO" || newPlanId === "PREMIUM")) ||
        (currentSub.planId === "PRO" && newPlanId === "PREMIUM");

      const eventType = isUpgrade ? "plan_upgraded" : newPlanId === currentSub.planId ? "period_renewed" : "plan_downgraded";

      const updatedSub: DoctorSubscription = {
        id: `sub_${doctorId}_${Date.now()}`,
        doctorId,
        doctorName: currentSub.doctorName,
        planId: newPlanId,
        planName: targetPlan.name,
        status: "ACTIVE",
        billingCycle,
        currentPeriodStart: periodStart,
        currentPeriodEnd: nextEnd.toISOString(),
        bookingLimit: targetPlan.bookingLimit,
        bookingsUsed: newPlanId === "FREE" ? 0 : 0, // Fresh quota for new period
        cancelAtPeriodEnd: false,
        cancelledAt: undefined,
        expiredAt: undefined,
        createdAt: currentSub.createdAt,
        updatedAt: now.toISOString(),
      };

      store.subscriptions.set(doctorId, updatedSub);

      this.addAuditLog(
        doctorId,
        eventType,
        `Doctor changed plan from ${currentSub.planName} (${currentSub.status}) to ${targetPlan.name} (${billingCycle}).`,
        { oldPlan: currentSub.planId, newPlan: newPlanId, billingCycle },
        "doctor"
      );

      if (newPlanId !== "FREE") {
        this.addAuditLog(
          doctorId,
          "payment_succeeded",
          `Payment of Rs. ${billingCycle === "ANNUAL" ? targetPlan.priceAnnual : targetPlan.priceMonthly} processed successfully for ${targetPlan.name}.`,
          { amount: billingCycle === "ANNUAL" ? targetPlan.priceAnnual : targetPlan.priceMonthly },
          "system"
        );
      }

      return { success: true, subscription: { ...updatedSub } };
    } finally {
      release();
    }
  }

  /**
   * Reactivate a cancelled subscription (if cancelled before period end)
   */
  static async reactivateSubscription(
    doctorId: string,
    now: Date = new Date()
  ): Promise<{ success: boolean; subscription: DoctorSubscription }> {
    const release = await lock.acquire(doctorId);
    try {
      const store = getStore();
      const sub = await this.getSubscription(doctorId, now);

      sub.cancelAtPeriodEnd = false;
      sub.cancelledAt = undefined;
      sub.status = "ACTIVE";
      sub.updatedAt = now.toISOString();

      store.subscriptions.set(doctorId, sub);

      this.addAuditLog(
        doctorId,
        "subscription_reactivated",
        `Doctor reactivated ${sub.planName}. Continuous auto-renewal restored.`,
        undefined,
        "doctor"
      );

      return { success: true, subscription: { ...sub } };
    } finally {
      release();
    }
  }

  /**
   * Test fixture helper: Allows programmatic configuration of doctor subscription
   * for deterministic acceptance testing.
   */
  static async setTestSubscriptionState(
    doctorId: string,
    state: Partial<DoctorSubscription>
  ): Promise<DoctorSubscription> {
    const release = await lock.acquire(doctorId);
    try {
      const store = getStore();
      const current = store.subscriptions.get(doctorId) || createInitialFreeSubscription(doctorId);
      const merged: DoctorSubscription = {
        ...current,
        ...state,
        updatedAt: new Date().toISOString(),
      };
      store.subscriptions.set(doctorId, merged);
      return { ...merged };
    } finally {
      release();
    }
  }
}
