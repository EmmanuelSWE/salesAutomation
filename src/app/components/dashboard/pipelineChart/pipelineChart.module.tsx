"use client";

import { createStyles } from "antd-style";

export const usePipelineChartStyles = createStyles(({ css }) => ({
  card: css`
    background: #2e2e2e;
    border: 1px solid #383838;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(243, 156, 18, 0.12), 0 2px 8px rgba(255, 200, 100, 0.07);
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

  title: css`
    font-size: 13px;
    font-weight: 600;
    color: #7c85ff;
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

  chartWrap: css`
    height: 220px;
  `,
}));