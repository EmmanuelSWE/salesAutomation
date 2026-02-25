"use client";

import { createStyles } from "antd-style";

export const useKpiStyles = createStyles(({ css }) => ({
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  `,

  card: css`
    background: #2e2e2e;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    overflow: hidden;
    min-width: 0;
  `,

  cardGold: css`
    background: linear-gradient(135deg, #f5a623, #f7c948);
    color: #1a1000;
  `,

  icon: css`
    position: absolute;
    top: 14px;
    right: 16px;
    font-size: 18px;
    opacity: 0.55;
  `,

  label: css`
    font-size: 12px;
    opacity: 0.7;
    font-weight: 500;
  `,

  value: css`
    font-size: 32px;
    font-weight: 700;
    line-height: 1.1;
  `,

  trendUp: css`
    font-size: 12px;
    font-weight: 500;
    margin-top: 2px;
    color: #4caf50;
  `,

  trendDown: css`
    font-size: 12px;
    font-weight: 500;
    margin-top: 2px;
    color: #f44336;
  `,
}));