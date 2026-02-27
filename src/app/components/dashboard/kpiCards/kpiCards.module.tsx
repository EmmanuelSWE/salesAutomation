"use client";

import { createStyles } from "antd-style";

export const useKpiStyles = createStyles(({ css }) => ({
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 24px;
  `,

  card: css`
    background: #2e2e2e;
    border: 1px solid #383838;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(243, 156, 18, 0.12), 0 2px 8px rgba(255, 200, 100, 0.07);
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 8px;
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
    font-size: 11px;
    color: #c8922a;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `,

  value: css`
    font-size: 30px;
    font-weight: 700;
    line-height: 1.1;
    color: #fff;
  `,

  sub: css`
    font-size: 11px;
    color: #b07d2e;
    margin-top: 2px;
  `,

  trendUp: css`
    font-size: 12px;
    font-weight: 500;
    color: #4caf50;
  `,

  trendDown: css`
    font-size: 12px;
    font-weight: 500;
    color: #f44336;
  `,

  trendNeutral: css`
    font-size: 12px;
    font-weight: 500;
    color: #aaa;
  `,
}));