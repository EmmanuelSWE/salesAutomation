"use client";

import {
  FundOutlined,
  TrophyOutlined,
  DollarOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import type { DashboardKpis } from "../../../lib/placeholderdata";
import { useKpiStyles } from "./kpiCards.module";

interface KpiCardsProps {
  data: DashboardKpis;
}

function fmt(n: number) {
  const v = n ?? 0;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export default function KpiCards({ data }: KpiCardsProps) {
  const { styles, cx } = useKpiStyles();

  const cards = [
    {
      label:   "Total Opportunities",
      value:   `${data.totalOpportunities}`,
      sub:     `${data.wonCount} won`,
      icon:    <FundOutlined />,
      gold:    false,
      trend:   null,
    },
    {
      label:   "Win Rate",
      value:   `${(data.winRate ?? 0).toFixed(1)}%`,
      sub:     "of all opportunities",
      icon:    <TrophyOutlined />,
      gold:    true,
      trend:   null,
    },
    {
      label:   "Pipeline Value",
      value:   fmt(data.pipelineValue),
      sub:     "open pipeline",
      icon:    <DollarOutlined />,
      gold:    false,
      trend:   null,
    },
    {
      label:   "Active Contracts",
      value:   `${data.activeContracts}`,
      sub:     `${data.expiringThisMonth} expiring this month`,
      icon:    <FileProtectOutlined />,
      gold:    false,
      trend:   data.expiringThisMonth > 0 ? "warn" : null,
    },
  ];

  return (
    <section className={styles.grid} aria-label="KPI cards">
      {cards.map((c) => (
        <div key={c.label} className={cx(styles.card, c.gold && styles.cardGold)}>
          <span className={styles.icon}>{c.icon}</span>
          <div className={styles.label}>{c.label}</div>
          <div className={styles.value}>{c.value}</div>
          <div className={c.trend === "warn" ? styles.trendDown : styles.sub}>
            {c.sub}
          </div>
        </div>
      ))}
    </section>
  );
}