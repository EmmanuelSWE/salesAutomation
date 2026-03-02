"use client";

import { createStyles } from "antd-style";

export const useOpportunitiesStyles = createStyles(({ css }) => ({
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
    margin: 0 0 20px 0;
  `,

  listContainer: css`
    border-radius: 10px;
    box-shadow: 0 6px 24px rgba(243, 156, 18, 0.12), 0 2px 8px rgba(255, 200, 100, 0.07);
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
    width: 32px;
    height: 32px;
    background: #f5a623;
    border: none;
    border-radius: 8px;
    color: #1a1000;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
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
      cursor: pointer;
    }
    & tr:hover { background: #323232; }
    & td {
      padding: 12px 16px;
      color: #ccc;
      vertical-align: middle;
    }
  `,

  clientCell: css`
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
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  `,

  clientName: css`
    color: #fff;
    font-weight: 500;
  `,

  idCell: css`
    color: #888;
    font-family: monospace;
    font-size: 12px;
  `,

  dateCell: css`
    display: flex;
    align-items: center;
    gap: 6px;
    color: #888;
    font-size: 12px;
    white-space: nowrap;
  `,

  badge: css`
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  `,

  pagination: css`
    display: flex;
    gap: 6px;
    padding: 16px;
    justify-content: flex-start;
    background: #2a2a2a;
    border-top: 1px solid #333;
    border-radius: 0 0 10px 10px;
  `,

  pageBtn: css`
    min-width: 36px;
    height: 28px;
    background: #333;
    border: none;
    border-radius: 6px;
    color: #aaa;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    transition: background 0.15s, color 0.15s;
    &:hover { background: #444; color: #fff; }
  `,

  pageBtnActive: css`
    background: #f5a623 !important;
    color: #1a1000 !important;
    font-weight: 700;
  `,

  emptyRow: css`
    text-align: center;
    color: #444;
    padding: 32px 0 !important;
  `,

  skeletonBlock: css`
    height: 14px;
    border-radius: 4px;
    background: #2e2e2e;
    animation: skel 1.4s ease-in-out infinite;
    @keyframes skel {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,

  skeletonAvatar: css`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #2e2e2e;
    flex-shrink: 0;
    animation: skel 1.4s ease-in-out infinite;
    @keyframes skel {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,

  skeletonSearch: css`
    flex: 1;
    height: 34px;
    border-radius: 8px;
    background: #2e2e2e;
    animation: skel 1.4s ease-in-out infinite;
    @keyframes skel {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,

  skeletonBtn: css`
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: #2e2e2e;
    flex-shrink: 0;
    animation: skel 1.4s ease-in-out infinite;
    @keyframes skel {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,
}));
