"use client";

import { createStyles } from "antd-style";

export const useAccountInfoStyles = createStyles(({ css }) => ({
  page: css`
    width: 100%;
    min-height: 100vh;
    background: #1e1e1e;
    display: flex;
    flex-direction: column;
    padding: 40px 36px;
    box-sizing: border-box;
    color: #fff;
    font-family: 'Inter', sans-serif;
  `,

  title: css`
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 32px 0;
  `,

  profileCard: css`
    background: #252525;
    border-radius: 16px;
    padding: 32px;
    display: flex;
    align-items: center;
    gap: 28px;
    margin-bottom: 28px;
    max-width: 700px;
  `,

  avatar: css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5c6bc0, #26a69a);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    letter-spacing: 1px;
  `,

  profileMeta: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `,

  fullName: css`
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  `,

  email: css`
    font-size: 14px;
    color: #888;
    margin: 0;
  `,

  roleBadge: css`
    display: inline-flex;
    align-items: center;
    margin-top: 6px;
    background: #3a3a3a;
    border-radius: 20px;
    padding: 3px 12px;
    font-size: 12px;
    font-weight: 600;
    color: #f5a623;
    letter-spacing: 0.4px;
    width: fit-content;
  `,

  detailsGrid: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    max-width: 700px;
  `,

  fieldCard: css`
    background: #252525;
    border-radius: 12px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  `,

  fieldLabel: css`
    font-size: 11px;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  `,

  fieldValue: css`
    font-size: 14px;
    color: #ccc;
    font-weight: 500;
    word-break: break-all;
  `,

  fieldValueEmpty: css`
    font-size: 14px;
    color: #444;
    font-style: italic;
  `,

  section: css`
    margin-bottom: 28px;
  `,

  sectionTitle: css`
    font-size: 13px;
    font-weight: 600;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin: 0 0 12px 0;
  `,

  logoutBtn: css`
    margin-top: 8px;
    max-width: 700px;
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 10px;
    background: #3a1a1a;
    color: #ef5350;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
    &:hover {
      background: #4d2020;
    }
  `,

  skeletonBlock: css`
    border-radius: 4px;
    background: #2e2e2e;
    animation: skel 1.4s ease-in-out infinite;
    @keyframes skel {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,

  skeletonCircle: css`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #2e2e2e;
    flex-shrink: 0;
    animation: skel 1.4s ease-in-out infinite;
    @keyframes skel {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `,
}));
