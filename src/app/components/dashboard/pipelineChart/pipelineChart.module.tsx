"use client";

import { createStyles } from "antd-style";

export const usePipelineChartStyles = createStyles(({ css }) => ({
  card: css`
    background: #1c1c1c;
    border: 1px solid #272727;
    border-radius: 16px;
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  `,

  header: css`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  `,

  title: css`
    font-size: 16px;
    font-weight: 700;
    color: #f0f0f0;
    margin: 0;
  `,

  subtitle: css`
    font-size: 11px;
    color: #555;
    margin: 3px 0 0 0;
    letter-spacing: 0.2px;
  `,

  badge: css`
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #c8922a;
    background: rgba(200,146,42,0.1);
    border: 1px solid rgba(200,146,42,0.2);
    border-radius: 6px;
    padding: 3px 8px;
  `,

  rows: css`
    display: flex;
    flex-direction: column;
    gap: 13px;
  `,

  row: css`
    display: grid;
    grid-template-columns: minmax(80px, 130px) 1fr 72px;
    align-items: center;
    gap: 12px;
  `,

  roleLabel: css`
    font-size: 12px;
    color: #777;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  barTrack: css`
    height: 5px;
    background: #252525;
    border-radius: 99px;
    overflow: hidden;
  `,

  barFill: css`
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #c8922a 0%, #f5b942 100%);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  `,

  meta: css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;
  `,

  value: css`
    font-size: 12px;
    font-weight: 700;
    color: #e8e8e8;
    line-height: 1;
  `,

  deals: css`
    font-size: 10px;
    color: #444;
    line-height: 1;
  `,

  footer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #262626;
  `,

  footerLabel: css`
    font-size: 11px;
    color: #555;
  `,

  footerValue: css`
    font-size: 13px;
    font-weight: 700;
    color: #c8922a;
  `,
}));