"use client";
import { createStyles } from "antd-style";

export const useClientDocumentHistoryStyles = createStyles(({ css }) => ({
  pdfBtn: css`
    display: flex; align-items: center; gap: 5px;
    color: #777; font-size: 12px;
    background: none; border: none; cursor: pointer;
    padding: 0;
    &:hover { color: #fff; }
  `,
}));