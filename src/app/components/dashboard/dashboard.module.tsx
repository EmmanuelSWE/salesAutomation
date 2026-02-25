"use client";

import { createStyles } from "antd-style";

export const useDashboardStyles = createStyles(({ css, cx }) => ({
  /* PAGE */
  page: css`
    width: 100%;
    min-height: 100vh;
    background: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 24px;
    box-sizing: border-box;
  `,

  /* MAIN LAYOUT */
  wrapper: css`
    display: flex;
    width: 100%;
    max-width: 1440px;
    min-height: calc(100vh - 48px);
    background: #2a2a2a;
    border-radius: 20px;
    overflow: hidden;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
  `,

  /* SIDEBAR */
  sidebar: css`
    width: 220px;
    flex-shrink: 0;
    background: #252525;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28px 16px 24px;
    box-sizing: border-box;
  `,

  sidebarTop: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  `,

  sidebarLogo: css`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    margin-bottom: 28px;
    padding-left: 6px;
  `,

  sidebarLogoIcon: css`
    font-size: 22px;
    line-height: 1;
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

  sidebarFooter: css`
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

  /* CONTENT */
  content: css`
    flex: 1;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    min-width: 0;
  `,

  /* TOPBAR */
  topbar: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #222;
    border-radius: 12px;
    padding: 10px 18px;
    flex-shrink: 0;
  `,

  breadcrumb: css`
    display: flex;
    gap: 6px;
    align-items: center;
    color: #888;
    font-size: 13px;
    & span.active { color: #fff; font-weight: 600; }
  `,

  topRight: css`
    display: flex;
    gap: 10px;
    align-items: center;
  `,

  searchBox: css`
    display: flex;
    align-items: center;
    gap: 7px;
    background: #333;
    border-radius: 8px;
    padding: 6px 12px;
    color: #888;
    font-size: 13px;
    min-width: 160px;
  `,

  iconBtn: css`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    cursor: pointer;
    font-size: 15px;
    &:hover { color: #fff; background: #3a3a3a; }
  `,

  /* KPI ROW */
  row2: css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  `,

  card: css`
    background: #2e2e2e;
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  `,

  kpiCard: css`
    background: #2e2e2e;
    border-radius: 14px;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    overflow: hidden;
  `,

  kpiGradient: css`
    background: linear-gradient(135deg, #f5a623, #f7c948);
    color: #1a1000;
  `,

  kpiLabel: css`
    font-size: 12px;
    opacity: 0.7;
    font-weight: 500;
  `,

  kpiValue: css`
    font-size: 32px;
    font-weight: 700;
    line-height: 1.1;
  `,

  kpiTrend: css`
    font-size: 12px;
    font-weight: 500;
    margin-top: 2px;
  `,

  kpiTrendUp: css`color: #4caf50;`,
  kpiTrendDown: css`color: #f44336;`,

  kpiIcon: css`
    position: absolute;
    top: 14px;
    right: 16px;
    font-size: 18px;
    opacity: 0.6;
  `,

  /* USERS SECTION */
  usersCard: css`
    background: #2e2e2e;
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  `,

  usersHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  usersTabs: css`
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 13px;
    color: #888;
    & span.active { color: #fff; font-weight: 600; }
  `,

  usersControls: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  dropdown: css`
    background: #3a3a3a;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    color: #ccc;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  `,

  usersTotalRow: css`
    display: flex;
    align-items: baseline;
    gap: 12px;
  `,

  usersLabel: css`
    font-size: 13px;
    color: #888;
  `,

  usersTotal: css`
    font-size: 36px;
    font-weight: 700;
  `,

  chips: css`
    display: flex;
    gap: 30px;
  `,

  chip: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  chipLabel: css`
    font-size: 11px;
    color: #888;
  `,

  chipValue: css`
    font-size: 17px;
    font-weight: 700;
    color: #fff;
  `,

  chipValueBlue: css`
    font-size: 17px;
    font-weight: 700;
    color: #4d9fff;
  `,

  /* CHARTS */
  chartSm: css`height: 150px;`,
  chartMd: css`height: 200px;`,
  chartLg: css`height: 220px;`,

  /* STAFF + PROPOSAL */
  cardTitle: css`
    font-size: 13px;
    font-weight: 600;
    color: #f5a623;
  `,

  cardTitleBlue: css`
    font-size: 13px;
    font-weight: 600;
    color: #4d9fff;
  `,

  staffBody: css`
    display: flex;
    align-items: center;
    gap: 16px;
  `,

  staffChartWrap: css`
    flex: 0 0 130px;
    height: 130px;
  `,

  staffLegend: css`
    display: flex;
    flex-direction: column;
    gap: 7px;
    flex: 1;
  `,

  legendRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    gap: 8px;
  `,

  legendDot: css`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  `,

  legendName: css`
    flex: 1;
    color: #ccc;
  `,

  legendVal: css`
    color: #fff;
    font-weight: 500;
  `,

  proposalBody: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  `,

  proposalChartWrap: css`
    width: 200px;
    height: 120px;
  `,

  /* TURNAROUND */
  turnaroundHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  turnaroundLegend: css`
    display: flex;
    gap: 14px;
    align-items: center;
    font-size: 12px;
    color: #aaa;
  `,

  legendLine: css`
    width: 20px;
    height: 2px;
    border-radius: 1px;
  `,

  /* INCOME */
  incomeHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  /* BOTTOM */
  bottomPanel: css`
    background: #222;
    border-radius: 12px;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;
  `,

  bottomAvatar: css`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #555;
    margin-right: auto;
  `,

  bottomLink: css`
    font-size: 13px;
    color: #888;
    cursor: pointer;
    &:hover { color: #fff; }
  `,
}));