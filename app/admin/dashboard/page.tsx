"use client";

import React from "react";
import KpiCards from "../components/KpiCards";
import PendingRegistrations from "../components/PendingRegistrations";
import ClinicOverview from "../components/ClinicOverview";
import SubscriptionOverview from "../components/SubscriptionOverview";
import BillingSummary from "../components/BillingSummary";
import RecentActivity from "../components/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Greeting removed as requested */}

      {/* 6 KPI Cards */}
      <section>
        <KpiCards />
      </section>

      {/* Pending Registrations */}
      <section>
        <PendingRegistrations />
      </section>

      {/* Clinic Overview */}
      <section>
        <ClinicOverview />
      </section>

      {/* Bottom Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SubscriptionOverview />
        <BillingSummary />
        <RecentActivity />
      </section>
    </div>
  );
}

