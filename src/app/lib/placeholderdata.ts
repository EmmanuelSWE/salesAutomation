/* ═══════════════════════════════════════════════
   TYPES  —  matching GET /api/dashboard/* shape
═══════════════════════════════════════════════ */

/* GET /api/dashboard/overview → opportunities + contracts */
export interface DashboardKpis {
  totalOpportunities: number;
  winRate:            number;
  pipelineValue:      number;
  activeContracts:    number;
  wonCount:           number;
  expiringThisMonth:  number;
}

/* GET /api/dashboard/pipeline-metrics */
export interface PipelineStage {
  label:         string;
  count:         number;
  value:         number;
  weightedValue: number;
}

export interface DashboardPipeline {
  stages:        PipelineStage[];
  weightedTotal: number;
}

/* GET /api/dashboard/sales-performance */
export interface SalesRep {
  name:     string;
  dealsWon: number;
  revenue:  number;
}

export interface DashboardSalesPerformance {
  reps:   SalesRep[];
  colors: string[];
}

/* GET /api/dashboard/activities-summary */
export interface DashboardActivities {
  upcoming:       number;
  overdue:        number;
  completedToday: number;
  labels:      string[];
  data:        number[];
  colors:      string[];
  center:      string;
  centerLabel: string;
}

/* GET /api/dashboard/overview → revenue */
export interface DashboardRevenue {
  labels:        string[];
  thisMonthLine: number[];
  targetLine:    number[];
  thisMonth:     number;
  thisQuarter:   number;
  thisYear:      number;
}

/* Root shape returned by getDashboardData() */
export interface DashboardData {
  kpis:             DashboardKpis;
  pipeline:         DashboardPipeline;
  salesPerformance: DashboardSalesPerformance;
  activities:       DashboardActivities;
  revenue:          DashboardRevenue;
}

import api from "./utils/axiosInstance";

/* ═══════════════════════════════════════════════
   DATA FETCHER - uses axios instance (token from localStorage)
═══════════════════════════════════════════════ */

export async function getDashboardData(): Promise<DashboardData> {
  const fallback: DashboardData = {
    kpis:             { totalOpportunities: 0, wonCount: 0, winRate: 0, pipelineValue: 0, activeContracts: 0, expiringThisMonth: 0 },
    pipeline:         { weightedTotal: 0, stages: [] },
    salesPerformance: { reps: [], colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e", "#e91e63"] },
    activities:       { upcoming: 0, overdue: 0, completedToday: 0, labels: ["Upcoming", "Overdue", "Completed"], data: [0, 0, 0], colors: ["#2979ff", "#ef5350", "#4caf50"], center: "0", centerLabel: "Total" },
    revenue:          { thisMonth: 0, thisQuarter: 0, thisYear: 0, labels: [], thisMonthLine: [], targetLine: [] },
  };

  try {
    const [kpisRes, pipelineRes, salesRes, activitiesRes, revenueRes] = await Promise.all([
      api.get("/dashboard/overview").catch(() => ({ data: fallback.kpis })),
      api.get("/dashboard/pipeline-metrics").catch(() => ({ data: fallback.pipeline })),
      api.get("/dashboard/sales-performance").catch(() => ({ data: fallback.salesPerformance })),
      api.get("/dashboard/activities-summary").catch(() => ({ data: fallback.activities })),
      api.get("/dashboard/revenue").catch(() => ({ data: fallback.revenue })),
    ]);

    return {
      kpis:             kpisRes.data ?? fallback.kpis,
      pipeline:         pipelineRes.data ?? fallback.pipeline,
      salesPerformance: salesRes.data ?? fallback.salesPerformance,
      activities:       activitiesRes.data ?? fallback.activities,
      revenue:          revenueRes.data ?? fallback.revenue,
    };
  } catch {
    return fallback;
  }
}