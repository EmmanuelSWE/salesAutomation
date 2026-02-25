"use client";

import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import type { DashboardKpis } from "../../../lib/placeholderdata";
import { useKpiStyles } from "./kpiCards.module";

interface KpiCardsProps {
  data: DashboardKpis;
}

export default function KpiCards({ data }: KpiCardsProps) {
  const { styles, cx } = useKpiStyles();

  const clientsUp = data.clientsTrend >= 0;
  const staffUp   = data.staffTrend >= 0;

  return (
    <section className={styles.grid} aria-label="KPI cards">
      {/* Clients */}
      <div className={styles.card}>
        <span className={styles.icon}><RiseOutlined /></span>
        <div className={styles.label}>Clients</div>
        <div className={styles.value}>{data.clients.toLocaleString()}</div>
        <div className={clientsUp ? styles.trendUp : styles.trendDown}>
          {clientsUp ? "+" : ""}{data.clientsTrend.toFixed(2)}%
        </div>
      </div>

      {/* Staff */}
      <div className={cx(styles.card, styles.cardGold)}>
        <span className={styles.icon}><FallOutlined /></span>
        <div className={styles.label}>Staff</div>
        <div className={styles.value}>{data.staff.toLocaleString()}</div>
        <div className={staffUp ? styles.trendUp : styles.trendDown}>
          {staffUp ? "+" : ""}{data.staffTrend.toFixed(2)}%
        </div>
      </div>
    </section>
  );
}