
/**
 * app/dashboard/page.tsx
 *
 * Server Component — layout shell only.
 * Async data-fetching lives in ./sections.tsx.
 */

import { Suspense } from "react";

import Sidebar  from "../../../components/loggedIn/sideBar";
import TopBar   from "../../../components/dashboard/topBar/topBar";


import {
  KpiSection,
  UsersSection,
  StaffProposalSection,
  TurnaroundSection,
  IncomeSection,
} from "../../../components/dashboard/sections/sections";

/* ── Skeleton placeholder shown while a section streams in ── */
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

          {/* KPI cards */}
          <Suspense fallback={
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <CardSkeleton height={100} />
              <CardSkeleton height={100} />
            </div>
          }>
            <KpiSection />
          </Suspense>

          {/* Users bar chart */}
          <Suspense fallback={<CardSkeleton height={260} />}>
            <UsersSection />
          </Suspense>

          {/* Staff performance + Proposal overview */}
          <Suspense fallback={
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <CardSkeleton height={220} />
              <CardSkeleton height={220} />
            </div>
          }>
            <StaffProposalSection />
          </Suspense>

          {/* Turn around rate */}
          <Suspense fallback={<CardSkeleton height={270} />}>
            <TurnaroundSection />
          </Suspense>

          {/* Income */}
          <Suspense fallback={<CardSkeleton height={270} />}>
            <IncomeSection />
          </Suspense>

          {/* Footer */}
      </>
  );
}