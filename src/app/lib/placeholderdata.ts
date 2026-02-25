
export interface DashboardKpis {
  clients: number;
  clientsTrend: number;
  staff: number;
  staffTrend: number;
}

export interface DashboardUsers {
  total: number;
  bars: number[];
  oldPct: number;
  newPct: number;
  lowPct: number;
}

export interface DashboardStaffPerformance {
  labels: string[];
  data: number[];
  colors: string[];
}

export interface DashboardProposalOverview {
  labels: string[];
  data: number[];
  colors: string[];
  center: string;
  centerLabel: string;
}

export interface DashboardTurnaround {
  labels: string[];
  snowui: number[];
  dashboard: number[];
}

export interface DashboardIncome {
  labels: string[];
  data: number[];
  highlightIndex: number;
}

export interface DashboardData {
  kpis: DashboardKpis;
  users: DashboardUsers;
  staffPerformance: DashboardStaffPerformance;
  proposalOverview: DashboardProposalOverview;
  turnaround: DashboardTurnaround;
  income: DashboardIncome;
}


/**
 * Simulates a server-side fetch with a small delay.
 * Replace each sub-fetch with your real API / DB calls.
 * Because this runs in a Server Component, it can use
 * fetch(), ORM calls, or any Node-only library safely.
 */
export async function getDashboardData(): Promise<DashboardData> {
  // In production, replace with e.g.:
  //   const res = await fetch("https://api.example.com/dashboard", { next: { revalidate: 60 } });
  //   return res.json();

  // Simulated async delay (remove in prod)
  await new Promise((r) => setTimeout(r, 300));

  return {
    kpis: {
      clients: 7265,
      clientsTrend: 11.01,
      staff: 3671,
      staffTrend: -0.03,
    },
    users: {
      total: 37235128,
      bars: [
        30, 45, 28, 55, 38, 65, 42, 70, 50, 58,
        40, 62, 35, 80, 55, 90, 60, 75, 48, 68,
        52, 78, 45, 85, 58, 72, 44, 66, 50, 88,
        62, 92, 55, 76, 49, 82, 57, 70, 46, 78,
      ],
      oldPct: 52,
      newPct: 18,
      lowPct: 30,
    },
    staffPerformance: {
      labels: ["United States", "Canada", "Mexico", "Other"],
      data: [53.5, 32.8, 9.2, 4.5],
      colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e"],
    },
    proposalOverview: {
      labels: ["Windows", "MacOS", "Other"],
      data: [17, 60, 23],
      colors: ["#9e9e9e", "#00c853", "#2979ff"],
      center: "17%",
      centerLabel: "Windows",
    },
    turnaround: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      snowui:    [18, 28, 35, 55, 48, 60],
      dashboard: [10, 22, 30, 40, 45, 55],
    },
    income: {
      labels: [
        "Jan", "", "", "", "", "", "",
        "Feb", "", "", "", "", "", "",
        "Mar", "", "", "", "", "", "",
        "Apr", "", "", "", "", "", "",
        "May", "", "", "", "", "", "",
        "Jun",
      ],
      data: [
        40, 55, 35, 60, 45, 70, 50,
        40, 65, 42, 55, 38, 62, 48,
        45, 70, 52, 42, 60, 50, 38,
        243, 55, 42, 65, 48, 58, 45,
        42, 68, 52, 60, 45, 70, 55, 42,
      ],
      highlightIndex: 21,
    },
  };
}