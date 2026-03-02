"use client";

import { createStyles } from "antd-style";

export const usePricingRequestsStyles = createStyles(({ css }) => ({
  page: css`
    width: 100%;
    min-height: 100vh;
    background: #1e1e1e;
    display: flex;
    flex-direction: column;
    padding: 32px 28px;
    box-sizing: border-box;
    color: #fff;
    font-family: 'Inter', sans-serif;
  `,

  title: css`
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 16px 0;
  `,

  tabsBar: css`
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  `,

  tab: css`
    padding: 6px 18px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid #333;
    background: #2a2a2a;
    color: #888;
    transition: all 0.15s;
    &:hover { background: #333; color: #ccc; }
  `,

  tabActive: css`
    background: rgba(245,166,35,0.15);
    border-color: rgba(245,166,35,0.4);
    color: #f5a623;
  `,

  listContainer: css`
    border-radius: 10px;
    box-shadow: 0 6px 24px rgba(243,156,18,0.12), 0 2px 8px rgba(255,200,100,0.07);
    overflow: hidden;
  `,

  toolbar: css`
    display: flex;
    align-items: center;
    gap: 10px;
    background: #2a2a2a;
    border-radius: 10px 10px 0 0;
    padding: 12px 16px;
    border-bottom: 1px solid #333;
  `,

  searchWrap: css`
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #333;
    border-radius: 8px;
    padding: 7px 12px;
  `,

  searchIcon: css`
    color: #666;
    font-size: 14px;
    flex-shrink: 0;
  `,

  searchInput: css`
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 13px;
    &::placeholder { color: #555; }
  `,

  iconBtn: css`
    width: 32px;
    height: 32px;
    background: #333;
    border: none;
    border-radius: 8px;
    color: #aaa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
    &:hover { background: #444; color: #fff; }
  `,

  addBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: #f5a623;
    border: none;
    border-radius: 8px;
    color: #1a1000;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    text-decoration: none;
    transition: background 0.15s;
    &:hover { background: #f7c948; }
  `,

  tableWrap: css`
    background: #2a2a2a;
    overflow: hidden;
  `,

  table: css`
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  `,

  thead: css`
    & th {
      text-align: left;
      color: #666;
      font-weight: 500;
      font-size: 12px;
      padding: 10px 16px;
      border-bottom: 1px solid #333;
      white-space: nowrap;
    }
  `,

  tbody: css`
    & tr {
      border-bottom: 1px solid #2e2e2e;
      transition: background 0.1s;
    }
    & tr:hover { background: #323232; }
    & td {
      padding: 12px 16px;
      color: #ccc;
      vertical-align: middle;
    }
  `,

  titleCell: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  avatar: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    background: #444;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
  `,

  titleName: css`
    font-weight: 500;
    color: #e0e0e0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
  `,

  badge: css`
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  `,

  dateCell: css`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #999;
    font-size: 12px;
  `,

  actionCell: css`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  `,

  actionBtn: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 600;
    border: 1px solid;
    cursor: pointer;
    transition: opacity 0.15s;
    background: rgba(92,107,192,0.12);
    border-color: rgba(92,107,192,0.35);
    color: #9aa0dc;
    &:hover { opacity: 0.8; }
    &:disabled { opacity: 0.35; cursor: not-allowed; }
  `,

  actionBtnGreen: css`
    background: rgba(76,175,80,0.1);
    border-color: rgba(76,175,80,0.35);
    color: #4caf50;
  `,

  actionBtnRed: css`
    background: rgba(244,67,54,0.08);
    border-color: rgba(244,67,54,0.3);
    color: #f44336;
  `,

  inlineAssign: css`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  `,

  inlineSelect: css`
    background: #1e1e1e;
    border: 1px solid #333;
    color: #ccc;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 11px;
    outline: none;
    min-width: 130px;
  `,

  emptyRow: css`
    text-align: center;
    color: #555;
    padding: 40px 16px !important;
    font-size: 13px;
  `,

  pagination: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: #2a2a2a;
    padding: 12px 16px;
    border-top: 1px solid #333;
  `,

  pageBtn: css`
    min-width: 30px;
    height: 30px;
    background: #333;
    border: none;
    border-radius: 6px;
    color: #aaa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: background 0.15s, color 0.15s;
    &:hover:not(:disabled) { background: #444; color: #fff; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  `,

  pageBtnActive: css`
    background: rgba(245,166,35,0.2);
    border: 1px solid rgba(245,166,35,0.4);
    color: #f5a623;
  `,

  /* Skeletons */
  skeletonSearch: css`
    flex: 1;
    height: 32px;
    background: #333;
    border-radius: 8px;
    animation: pulse 1.4s ease-in-out infinite;
    @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
  `,

  skeletonBtn: css`
    width: 32px;
    height: 32px;
    background: #333;
    border-radius: 8px;
    animation: pulse 1.4s ease-in-out infinite;
  `,

  skeletonAvatar: css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #333;
    flex-shrink: 0;
    animation: pulse 1.4s ease-in-out infinite;
  `,

  skeletonBlock: css`
    height: 14px;
    background: #333;
    border-radius: 4px;
    animation: pulse 1.4s ease-in-out infinite;
  `,
}));
