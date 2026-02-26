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

/* ═══════════════════════════════════════════════
   DATA FETCHER
   Replace each block with your real API call:
     fetch("/api/dashboard/overview")
     fetch("/api/dashboard/pipeline-metrics")
     fetch("/api/dashboard/sales-performance")
     fetch("/api/dashboard/activities-summary")
═══════════════════════════════════════════════ */
export async function getDashboardData(): Promise<DashboardData> {
  // Simulated delay — remove in production
  await new Promise((r) => setTimeout(r, 300));

  return {
    /* ── GET /api/dashboard/overview ── */
    kpis: {
      totalOpportunities: 42,
      wonCount:           8,
      winRate:            19.05,
      pipelineValue:      1250000,
      activeContracts:    15,
      expiringThisMonth:  2,
    },

    /* ── GET /api/dashboard/pipeline-metrics ── */
    pipeline: {
      weightedTotal: 430000,
      stages: [
        { label: "Prospecting",   count: 12, value: 320000,  weightedValue: 48000  },
        { label: "Qualification", count: 9,  value: 275000,  weightedValue: 82500  },
        { label: "Proposal",      count: 7,  value: 410000,  weightedValue: 123000 },
        { label: "Negotiation",   count: 5,  value: 290000,  weightedValue: 116000 },
        { label: "Closed Won",    count: 8,  value: 380000,  weightedValue: 380000 },
        { label: "Closed Lost",   count: 6,  value: 195000,  weightedValue: 0      },
      ],
    },

    /* ── GET /api/dashboard/sales-performance ── */
    salesPerformance: {
      colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e", "#e91e63"],
      reps: [
        { name: "Alice M.",  dealsWon: 14, revenue: 420000 },
        { name: "James T.",  dealsWon: 11, revenue: 310000 },
        { name: "Sara K.",   dealsWon: 9,  revenue: 270000 },
        { name: "David R.",  dealsWon: 7,  revenue: 185000 },
        { name: "Nina P.",   dealsWon: 5,  revenue: 115000 },
      ],
    },

    /* ── GET /api/dashboard/activities-summary ── */
    activities: {
      upcoming:       12,
      overdue:        3,
      completedToday: 5,
      labels:  ["Upcoming", "Overdue", "Completed"],
      data:    [12, 3, 5],
      colors:  ["#2979ff", "#ef5350", "#4caf50"],
      center:  "20",
      centerLabel: "Total",
    },

    /* ── GET /api/dashboard/overview → revenue ── */
    revenue: {
      thisMonth:     180000,
      thisQuarter:   520000,
      thisYear:      1100000,
      labels:        ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      thisMonthLine: [95000, 112000, 130000, 158000, 145000, 180000],
      targetLine:    [100000, 110000, 120000, 140000, 155000, 170000],
    },
  };
}