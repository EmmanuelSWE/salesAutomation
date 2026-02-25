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
import type { DashboardIncome } from "@/app/lib/placeholderdata";
import { useIncomeStyles } from "./incomeChart.module";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface IncomeChartProps {
  data: DashboardIncome;
}

export default function IncomeChart({ data }: IncomeChartProps) {
  const { styles } = useIncomeStyles();

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Income",
        data: data.data,
        backgroundColor: data.data.map((_, i) =>
          i === data.highlightIndex ? "#7c85ff" : "#3f3f6e"
        ),
        borderRadius: 2,
        barPercentage: 0.55,
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
          label: (ctx: { raw: unknown }) => ` ${ctx.raw}K`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#555",
          font: { size: 11 },
          maxTicksLimit: 8,
        },
      },
      y: { display: false },
    },
  } as const;

  return (
    <section className={styles.card} aria-label="Income">
      <div className={styles.header}>
        <div className={styles.title}>Income</div>
        <div className={styles.moreBtn}><MoreOutlined /></div>
      </div>

      <div className={styles.chartWrap}>
        <Bar data={chartData} options={options} />
      </div>
    </section>
  );}