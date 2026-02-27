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
  type TooltipItem,
} from "chart.js";
import type { DashboardRevenue } from "../../../lib/placeholderdata";
import { useRevenueTrendStyles } from "./revenueChart.module";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function fmtK(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
}

interface RevenueTrendChartProps {
  data: DashboardRevenue;
}

export default function RevenueTrendChart({ data }: Readonly<RevenueTrendChartProps>) {
  const { styles } = useRevenueTrendStyles();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Actual",
        data: data.thisMonthLine,
        borderColor: "#ef5350",
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Target",
        data: data.targetLine,
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
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"line">) =>
            ` ${ctx.dataset.label ?? ""}: ${fmtK(ctx.raw as number)}`,
        },
      },
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
    <section className={styles.card} aria-label="Revenue trend">
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.title}>Revenue Trend</div>
        </div>
        <div className={styles.legendGroup}>
          <span className={styles.legendItem}>
            <span className={styles.legendLine} style={{ background: "#ef5350" }} />{" "}
            Actual
          </span>
          <span className={styles.legendItem}>
            <span className={styles.legendLine} style={{ background: "#888" }} />{" "}
            Target
          </span>
          <div className={styles.moreBtn}><MoreOutlined /></div>
        </div>
      </div>

      {/* Revenue stat pills */}
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>This Month</span>
          <span className={styles.statValue}>{fmtK(data.thisMonth)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>This Quarter</span>
          <span className={styles.statValue}>{fmtK(data.thisQuarter)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>This Year</span>
          <span className={styles.statValue}>{fmtK(data.thisYear)}</span>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <Line data={chartData} options={options} />
      </div>
    </section>
  );
}