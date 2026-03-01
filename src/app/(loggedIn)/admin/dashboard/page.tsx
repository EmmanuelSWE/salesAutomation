"use client";

import { useEffect, useState } from "react";
import {
  KpiSection,
  PipelineSection,
  SalesActivitiesSection,
  RevenueTrendSection,
} from "../../../components/dashboard/sections/sections";
import { getDashboardData } from "../../../lib/placeholderdata";
import type { DashboardData } from "../../../lib/placeholderdata";

function CardSkeleton({ height = 200 }: Readonly<{ height?: number }>) {
  return (
    <div
      style={{
        background: "#2e2e2e",
        borderRadius: 14,
        height,
        opacity: 0.5,
        animation: "pulse 1.4s ease-in-out infinite",
      }}
    />
  );
}

export default function DashboardPage() {
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {["kpi-a","kpi-b","kpi-c","kpi-d"].map((k) => <CardSkeleton key={k} height={100} />)}
        </div>
        <CardSkeleton height={300} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <CardSkeleton height={260} />
          <CardSkeleton height={260} />
        </div>
        <CardSkeleton height={300} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: 10 }}>
        <KpiSection data={data.kpis} />
      </div>
      <div style={{ padding: 10 }}>
        <PipelineSection data={data.funnel} />
      </div>
      <div style={{ padding: 10 }}>
        <SalesActivitiesSection sales={data.salesPerformance} activities={data.activities} />
      </div>
      <div style={{ padding: 10 }}>
        <RevenueTrendSection data={data.revenue} />
      </div>
    </div>
  );
}
