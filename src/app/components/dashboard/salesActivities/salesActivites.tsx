"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { DashboardSalesPerformance, DashboardActivities } from "../../../lib/placeholderdata";
import { useSalesActivitiesStyles } from "./salesActivites.module";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesActivitiesProps {
  sales: DashboardSalesPerformance;
  activities: DashboardActivities;
}

export default function SalesActivities({ activities }: Readonly<SalesActivitiesProps>) {
  const { styles } = useSalesActivitiesStyles();

  const total     = Number(activities.center) || 0;
  const completed = activities.completedToday;
  const pending   = total - completed;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

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

      {/* ── Activity Count ── */}
      <div className={styles.card}>
        <div className={styles.titleOrange}>Staff Performance</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "12px 4px" }}>

          {/* Big total number */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: "#f5a623" }}>
              {total}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Activities Generated</div>
          </div>

          {/* Completed vs Pending bar */}
          <div style={{ padding: "0 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#4caf50" }}>Completed: {completed}</span>
              <span style={{ fontSize: 12, color: "#888" }}>Pending: {pending}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#2a2a2a", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: "linear-gradient(90deg,#4caf50,#81c784)",
                borderRadius: 4,
                transition: "width 0.4s ease",
              }} />
            </div>
            <div style={{ fontSize: 11, color: "#4caf50", marginTop: 4, textAlign: "right" }}>
              {pct}% completion rate
            </div>
          </div>

          {/* Stat pills row */}
          <div className={styles.statsRow}>
            <div className={styles.statPill}>
              <span className={styles.statValue} style={{ color: "#4caf50" }}>{completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue} style={{ color: "#f5a623" }}>{pending}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.statPill}>
              <span className={styles.statValue} style={{ color: "#2979ff" }}>{activities.upcoming}</span>
              <span className={styles.statLabel}>Upcoming</span>
            </div>
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