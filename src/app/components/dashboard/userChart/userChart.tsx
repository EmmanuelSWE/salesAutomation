"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { DashboardUsers } from "../../../lib/placeholderdata";
import { useUsersChartStyles } from "./userChart.module";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface UsersChartProps {
  data: DashboardUsers;
}

export default function UsersChart({ data }: UsersChartProps) {
  const { styles } = useUsersChartStyles();

  const chartData = {
    labels: data.bars.map((_, i) => `${i}`),
    datasets: [
      {
        label: "Users",
        data: data.bars,
        // Blue band for the "new projects" segment (indices 20–27)
        backgroundColor: data.bars.map((_, i) =>
          i >= 20 && i <= 27 ? "#4d9fff" : "#3a3a3a"
        ),
        borderRadius: 2,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  } as const;

  return (
    <section className={styles.card} aria-label="Number of users">
      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.tabs}>
          <span>Projects</span>
          <span className={styles.tabActive}>Project overview</span>
        </div>
        <div className={styles.controls}>
          <div className={styles.dropdown}>Week ▾</div>
          <div className={styles.dropdown}>% ▾</div>
          <div className={styles.moreBtn}><MoreOutlined /></div>
        </div>
      </div>

      {/* Total */}
      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Number of users</span>
        <span className={styles.totalValue}>{data.total.toLocaleString()}</span>
      </div>

      {/* Chips */}
      <div className={styles.chips}>
        <div className={styles.chip}>
          <span className={styles.chipLabel}>Old projects</span>
          <span className={styles.chipValue}>{data.oldPct}%</span>
        </div>
        <div className={styles.chip}>
          <span className={styles.chipLabel}>New projects</span>
          <span className={styles.chipValueBlue}>{data.newPct}%</span>
        </div>
        <div className={styles.chip}>
          <span className={styles.chipLabel}>Low activity projects</span>
          <span className={styles.chipValue}>{data.lowPct}%</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className={styles.chartWrap}>
        <Bar data={chartData} options={options} />
      </div>
    </section>
  );
}