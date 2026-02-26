import { getDashboardData }   from "../../../lib/placeholderdata";
import KpiCards               from "../kpiCards/kpiCards";
import PipelineChart          from "../pipelineChart/pipelineChart";
import SalesActivities        from "../salesActivities/salesActivites";
import RevenueTrendChart      from "../revenueChart/revenueChart";

export async function KpiSection() {
  const { kpis } = await getDashboardData();
  return <KpiCards data={kpis} />;
}

export async function PipelineSection() {
  const { pipeline } = await getDashboardData();
  return <PipelineChart data={pipeline} />;
}

export async function SalesActivitiesSection() {
  const { salesPerformance, activities } = await getDashboardData();
  return <SalesActivities sales={salesPerformance} activities={activities} />;
}

export async function RevenueTrendSection() {
  const { revenue } = await getDashboardData();
  return <RevenueTrendChart data={revenue} />;
}