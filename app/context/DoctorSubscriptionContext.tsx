"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DoctorSubscription,
  BookingEntitlementResult,
  DoctorPlanDefinition,
  PlanComparisonFeature,
  SubscriptionPlanId,
  BillingCycle,
  SubscriptionAuditLog,
} from "@/lib/doctor/subscription/types";

interface DoctorSubscriptionContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  subscription: DoctorSubscription | null;
  entitlement: BookingEntitlementResult | null;
  plans: Record<"FREE" | "PRO" | "PREMIUM", DoctorPlanDefinition> | null;
  comparison: PlanComparisonFeature[] | null;
  auditLogs: SubscriptionAuditLog[];
  refreshSubscription: () => Promise<void>;
  changePlan: (planId: SubscriptionPlanId, billingCycle?: BillingCycle) => Promise<{ success: boolean; error?: string }>;
  cancelSubscription: (immediate: boolean, reason?: string) => Promise<{ success: boolean; error?: string }>;
  reactivateSubscription: () => Promise<{ success: boolean; error?: string }>;
}

const DoctorSubscriptionContext = createContext<DoctorSubscriptionContextType | undefined>(undefined);

export function DoctorSubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<DoctorSubscription | null>(null);
  const [entitlement, setEntitlement] = useState<BookingEntitlementResult | null>(null);
  const [plans, setPlans] = useState<Record<"FREE" | "PRO" | "PREMIUM", DoctorPlanDefinition> | null>(null);
  const [comparison, setComparison] = useState<PlanComparisonFeature[] | null>(null);
  const [auditLogs, setAuditLogs] = useState<SubscriptionAuditLog[]>([]);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch current subscription & entitlement
      const res = await fetch("/api/doctor/subscription", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load subscription (HTTP ${res.status})`);
      }
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        setEntitlement(data.entitlement);
        setPlans(data.plans);
        setComparison(data.comparison);
      } else {
        throw new Error(data.error || "Unknown subscription API error");
      }

      // 2. Fetch audit logs in background
      try {
        const logRes = await fetch("/api/doctor/subscription/audit-logs", { cache: "no-store" });
        if (logRes.ok) {
          const logData = await logRes.json();
          if (logData.success && Array.isArray(logData.logs)) {
            setAuditLogs(logData.logs);
          }
        }
      } catch (logErr) {
        console.warn("Could not load subscription audit logs", logErr);
      }
    } catch (err) {
      console.error("Subscription fetch error:", err);
      setError(err instanceof Error ? err.message : "Plan unavailable");
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const changePlan = async (
    planId: SubscriptionPlanId,
    billingCycle: BillingCycle = "MONTHLY"
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/doctor/subscription/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to change subscription plan." };
      }
      setSubscription(data.subscription);
      setEntitlement(data.entitlement);
      await fetchSubscription();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (
    immediate: boolean,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/doctor/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ immediate, reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to cancel subscription." };
      }
      setSubscription(data.subscription);
      setEntitlement(data.entitlement);
      await fetchSubscription();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  const reactivateSubscription = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/doctor/subscription/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to reactivate subscription." };
      }
      setSubscription(data.subscription);
      setEntitlement(data.entitlement);
      await fetchSubscription();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Network error" };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DoctorSubscriptionContext.Provider
      value={{
        isLoaded,
        isLoading,
        error,
        subscription,
        entitlement,
        plans,
        comparison,
        auditLogs,
        refreshSubscription: fetchSubscription,
        changePlan,
        cancelSubscription,
        reactivateSubscription,
      }}
    >
      {children}
    </DoctorSubscriptionContext.Provider>
  );
}

export function useDoctorSubscription() {
  const context = useContext(DoctorSubscriptionContext);
  if (!context) {
    throw new Error("useDoctorSubscription must be used within a DoctorSubscriptionProvider");
  }
  return context;
}
