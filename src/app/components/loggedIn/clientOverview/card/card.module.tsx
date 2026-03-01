"use client";
import { createStyles } from "antd-style";

export const useCardStyles = createStyles(({ css }) => ({
  card: css`
    background: #2a2a2a;
    border-radius: 14px;
    box-shadow: 0 6px 24px rgba(243, 156, 18, 0.12), 0 2px 8px rgba(255, 200, 100, 0.07);
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: #fff;
    font-family: 'Inter', sans-serif;
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  cardTitle: css`
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  `,

  divider: css`border: none; border-top: 1px solid #333; margin: 0;`,

  infoBlock: css`display: flex; flex-direction: column; gap: 4px;`,
  infoTitle: css`font-size: 14px; font-weight: 600; color: #fff;`,
  infoSub:   css`font-size: 12px; color: #666;`,
  infoLink:  css`font-size: 12px; color: #666; text-decoration: underline; cursor: pointer; &:hover { color: #ccc; }`,

  /* Period tab toggle — shared by history + opportunities */
  periodTabs: css`display: flex; gap: 14px; font-size: 13px;`,
  periodTab: css`
    color: #666; cursor: pointer;
    padding-bottom: 2px; border-bottom: 2px solid transparent;
    &:hover { color: #fff; }
  `,
  periodTabActive: css`color: #5c6bc0; border-bottom: 2px solid #5c6bc0;`,

  /* Plain table shared styles */
  table: css`width: 100%; border-collapse: collapse; font-size: 13px;`,
  th: css`
    text-align: left; color: #555; font-weight: 500;
    font-size: 12px; padding: 0 0 10px 0;
    border-bottom: 1px solid #333;
  `,
  td: css`padding: 11px 0; color: #aaa; border-top: 1px solid #2e2e2e; vertical-align: middle;`,
  tdWhite: css`color: #fff;`,
}));