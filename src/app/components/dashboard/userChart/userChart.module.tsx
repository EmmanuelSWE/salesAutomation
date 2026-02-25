"use client";

import { createStyles } from "antd-style";

export const useUsersChartStyles = createStyles(({ css }) => ({
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

  tabs: css`
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 13px;
    color: #666;
  `,

  tabActive: css`
    color: #fff;
    font-weight: 600;
  `,

  controls: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  dropdown: css`
    background: #3a3a3a;
    border-radius: 8px;
    padding: 5px 10px;
    color: #ccc;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    &:hover { background: #444; }
  `,

  moreBtn: css`
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #3a3a3a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    cursor: pointer;
    font-size: 14px;
    &:hover { background: #444; color: #fff; }
  `,

  totalRow: css`
    display: flex;
    align-items: baseline;
    gap: 12px;
  `,

  totalLabel: css`
    font-size: 13px;
    color: #666;
  `,

  totalValue: css`
    font-size: 36px;
    font-weight: 700;
    color: #fff;
  `,

  chips: css`
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
  `,

  chip: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  chipLabel: css`
    font-size: 11px;
    color: #666;
  `,

  chipValue: css`
    font-size: 17px;
    font-weight: 700;
    color: #fff;
  `,

  chipValueBlue: css`
    font-size: 17px;
    font-weight: 700;
    color: #4d9fff;
  `,

  chartWrap: css`
    height: 150px;
  `,
}));