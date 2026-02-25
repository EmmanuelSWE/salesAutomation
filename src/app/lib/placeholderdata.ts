export interface StatsData {
  clients: {
    value: number;
    trend: number;
    isPositive: boolean;
  };
  staff: {
    value: number;
    trend: number;
    isPositive: boolean;
  };
}

export interface ProjectsData {
  totalUsers: number;
  oldProjects: number;
  newProjects: number;
  lowActivityProjects: number;
}

export interface StaffPerformanceData {
  unitedStates: number;
  canada: number;
  mexico: number;
  other: number;
}

export interface ProposalData {
  windows: number;
  macos: number;
  other: number;
}

export interface TurnAroundRateData {
  labels: string[];
  data: number[];
}

export interface IncomeData {
  value: number;
  unit: string;
}

export interface ChartColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  grid: string;
}


export const statsData: StatsData = {
  clients: {
    value: 7265,
    trend: 11.01,
    isPositive: true
  },
  staff: {
    value: 3671,
    trend: 0.03,
    isPositive: false
  }
};

export const projectsData: ProjectsData = {
  totalUsers: 37235128,
  oldProjects: 52,
  newProjects: 18,
  lowActivityProjects: 30
};

export const staffPerformanceData: StaffPerformanceData = {
  unitedStates: 53.5,
  canada: 32.8,
  mexico: 9.2,
  other: 4.5
};

export const proposalData: ProposalData = {
  windows: 17,
  macos: 17,
  other: 66
};

export const turnAroundRateData: TurnAroundRateData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [40, 65, 45, 80, 55, 70]
};

export const incomeData: IncomeData = {
  value: 24.3,
  unit: 'K'
};

// Color palette
export const chartColors: ChartColors = {
  primary: '#f39c12',
  secondary: '#e67e22',
  background: '#1b1b1b',
  text: '#888',
  grid: '#333'
};