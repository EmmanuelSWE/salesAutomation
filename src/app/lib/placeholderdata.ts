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

/* GET /api/dashboard/role-funnel */
export interface FunnelRole {
  role:    string;
  revenue: number;
  deals:   number;
}

export interface DashboardFunnel {
  roles: FunnelRole[];
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
  funnel:           DashboardFunnel;
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
    kpis: {
      totalOpportunities: 48,
      wonCount:           30,
      winRate:            62.5,
      pipelineValue:      1_285_000,
      activeContracts:    23,
      expiringThisMonth:  4,
    },
    pipeline: {
      weightedTotal: 872_500,
      stages: [
        { label: "Prospecting",  count: 12, value: 280_000, weightedValue:  56_000 },
        { label: "Qualification",count:  9, value: 420_000, weightedValue: 126_000 },
        { label: "Proposal",     count:  7, value: 310_000, weightedValue: 155_000 },
        { label: "Negotiation",  count:  5, value: 195_000, weightedValue: 136_500 },
        { label: "Closed Won",   count:  8, value: 480_000, weightedValue: 480_000 },
      ],
    },
    funnel: {
      roles: [
        { role: "Sales Reps",                    revenue: 505_000, deals: 38 },
        { role: "Business Development Managers", revenue: 312_000, deals: 24 },
        { role: "Sales Managers",                revenue: 178_000, deals: 14 },
      ],
    },
    salesPerformance: {
      reps: [
        { name: "Alex Rivera",  dealsWon: 11, revenue: 142_000 },
        { name: "Jamie Chen",   dealsWon:  9, revenue: 118_000 },
        { name: "Morgan Davis", dealsWon:  7, revenue:  97_000 },
        { name: "Taylor Kim",   dealsWon:  6, revenue:  85_000 },
        { name: "Sam Ortiz",    dealsWon:  5, revenue:  63_000 },
      ],
      colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e", "#e91e63"],
    },
    activities: {
      upcoming:       14,
      overdue:         5,
      completedToday: 22,
      labels: ["Upcoming", "Overdue", "Completed"],
      data:   [14, 5, 22],
      colors: ["#2979ff", "#ef5350", "#4caf50"],
      center:      "41",
      centerLabel: "Total",
    },
    revenue: {
      thisMonth:   98_500,
      thisQuarter: 274_000,
      thisYear:    842_000,
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      thisMonthLine: [42000, 55000, 61000, 48000, 73000, 80000, 67000, 91000, 85000, 102000, 88000, 98500],
      targetLine:    [60000, 60000, 65000, 65000, 75000, 75000, 80000, 80000, 90000,  90000, 95000, 95000],
    },
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
      kpis:             { ...fallback.kpis,             ...kpisRes.data        },
      pipeline:         { ...fallback.pipeline,         ...pipelineRes.data    },
      funnel:           fallback.funnel,
      salesPerformance: { ...fallback.salesPerformance, ...salesRes.data       },
      activities:       { ...fallback.activities,       ...activitiesRes.data  },
      revenue:          { ...fallback.revenue,          ...revenueRes.data     },
    };
  } catch {
    return fallback;
  }
}