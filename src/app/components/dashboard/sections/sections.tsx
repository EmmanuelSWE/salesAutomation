/**
 * app/dashboard/sections.tsx
 *
 * Async Server Components — each fetches its own data slice
 * and renders the matching client component.
 * Imported into page.tsx and wrapped in <Suspense> boundaries.
 */

import { getDashboardData } from "../../../lib/placeholderdata";
import KpiCards          from "../../../components/dashboard/kpiCards/kpiCards";
import UsersChart        from "../../../components/dashboard/userChart/userChart";
import StaffProposal     from "../../../components/dashboard/staffProposal/staffProposal";
import TurnaroundChart   from "../../../components/dashboard/turnaroundChart/turnaroundChart";
import IncomeChart       from "../../../components/dashboard/incomeChart/incomeChart";

export async function KpiSection() {
  const { kpis } = await getDashboardData();
  return <KpiCards data={kpis} />;
}

export async function UsersSection() {
  const { users } = await getDashboardData();
  return <UsersChart data={users} />;
}

export async function StaffProposalSection() {
  const { staffPerformance, proposalOverview } = await getDashboardData();
  return <StaffProposal staff={staffPerformance} proposal={proposalOverview} />;
}

export async function TurnaroundSection() {
  const { turnaround } = await getDashboardData();
  return <TurnaroundChart data={turnaround} />;
}

export async function IncomeSection() {
  const { income } = await getDashboardData();
  return <IncomeChart data={income} />;
}