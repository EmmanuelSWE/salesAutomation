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
   DATA FETCHER - Real API Calls
═══════════════════════════════════════════════ */

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchWithAuth(endpoint: string) {
  // Get token from localStorage (client-side) or cookies (server-side)
  let token = '';
  if (globalThis.window !== undefined) {
    token = localStorage.getItem('authToken') || '';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: 'no-store', // Ensure fresh data
  });

  if (!response.ok) {
    console.error(`API Error (${endpoint}):`, response.statusText);
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return response.json();
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    console.log('[getDashboardData] Fetching dashboard data from API...');

    // Fetch all dashboard data in parallel
    const [kpisData, pipelineData, salesData, activitiesData, revenueData] = await Promise.all([
      fetchWithAuth('/api/dashboard/overview').catch(err => {
        console.warn('KPIs fetch failed, using defaults:', err.message);
        return {
          totalOpportunities: 0,
          wonCount: 0,
          winRate: 0,
          pipelineValue: 0,
          activeContracts: 0,
          expiringThisMonth: 0,
        };
      }),
      fetchWithAuth('/api/dashboard/pipeline-metrics').catch(err => {
        console.warn('Pipeline fetch failed, using defaults:', err.message);
        return {
          weightedTotal: 0,
          stages: [],
        };
      }),
      fetchWithAuth('/api/dashboard/sales-performance').catch(err => {
        console.warn('Sales performance fetch failed, using defaults:', err.message);
        return {
          reps: [],
          colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e", "#e91e63"],
        };
      }),
      fetchWithAuth('/api/dashboard/activities-summary').catch(err => {
        console.warn('Activities fetch failed, using defaults:', err.message);
        return {
          upcoming: 0,
          overdue: 0,
          completedToday: 0,
          labels: ["Upcoming", "Overdue", "Completed"],
          data: [0, 0, 0],
          colors: ["#2979ff", "#ef5350", "#4caf50"],
          center: "0",
          centerLabel: "Total",
        };
      }),
      fetchWithAuth('/api/dashboard/revenue').catch(err => {
        console.warn('Revenue fetch failed, using defaults:', err.message);
        return {
          thisMonth: 0,
          thisQuarter: 0,
          thisYear: 0,
          labels: [],
          thisMonthLine: [],
          targetLine: [],
        };
      }),
    ]);

    console.log('[getDashboardData] Successfully fetched all dashboard data');

    return {
      kpis: kpisData,
      pipeline: pipelineData,
      salesPerformance: salesData,
      activities: activitiesData,
      revenue: revenueData,
    };
  } catch (error) {
    console.error('[getDashboardData] Critical error:', error);
    // Return empty/default data structure if all API calls fail
    return {
      kpis: {
        totalOpportunities: 0,
        wonCount: 0,
        winRate: 0,
        pipelineValue: 0,
        activeContracts: 0,
        expiringThisMonth: 0,
      },
      pipeline: {
        weightedTotal: 0,
        stages: [],
      },
      salesPerformance: {
        reps: [],
        colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e", "#e91e63"],
      },
      activities: {
        upcoming: 0,
        overdue: 0,
        completedToday: 0,
        labels: ["Upcoming", "Overdue", "Completed"],
        data: [0, 0, 0],
        colors: ["#2979ff", "#ef5350", "#4caf50"],
        center: "0",
        centerLabel: "Total",
      },
      revenue: {
        thisMonth: 0,
        thisQuarter: 0,
        thisYear: 0,
        labels: [],
        thisMonthLine: [],
        targetLine: [],
      },
    };
  }
}