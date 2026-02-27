import KpiCards               from "../kpiCards/kpiCards";
import PipelineChart          from "../pipelineChart/pipelineChart";
import SalesActivities        from "../salesActivities/salesActivites";
import RevenueTrendChart      from "../revenueChart/revenueChart";
import type {
  DashboardKpis,
  DashboardPipeline,
  DashboardSalesPerformance,
  DashboardActivities,
  DashboardRevenue,
} from "../../../lib/placeholderdata";

export function KpiSection({ data }: Readonly<{ data: DashboardKpis }>) {
  return <KpiCards data={data} />;
}

export function PipelineSection({ data }: Readonly<{ data: DashboardPipeline }>) {
  return <PipelineChart data={data} />;
}

export function SalesActivitiesSection({ sales, activities }: Readonly<{ sales: DashboardSalesPerformance; activities: DashboardActivities }>) {
  return <SalesActivities sales={sales} activities={activities} />;
}

export function RevenueTrendSection({ data }: Readonly<{ data: DashboardRevenue }>) {
  return <RevenueTrendChart data={data} />;
}
