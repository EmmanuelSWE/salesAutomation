"use client";
import { createStyles } from "antd-style";

export const useClientContactDetailsStyles = createStyles(({ css }) => ({
  contactsRow: css`display: flex; gap: 10px; flex-wrap: wrap;`,

  contactCard: css`
    flex: 1;
    min-width: 150px;
    background: #252525;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border: 1px solid #333;
  `,

  contactHeader: css`display: flex; align-items: center; justify-content: space-between;`,
  contactNameRow: css`display: flex; align-items: center; gap: 6px; flex-wrap: wrap;`,
  contactName: css`font-size: 13px; font-weight: 600; color: #fff;`,

  tagRecent: css`
    background: #1a3a1a; color: #66bb6a;
    font-size: 10px; font-weight: 600;
    padding: 1px 7px; border-radius: 99px;
  `,
  tagMostUsed: css`
    background: #1a3a1a; color: #66bb6a;
    font-size: 10px; font-weight: 600;
    padding: 1px 7px; border-radius: 99px;
  `,

  editBtn: css`
    background: #333; border: none; border-radius: 6px;
    padding: 3px 9px; font-size: 11px; color: #ccc; cursor: pointer;
    &:hover { background: #3a3a3a; color: #fff; }
  `,

  contactValue: css`font-size: 12px; color: #888; letter-spacing: 0.4px;`,

  addContactBtn: css`
    width: 100%;
    background: transparent;
    border: 1px dashed #3a3a3a;
    border-radius: 10px;
    padding: 12px;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    &:hover { border-color: #5c6bc0; color: #fff; }
  `,
}));