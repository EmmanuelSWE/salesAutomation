"use client";

import { createStyles } from "antd-style";

export const useRevenueTrendStyles = createStyles(({ css }) => ({
  card: css`
    background: #2e2e2e;
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
  `,

  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  left: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  title: css`
    font-size: 13px;
    font-weight: 600;
    color: #ef5350;
  `,

  subtitle: css`
    font-size: 11px;
    color: #666;
  `,

  legendGroup: css`
    display: flex;
    gap: 14px;
    align-items: center;
    font-size: 12px;
    color: #aaa;
  `,

  legendItem: css`
    display: flex;
    align-items: center;
    gap: 6px;
  `,

  legendLine: css`
    width: 20px;
    height: 2px;
    border-radius: 1px;
  `,

  moreBtn: css`
    width: 26px;
    height: 26px;
    border-radius: 7px;
    background: #3a3a3a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    cursor: pointer;
    font-size: 13px;
    &:hover { background: #444; color: #fff; }
  `,

  statRow: css`
    display: flex;
    gap: 24px;
  `,

  stat: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  statLabel: css`
    font-size: 11px;
    color: #666;
  `,

  statValue: css`
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  `,

  chartWrap: css`
    height: 220px;
  `,
}));