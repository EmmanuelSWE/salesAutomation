"use client";

import { createStyles } from "antd-style";

/**
 * Shared layout-level styles only.
 * Component-specific styles live in their own *.module.ts files.
 */
export const useDashboardStyles = createStyles(({ css }) => ({
  /* Outer page backdrop */
  page: css`
    width: 100%;
    min-height: 100vh;
    background:
      radial-gradient(ellipse 55% 60% at 100% 50%, rgba(243, 156, 18, 0.45) 0%, transparent 70%),
      radial-gradient(ellipse 55% 60% at 0% 50%, rgba(230, 126, 34, 0.40) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 50% 100%, rgba(243, 100, 10, 0.20) 0%, transparent 60%),
      #050505;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 24px;
    box-sizing: border-box;
  `,

  /* Centered rounded container — antd Layout compatible */
  wrapper: css`
    &.ant-layout {
      background: #222;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #333;
    }
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 1440px;
    min-height: calc(100vh - 48px);
    background: #222;
    border: 1px solid #333;
    border-radius: 20px;
    overflow: hidden;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  `,

  /* Antd Sider override */
  sider: css`
    &.ant-layout-sider {
      background: #252525 !important;
      min-height: 100%;
    }
  `,

  /* Right-hand column (Header + Content + Footer) */
  rightLayout: css`
    &.ant-layout {
      background: transparent;
      display: flex;
      flex-direction: column;
      min-height: 100%;
    }
  `,

  /* Antd Header override */
  header: css`
    &.ant-layout-header {
      background: transparent;
      padding: 0;
      height: auto;
      line-height: normal;
    }
  `,

  /* Scrollable right-hand content column */
  content: css`
    flex: 1;
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 36px;
    overflow-y: auto;
    min-width: 0;
  `,

  /* Footer bar — works as both a plain div and antd Footer */
  footer: css`
    &.ant-layout-footer {
      background: #222;
      padding: 12px 20px;
    }
    background: #222;
    border-radius: 12px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;
  `,

  footerAvatar: css`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #555;
    margin-right: auto;
  `,

  footerLink: css`
    font-size: 13px;
    color: #777;
    cursor: pointer;
    &:hover { color: #fff; }
  `,
}));