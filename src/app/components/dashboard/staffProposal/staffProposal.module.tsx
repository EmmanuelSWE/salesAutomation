"use client";

import { createStyles } from "antd-style";

export const useStaffProposalStyles = createStyles(({ css }) => ({
  grid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  `,

  card: css`
    background: #2e2e2e;
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  `,

  /* ── Staff ── */
  titleOrange: css`
    font-size: 13px;
    font-weight: 600;
    color: #f5a623;
  `,

  staffBody: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,

  staffChartWrap: css`
    flex: 0 0 130px;
    height: 130px;
  `,

  staffLegend: css`
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
  `,

  /* ── Proposal ── */
  titleBlue: css`
    font-size: 13px;
    font-weight: 600;
    color: #4d9fff;
  `,

  proposalBody: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    position: relative;
  `,

  proposalChartWrap: css`
    width: 100%;
    height: 130px;
  `,

  proposalCenter: css`
    margin-top: -56px;
    text-align: center;
    pointer-events: none;
    z-index: 1;
  `,

  proposalCenterValue: css`
    font-size: 22px;
    font-weight: 700;
    color: #fff;
  `,

  proposalCenterLabel: css`
    font-size: 11px;
    color: #777;
  `,
}));