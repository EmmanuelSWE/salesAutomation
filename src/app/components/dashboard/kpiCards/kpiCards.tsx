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

function fmt(n = 0) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function KpiCards({ data }: Readonly<KpiCardsProps>) {
  const { styles, cx } = useKpiStyles();

  const cards = [
    {
      label:   "Total Opportunities",
      value:   `${data.totalOpportunities}`,
      sub:     `${data.wonCount} won`,
      icon:    <FundOutlined />,
      gold:    false,
      trend:   null,
      accent:  "#5c6bc0",
    },
    {
      label:   "Win Rate",
      value:   `${(data.winRate ?? 0).toFixed(1)}%`,
      sub:     "of all opportunities",
      icon:    <TrophyOutlined />,
      gold:    true,
      trend:   null,
      accent:  "#1a0e00",
    },
    {
      label:   "Pipeline Value",
      value:   fmt(data.pipelineValue),
      sub:     "open pipeline",
      icon:    <DollarOutlined />,
      gold:    false,
      trend:   null,
      accent:  "#26a69a",
    },
    {
      label:   "Active Contracts",
      value:   `${data.activeContracts}`,
      sub:     `${data.expiringThisMonth} expiring this month`,
      icon:    <FileProtectOutlined />,
      gold:    false,
      trend:   data.expiringThisMonth > 0 ? "warn" : null,
      accent:  "#f39c12",
    },
  ];

  return (
    <section className={styles.grid} aria-label="KPI cards">
      {cards.map((c) => (
        <div key={c.label} className={cx(styles.card, c.gold && styles.cardGold)}>
          <div
            className={styles.iconBubble}
            style={{
              background: c.gold ? "rgba(0,0,0,0.15)" : `${c.accent}22`,
              color: c.gold ? c.accent : c.accent,
            }}
          >
            {c.icon}
          </div>
          <div className={cx(styles.label, c.gold && styles.labelGold)}>{c.label}</div>
          <div className={cx(styles.value, c.gold && styles.valueGold)}>{c.value}</div>
          <div className={c.trend === "warn" ? styles.trendDown : cx(styles.sub, c.gold && styles.subGold)}>
            {c.sub}
          </div>
        </div>
      ))}
    </section>
  );
}