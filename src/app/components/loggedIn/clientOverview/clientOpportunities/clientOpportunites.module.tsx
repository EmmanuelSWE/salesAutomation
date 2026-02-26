"use client";
import { createStyles } from "antd-style";

export const useClientOpportunitiesStyles = createStyles(({ css }) => ({
  badge: css`
    display: inline-block;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  `,

  prospecting:  css`background: rgba(92,107,192,0.15);  color: #7c85ff;`,
  qualification:css`background: rgba(33,150,243,0.15);  color: #29b6f6;`,
  proposal:     css`background: rgba(245,166,35,0.15);  color: #f5a623;`,
  negotiation:  css`background: rgba(33,150,243,0.15);  color: #29b6f6;`,
  closedWon:    css`background: rgba(76,175,80,0.15);   color: #4caf50;`,
  closedLost:   css`background: rgba(244,67,54,0.08);   color: #888;`,
}));