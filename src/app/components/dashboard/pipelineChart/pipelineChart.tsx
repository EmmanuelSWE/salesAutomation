"use client";

import type { DashboardFunnel } from "../../../lib/placeholderdata";
import { usePipelineChartStyles } from "./pipelineChart.module";

function fmtK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface Props { data: DashboardFunnel; }

export default function PipelineChart({ data }: Readonly<Props>) {
  const { styles } = usePipelineChartStyles();

  const sorted     = [...data.roles].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = sorted[0]?.revenue ?? 1;
  const totalDeals = sorted.reduce((s, r) => s + r.deals, 0);

  return (
    <section className={styles.card} aria-label="Sales pipeline by role">
      <div className={styles.header}>
        <div>
          <p className={styles.title}>Pipeline</p>
          <p className={styles.subtitle}>{totalDeals} deals in progress</p>
        </div>
        <span className={styles.badge}>by Role</span>
      </div>

      <div className={styles.rows}>
        {sorted.map((role, i) => {
          const pct      = Math.round((role.revenue / maxRevenue) * 100);
          const rankAlpha = 0.4 + 0.6 * (1 - i / Math.max(sorted.length - 1, 1));
          return (
            <div key={role.role} className={styles.row}>
              <span className={styles.roleLabel}>{role.role}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%`, opacity: rankAlpha }}
                />
              </div>
              <div className={styles.meta}>
                <span className={styles.value}>{fmtK(role.revenue)}</span>
                <span className={styles.deals}>{role.deals} deals</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerLabel}>Total pipeline</span>
        <span className={styles.footerValue}>
          {fmtK(sorted.reduce((s, r) => s + r.revenue, 0))}
        </span>
      </div>
    </section>
  );
}
