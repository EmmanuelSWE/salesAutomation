"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import type { DashboardTurnaround } from "@/app/lib/placeholderdata";
import { useTurnaroundStyles} from './turnaroundchart.module'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

interface TurnaroundChartProps {
  data: DashboardTurnaround;
}

export default function TurnaroundChart({ data }: TurnaroundChartProps) {
  const { styles } = useTurnaroundStyles();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "SnowUI",
        data: data.snowui,
        borderColor: "#ef5350",
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Dashboard",
        data: data.dashboard,
        borderColor: "#888",
        borderDash: [4, 4],
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { color: "#333" },
        ticks: { color: "#555", font: { size: 11 } },
      },
      y: { display: false },
    },
  } as const;

  return (
    <section className={styles.card} aria-label="Turn around rate">
      <div className={styles.header}>
        <div className={styles.title}>Turn around rate</div>
        <div className={styles.legendGroup}>
          <span className={styles.legendItem}>
            <span className={styles.legendLine} style={{ background: "#ef5350" }} />
            SnowUI
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendLine} style={{ background: "#888" }} />
            Dashboard
          </span>
          <div className={styles.moreBtn}><MoreOutlined /></div>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
}