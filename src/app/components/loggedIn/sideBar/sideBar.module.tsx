"use client";

import { createStyles } from "antd-style";

export const useSidebarStyles = createStyles(({ css }) => ({
  sidebar: css`
    width: 220px;
    height: 100%;
    min-height: 100vh;
    flex-shrink: 0;
    background: #252525;
    display: flex;
    flex-direction: column;
    padding: 28px 16px 24px;
    box-sizing: border-box;
  `,

  sidebarTop: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  `,

  logo: css`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    margin-bottom: 28px;
    padding-left: 6px;
    text-decoration: none;
  `,

  logoIcon: css`
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
    box-shadow: 0 3px 12px rgba(243, 156, 18, 0.45);
  `,

  navItem: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 14px;
    border-radius: 10px;
    font-size: 14px;
    color: #999;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    text-decoration: none;
    &:hover {
      background: #323232;
      color: #fff;
    }
  `,

  navItemActive: css`
    background: #3a3a3a;
    color: #fff;
  `,

  navIcon: css`
    font-size: 16px;
    width: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,

  footer: css`
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    font-size: 14px;
    color: #ccc;
  `,

  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 15px;
    flex-shrink: 0;
  `,

  /* ── Collapsed variants ── */
  sidebarCollapsed: css`
    width: 64px;
    padding: 28px 8px 24px;
    align-items: center;
  `,

  logoCollapsed: css`
    padding-left: 0;
    justify-content: center;
    margin-bottom: 24px;
  `,

  navItemCollapsed: css`
    justify-content: center;
    padding: 10px;
    gap: 0;
  `,

  footerCollapsed: css`
    justify-content: center;
    padding: 8px;
  `,

  toggleBtn: css`
    align-self: flex-end;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #2e2e2e;
    border: 1px solid #3a3a3a;
    color: #888;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
    &:hover {
      background: #f39c12;
      border-color: #f39c12;
      color: #000;
      box-shadow: 0 0 10px rgba(243,156,18,0.4);
    }
  `,
}));