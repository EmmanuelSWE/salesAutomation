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
}));