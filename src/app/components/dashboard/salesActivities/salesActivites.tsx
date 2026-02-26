"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { DashboardSalesPerformance, DashboardActivities } from "../../../lib/placeholderdata";
import { useSalesActivitiesStyles } from "./salesActivites.module";

ChartJS.register(ArcElement, Tooltip, Legend);

function fmtK(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;
}

interface SalesActivitiesProps {
  sales: DashboardSalesPerformance;
  activities: DashboardActivities;
}

export default function SalesActivities({ sales, activities }: SalesActivitiesProps) {
  const { styles } = useSalesActivitiesStyles();

  const salesChartData = {
    labels: sales.reps.map((r) => r.name),
    datasets: [{
      data: sales.reps.map((r) => r.revenue),
      backgroundColor: sales.colors,
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const activitiesChartData = {
    labels: activities.labels,
    datasets: [{
      data: activities.data,
      backgroundColor: activities.colors,
      borderWidth: 0,
    }],
  };

  return (
    <section className={styles.grid} aria-label="Sales performance and activities">

      {/* ── Sales Performance ── */}
      <div className={styles.card}>
        <div className={styles.titleOrange}>Sales Performance</div>
        <div className={styles.salesBody}>
          <div className={styles.chartWrap}>
            <Doughnut
              data={salesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "62%",
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
              }}
            />
          </div>
          <div className={styles.legend}>
            {sales.reps.map((rep, i) => (
              <div key={rep.name} className={styles.legendRow}>
                <span className={styles.legendDot} style={{ background: sales.colors[i] }} />
                <span className={styles.legendName}>{rep.name}</span>
                <span className={styles.legendVal}>{fmtK(rep.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activities Summary ── */}
      <div className={styles.card}>
        <div className={styles.titleBlue}>Activities Summary</div>
        <div className={styles.activitiesBody}>
          <div className={styles.gaugeWrap}>
            <Doughnut
              data={activitiesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                circumference: 180,
                rotation: -90,
                cutout: "68%",
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: { color: "#aaa", font: { size: 11 }, boxWidth: 10, padding: 14 },
                  },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>
          <div className={styles.gaugeCenter}>
            <div className={styles.gaugeCenterValue}>{activities.center}</div>
            <div className={styles.gaugeCenterLabel}>{activities.centerLabel}</div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statPill}>
              <span className={styles.statValue} style={{ color: "#2979ff" }}>
                {activities.upcoming}
              </span>
              <span className={styles.statLabel}>Upcoming</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue} style={{ color: "#ef5350" }}>
                {activities.overdue}
              </span>
              <span className={styles.statLabel}>Overdue</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue} style={{ color: "#4caf50" }}>
                {activities.completedToday}
              </span>
              <span className={styles.statLabel}>Done Today</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}