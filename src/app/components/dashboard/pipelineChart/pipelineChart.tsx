"use client";

import { MoreOutlined } from "@ant-design/icons";
import type { DashboardFunnel } from "../../../lib/placeholderdata";
import { usePipelineChartStyles } from "./pipelineChart.module";

const VW    = 600;
const VH    = 200;
const CY    = VH / 2;
const MAX_H = 82;
const MIN_H = 18;

function fmtK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface Props { data: DashboardFunnel; }

export default function PipelineChart({ data }: Readonly<Props>) {
  const { styles } = usePipelineChartStyles();

  const { roles } = data;
  const segW       = VW / roles.length;
  const maxRevenue = Math.max(...roles.map((r) => r.revenue));
  const halfH      = roles.map((r) => Math.max(MIN_H, Math.round((r.revenue / maxRevenue) * MAX_H)));
  const topIdx     = roles.reduce((best, r, i) => (r.revenue > roles[best].revenue ? i : best), 0);

  const OPACITIES = [0.42, 0.63, 0.82];
  const segOpacity = (i: number) => OPACITIES[i] ?? 0.5;

  return (
    <section className={styles.card} aria-label="Sales funnel by role">
      <div className={styles.header}>
        <span className={styles.title}>Sales Funnel by Role</span>
        <div className={styles.moreBtn}><MoreOutlined /></div>
      </div>

      <div className={styles.svgWrap}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          style={{ display: "block", overflow: "visible" }}
        >
          <defs>
            <filter id="funnel-glow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="blur" />
              <feFlood floodColor="#f39c12" floodOpacity="0.85" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {roles.map((role, i) => {
            const x0    = i * segW;
            const x1    = (i + 1) * segW;
            const hL    = halfH[i];
            const hR    = i < roles.length - 1 ? halfH[i + 1] : halfH[i];
            const pts   = `${x0},${CY - hL} ${x1},${CY - hR} ${x1},${CY + hR} ${x0},${CY + hL}`;
            const isTop = i === topIdx;
            const cx    = x0 + segW / 2;
            const op    = segOpacity(i);

            const words  = role.role.split(" ");
            const midIdx = Math.ceil(words.length / 2);
            const line1  = words.slice(0, midIdx).join(" ");
            const line2  = words.slice(midIdx).join(" ");
            const hasTwo = line2.length > 0;

            return (
              <g key={role.role} filter={isTop ? "url(#funnel-glow)" : undefined}>
                <polygon
                  points={pts}
                  fill={`rgba(243,156,18,${op})`}
                  stroke={isTop ? "rgba(243,156,18,0.9)" : "rgba(243,156,18,0.25)"}
                  strokeWidth={isTop ? 1.5 : 0.5}
                />

                {/* role label */}
                <text
                  x={cx}
                  y={hasTwo ? CY - 12 : CY - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isTop ? "700" : "500"}
                  fill={isTop ? "#fff" : "rgba(255,255,255,0.85)"}
                >
                  {line1}
                  {hasTwo && <tspan x={cx} dy="14">{line2}</tspan>}
                </text>

                {/* revenue */}
                <text
                  x={cx}
                  y={hasTwo ? CY + 18 : CY + 12}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill={isTop ? "#f39c12" : "rgba(243,156,18,0.8)"}
                >
                  {fmtK(role.revenue)}
                </text>

                {/* deals */}
                <text
                  x={cx}
                  y={hasTwo ? CY + 32 : CY + 26}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="rgba(255,255,255,0.50)"
                >
                  {role.deals} deals
                </text>
              </g>
            );
          })}

          {/* dividers between segments */}
          {roles.slice(0, -1).map((role, i) => {
            const x  = (i + 1) * segW;
            const hh = halfH[i + 1];
            return (
              <line
                key={`div-after-${role.role}`}
                x1={x} y1={CY - hh}
                x2={x} y2={CY + hh}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      {/* legend */}
      <div className={styles.legendRow}>
        {roles.map((r, i) => (
          <div key={r.role} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ background: `rgba(243,156,18,${segOpacity(i)})` }}
            />
            <span className={styles.legendLabel}>{r.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
