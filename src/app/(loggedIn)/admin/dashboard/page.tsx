import { Suspense } from "react";
import {
  KpiSection,
  PipelineSection,
  SalesActivitiesSection,
  RevenueTrendSection,
} from "../../../components/dashboard/sections/sections";

function CardSkeleton({ height = 200 }: { height?: number }) {
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
  return (
    <>
      {/* ── 4 KPI cards ── */}
      <Suspense fallback={
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} height={100} />
          ))}
        </div>
      }>
        <KpiSection />
      </Suspense>

      {/* ── Pipeline by stage — full width bar chart ── */}
      <Suspense fallback={<CardSkeleton height={300} />}>
        <PipelineSection />
      </Suspense>

      {/* ── Sales + Activities side by side ── */}
      <Suspense fallback={
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <CardSkeleton height={260} />
          <CardSkeleton height={260} />
        </div>
      }>
        <SalesActivitiesSection />
      </Suspense>

      {/* ── Revenue trend — always full width ── */}
      <Suspense fallback={<CardSkeleton height={300} />}>
        <RevenueTrendSection />
      </Suspense>
    </>
  );
}