"use client";

import { createStyles } from "antd-style";

export const useClientProposalsStyles = createStyles(({ css }) => ({
  createBtn: css`
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 20px;
    background: rgba(92, 107, 192, 0.15);
    border: 1px solid rgba(92, 107, 192, 0.35);
    color: #9aa0dc;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    &:hover { background: rgba(92,107,192,0.25); color: #b0b8f0; }
  `,

  /* ── Skeleton ── */
  skeletonWrap: css`display: flex; flex-direction: column; gap: 14px; padding: 4px 0;`,

  skeletonRow: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,

  skeletonBlock: css`
    background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,

  /* ── Empty state ── */
  emptyWrap: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px 20px 32px;
  `,

  emptyIcon: css`font-size: 32px; line-height: 1; filter: grayscale(1); opacity: 0.4;`,

  emptyTitle: css`
    font-size: 14px;
    font-weight: 600;
    color: #777;
    margin: 0;
  `,

  emptySub: css`
    font-size: 12px;
    color: #444;
    margin: 0;
    text-align: center;
    max-width: 280px;
    line-height: 1.5;
  `,

  emptyBtn: css`
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    padding: 7px 18px;
    border-radius: 20px;
    background: #5c6bc0;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    &:hover { background: #6979d3; }
  `,

  /* ── Status badges ── */
  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  `,

  draft: css`
    background: rgba(100,100,100,0.12);
    border: 1px solid rgba(100,100,100,0.25);
    color: #888;
  `,

  submitted: css`
    background: rgba(92,107,192,0.12);
    border: 1px solid rgba(92,107,192,0.3);
    color: #9aa0dc;
  `,

  approved: css`
    background: rgba(76,175,80,0.1);
    border: 1px solid rgba(76,175,80,0.25);
    color: #66bb6a;
  `,

  rejected: css`
    background: rgba(229,115,115,0.1);
    border: 1px solid rgba(229,115,115,0.25);
    color: #e57373;
  `,

  /* ── Line item count ── */
  lineCount: css`font-size: 12px; color: #9aa0dc;`,
  lineCountNone: css`font-size: 12px; color: #444; font-style: italic;`,

  /* ── Valid-until date ── */
  dateValid:   css`font-size: 12px; color: #aaa;`,
  dateExpired: css`font-size: 12px; color: #e57373; font-weight: 600;`,
}));
