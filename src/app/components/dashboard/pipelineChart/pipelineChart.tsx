"use client";

import { MoreOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, type TooltipItem } from "chart.js";
import type { DashboardPipeline } from "../../../lib/placeholderdata";
import { usePipelineChartStyles } from "./pipelineChart.module";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function fmtK(n: number) { return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`; }

interface PipelineChartProps { data: DashboardPipeline; }

export default function PipelineChart({ data }: Readonly<PipelineChartProps>) {
  const { styles } = usePipelineChartStyles();
  const chartData = {
    labels: data.stages.map((s) => s.label),
    datasets: [{
      label: "Pipeline Value",
      data: data.stages.map((s) => s.value),
      backgroundColor: data.stages.map((s) => s.label === "Closed Won" ? "#7c85ff" : "#3f3f6e"),
      borderRadius: 4,
      barPercentage: 0.6,
    }],
  };
  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: TooltipItem<"bar">) => ` ${fmtK(ctx.raw as number)}` } } },
    scales: { x: { grid: { display: false }, ticks: { color: "#555", font: { size: 11 } } }, y: { display: false } },
  } as const;
  return (
    <section className={styles.card} aria-label="Pipeline by stage">
      <div className={styles.header}>
        <div className={styles.title}>Pipeline by Stage</div>
        <div className={styles.moreBtn}><MoreOutlined /></div>
      </div>
      <div className={styles.chartWrap}><Bar data={chartData} options={options} /></div>
    </section>
  );
}