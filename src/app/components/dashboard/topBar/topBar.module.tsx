"use client";

import { createStyles } from "antd-style";

export const useTopBarStyles = createStyles(({ css }) => ({
  topbar: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #222;
    border-radius: 12px;
    padding: 10px 18px;
    flex-shrink: 0;
  `,

  breadcrumb: css`
    display: flex;
    gap: 6px;
    align-items: center;
    color: #666;
    font-size: 13px;
  `,

  breadcrumbSep: css`
    color: #555;
  `,

  breadcrumbActive: css`
    color: #fff;
    font-weight: 600;
  `,

  right: css`
    display: flex;
    gap: 10px;
    align-items: center;
  `,

  searchBox: css`
    display: flex;
    align-items: center;
    gap: 7px;
    background: #333;
    border-radius: 8px;
    padding: 6px 12px;
    color: #666;
    font-size: 13px;
    min-width: 160px;
    cursor: text;
    &:hover { background: #3a3a3a; }
  `,

  iconBtn: css`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    cursor: pointer;
    font-size: 15px;
    flex-shrink: 0;
    &:hover { color: #fff; background: #3a3a3a; }
  `,
}));