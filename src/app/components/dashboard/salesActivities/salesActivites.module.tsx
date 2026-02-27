"use client";

import { createStyles } from "antd-style";

export const useSalesActivitiesStyles = createStyles(({ css }) => ({
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  `,

  card: css`
    background: #2e2e2e;
    border: 1px solid #383838;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(243, 156, 18, 0.12), 0 2px 8px rgba(255, 200, 100, 0.07);
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  `,

  titleOrange: css`
    font-size: 13px;
    font-weight: 600;
    color: #f5a623;
  `,

  titleBlue: css`
    font-size: 13px;
    font-weight: 600;
    color: #4d9fff;
  `,

  /* Sales — doughnut + legend */
  salesBody: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,

  chartWrap: css`
    flex: 0 0 130px;
    height: 130px;
  `,

  legend: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  `,

  legendRow: css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  `,

  legendDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  `,

  legendName: css`
    flex: 1;
    color: #bbb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  legendVal: css`
    color: #fff;
    font-weight: 500;
    flex-shrink: 0;
    font-size: 11px;
  `,

  /* Activities — gauge + stat pills */
  activitiesBody: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
  `,

  gaugeWrap: css`
    width: 100%;
    height: 130px;
  `,

  gaugeCenter: css`
    margin-top: -52px;
    text-align: center;
    pointer-events: none;
  `,

  gaugeCenterValue: css`
    font-size: 22px;
    font-weight: 700;
    color: #fff;
  `,

  gaugeCenterLabel: css`
    font-size: 11px;
    color: #777;
  `,

  statsRow: css`
    display: flex;
    gap: 12px;
    margin-top: 14px;
    width: 100%;
    justify-content: center;
  `,

  statPill: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background: #252525;
    border-radius: 10px;
    padding: 8px 14px;
    min-width: 64px;
  `,

  statValue: css`
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  `,

  statLabel: css`
    font-size: 10px;
    color: #777;
    text-align: center;
  `,
}));