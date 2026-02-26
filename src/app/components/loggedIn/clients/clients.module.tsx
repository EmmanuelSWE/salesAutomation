"use client";

import { createStyles } from "antd-style";

export const useClientsStyles = createStyles(({ css }) => ({
  page: css`
    width:100%;min-height:100vh;background:#1e1e1e;display:flex;
    justify-content:center;align-items:flex-start;padding:40px 20px;box-sizing:border-box;
  `,

  tableContainer: css`
    width:100%;max-width:960px;color:#fff;
  `,

  statusTag: css`
    padding:2px 8px;border-radius:8px;font-size:11px;font-weight:600;
    &.In\ Progress{background:#f5a623;color:#1a1000;}
    &.Pending{background:#2196f3;color:#fff;}
    &.Approved{background:#4caf50;color:#fff;}
    &.Rejected{background:#f44336;color:#fff;}
  `,
}));
