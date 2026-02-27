"use client";

import { createStyles } from "antd-style";

export const usePipelineChartStyles = createStyles(({ css }) => ({
  card: css`
    background: #2e2e2e;
    border: 1px solid #383838;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(243, 156, 18, 0.12), 0 2px 8px rgba(255, 200, 100, 0.07);
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
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
    color: #c8922a;
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

  svgWrap: css`
    width: 100%;
    height: 200px;
    overflow: visible;
  `,

  legendRow: css`
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    padding-top: 4px;
  `,

  legendItem: css`
    display: flex;
    align-items: center;
    gap: 7px;
  `,

  legendDot: css`
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  `,

  legendLabel: css`
    font-size: 11px;
    color: #b07d2e;
  `,
}));