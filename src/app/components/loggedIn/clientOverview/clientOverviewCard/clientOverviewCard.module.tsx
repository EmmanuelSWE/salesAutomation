"use client";
import { createStyles } from "antd-style";

export const useClientOverviewCardStyles = createStyles(({ css }) => ({
  headerBtns: css`display: flex; gap: 8px;`,

  btnCancel: css`
    background: transparent;
    border: 1px solid #3a3a3a;
    border-radius: 16px;
    padding: 5px 14px;
    font-size: 12px;
    color: #888;
    cursor: pointer;
    &:hover { border-color: #555; color: #ccc; }
  `,

  btnRenew: css`
    background: #5c6bc0;
    border: none;
    border-radius: 16px;
    padding: 5px 14px;
    font-size: 12px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    &:hover { background: #6979d3; }
  `,

  /* ── Progress section ── */
  progressSection: css`
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,

  progressMeta: css`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  `,

  progressTitle: css`
    font-size: 13px;
    font-weight: 600;
    color: #ccc;
    display: block;
  `,

  proposalTitle: css`
    display: block;
    font-size: 11px;
    color: #555;
    margin-top: 2px;
    font-style: italic;
  `,

  progressCount: css`
    font-size: 12px;
    color: #555;
  `,

  countDone:  css`color: #7c86d4; font-weight: 700;`,
  countSep:   css`color: #3a3a3a; margin: 0 2px;`,
  countTotal: css`color: #555;`,

  /* ── Skeleton / empty ── */
  skeletonWrap: css`display: flex; flex-direction: column; gap: 8px;`,

  skeletonChip: css`
    height: 26px;
    border-radius: 20px;
    background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,

  noProposal: css`
    font-size: 12px;
    color: #444;
    font-style: italic;
    padding: 6px 0;
  `,

  /* ── Chip groups ── */
  chipsGroup: css`
    display: flex;
    flex-direction: column;
    gap: 7px;
  `,

  chipsGroupLabel: css`
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #444;
  `,

  chipRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  `,

  /* Purple — completed */
  chipDone: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(92, 107, 192, 0.12);
    border: 1px solid rgba(92, 107, 192, 0.45);
    color: #9aa0dc;
    white-space: nowrap;
  `,

  /* Grey — pending */
  chipPending: css`
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    background: #222;
    border: 1px solid #333;
    color: #555;
    white-space: nowrap;
  `,

  /* ── Active until ── */
  activeLine: css`
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  activeLabel: css`
    font-size: 12px;
    color: #555;
  `,

  activeDate: css`
    font-size: 13px;
    font-weight: 700;
    color: #ccc;
  `,

  activeDateOverdue: css`
    font-size: 13px;
    font-weight: 700;
    color: #e57373;
  `,

  /* ── Alert (overdue only) ── */
  alertBox: css`
    display: flex;
    gap: 12px;
    align-items: flex-start;
    background: rgba(229, 115, 115, 0.07);
    border: 1px solid rgba(229, 115, 115, 0.25);
    border-radius: 10px;
    padding: 13px 15px;
    margin-top: 4px;
  `,

  alertIcon: css`
    color: #e57373;
    font-size: 16px;
    margin-top: 1px;
    flex-shrink: 0;
  `,

  alertTitle: css`
    font-size: 13px;
    font-weight: 700;
    color: #e57373;
    margin-bottom: 2px;
  `,

  alertSub: css`
    font-size: 12px;
    color: #a05555;
  `,
}));