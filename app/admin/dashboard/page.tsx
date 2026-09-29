"use client";

import React from "react";
import KpiCards from "../components/KpiCards";
import PendingRegistrations from "../components/PendingRegistrations";
import ClinicOverview from "../components/ClinicOverview";
import AllClinicsTable from "../components/AllClinicsTable";
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

      {/* Two-column row: Chart & Recent Activities */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClinicOverview />
        <RecentActivity />
      </section>

      {/* Pending Registrations */}
      <section>
        <PendingRegistrations />
      </section>

      {/* All Clinics Table */}
      <section>
        <AllClinicsTable />
      </section>

      {/* Bottom Grid for remaining widgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubscriptionOverview />
        <BillingSummary />
      </section>
    </div>
  );
}

