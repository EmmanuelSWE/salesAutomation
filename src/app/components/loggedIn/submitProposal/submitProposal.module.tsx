"use client";

import { createStyles } from "antd-style";

export const useSubmitProposalStyles = createStyles(({ css }) => ({
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
    max-width: 760px;
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

  /* ── Section ── */
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

  /* ── Field ── */
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

  textarea: css`
    width: 100%;
    background: #333;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: #fff;
    outline: none;
    box-sizing: border-box;
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.15s;
    &::placeholder { color: #555; }
    &:focus { border-color: #f5a623; }
  `,

  /* ── Two-column row ── */
  row2: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  `,

  /* ── Scope items ── */
  scopeItem: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,

  scopeDot: css`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #f5a623;
    flex-shrink: 0;
  `,

  scopeInput: css`
    flex: 1;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    background: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: border-color 0.15s;
    &::placeholder { color: #555; }
    &:focus { border-color: #f5a623; }
  `,

  scopeItemLabel: css`
    font-size: 12px;
    color: #888;
    margin-bottom: 4px;
  `,

  /* ── Line item card ── */
  lineItemCard: css`
    background: #333;
    border: 1px solid #3a3a3a;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,

  lineItemHeader: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,

  lineItemRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    > * { flex: 1 1 120px; min-width: 0; }
  `,

  removeItemBtn: css`
    background: transparent;
    border: none;
    color: #888;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    padding: 0 4px;
    transition: color 0.15s;
    &:hover { color: #f44336; }
  `,

  addItemBtn: css`
    align-self: flex-start;
    background: #3a3a3a;
    border: none;
    border-radius: 8px;
    padding: 7px 14px;
    color: #f5a623;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
    &:hover { background: #444; }
  `,

  /* ── Dropzone ── */
  dropzone: css`
    width: 100%;
    background: #333;
    border: 1px dashed #3a3a3a;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    color: #555;
    font-size: 12px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    box-sizing: border-box;
    &:hover {
      border-color: #f5a623;
      color: #aaa;
    }
  `,

  /* ── Submit ── */
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
  `,
}));