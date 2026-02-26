"use client";

import { createStyles } from "antd-style";

export const useCreateClientStyles = createStyles(({ css }) => ({
  page: css`
    width: 100%;
    min-height: 100vh;
    background: #1e1e1e;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 20px;
    box-sizing: border-box;
  `,

  form: css`
    width: 100%;
    max-width: 520px;
    background: #2a2a2a;
    border-radius: 16px;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  `,

  formTitle: css`
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  `,

  section: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,

  sectionTitle: css`
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  `,

  field: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  label: css`
    font-size: 11px;
    color: #888;
  `,

  input: css`
    width: 100%;
    background: #333;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: #fff;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
    &::placeholder { color: #555; }
    &:focus { border-color: #f5a623; }
  `,

  select: css`
    width: 100%;
    background: #333;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: #fff;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;
    appearance: none;
    transition: border-color 0.15s;
    &:focus { border-color: #f5a623; }
    & option { background: #2a2a2a; color: #fff; }
  `,

  row2: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  `,

  errorText: css`
    color: #f44336;
    font-size: 11px;
  `,

  successBanner: css`
    background: #1a3a1a;
    border: 1px solid #4caf50;
    border-radius: 10px;
    padding: 10px 14px;
    color: #4caf50;
    font-size: 13px;
  `,

  submitRow: css`
    display: flex;
    justify-content: flex-end;
  `,

  submitBtn: css`
    background: #f5a623;
    border: none;
    border-radius: 10px;
    padding: 10px 28px;
    font-size: 14px;
    font-weight: 700;
    color: #1a1000;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    &:hover { background: #f7c948; }
    &:active { transform: scale(0.97); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  `,
}));