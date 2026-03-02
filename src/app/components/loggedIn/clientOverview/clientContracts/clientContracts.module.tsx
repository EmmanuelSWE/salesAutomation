"use client";

import { createStyles } from "antd-style";

export const useClientContractsStyles = createStyles(({ css }) => ({
  badge: css`
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  `,

  draft: css`
    background: rgba(120,120,120,0.15);
    color: #888;
  `,

  active: css`
    background: rgba(38,166,154,0.15);
    color: #26a69a;
  `,

  expired: css`
    background: rgba(239,83,80,0.12);
    color: #ef5350;
  `,

  renewed: css`
    background: rgba(92,107,192,0.15);
    color: #9aa0dc;
  `,

  cancelled: css`
    background: rgba(120,120,120,0.12);
    color: #666;
  `,

  expiryPill: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 600;
    background: rgba(245,166,35,0.15);
    color: #f5a623;
    border: 1px solid rgba(245,166,35,0.3);
    margin-left: 6px;
    white-space: nowrap;
  `,

  /* ── Skeleton loader ── */
  skeletonWrap: css`display: flex; flex-direction: column; gap: 10px; padding: 12px 0;`,
  skeletonRow: css`
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 8px 0;
    border-top: 1px solid #2e2e2e;
  `,
  skeletonBlock: css`
    background: #2a2a2a;
    border-radius: 6px;
    animation: pulse 1.4s ease-in-out infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,

  /* ── Empty / error state ── */
  emptyWrap: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px;
    gap: 6px;
  `,
  emptyIcon:  css`font-size: 28px; line-height: 1;`,
  emptyTitle: css`margin: 0; font-size: 13px; font-weight: 600; color: #ccc;`,
  emptySub:   css`margin: 0; font-size: 11px; color: #666; text-align: center;`,
}));
