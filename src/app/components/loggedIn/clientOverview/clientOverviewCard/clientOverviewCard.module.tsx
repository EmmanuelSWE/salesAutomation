"use client";
import { createStyles } from "antd-style";

export const useClientOverviewCardStyles = createStyles(({ css }) => ({
  headerBtns: css`display: flex; gap: 8px;`,

  btnCancel: css`
    background: #333; border: none; border-radius: 16px;
    padding: 6px 14px; font-size: 12px; color: #ccc; cursor: pointer;
    &:hover { background: #3a3a3a; color: #fff; }
  `,

  btnRenew: css`
    background: #5c6bc0; border: none; border-radius: 16px;
    padding: 6px 14px; font-size: 12px; color: #fff; font-weight: 600; cursor: pointer;
    &:hover { background: #6979d3; }
  `,

  progressSection: css`display: flex; flex-direction: column; gap: 8px;`,

  progressLabel: css`
    font-size: 13px; color: #ccc;
    & strong { color: #fff; }
  `,

  progressTrack: css`
    width: 100%; height: 6px; background: #3a3a3a;
    border-radius: 99px; overflow: hidden; display: flex; gap: 3px;
  `,

  progressSeg: css`height: 100%; border-radius: 99px; flex: 1;`,
  progressNote: css`font-size: 12px; color: #666;`,

  stepsList: css`display: flex; flex-direction: column; gap: 7px; margin-top: 4px;`,

  stepItem: css`display: flex; align-items: center; gap: 10px; font-size: 12px; color: #aaa;`,

  stepDot: css`width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;`,
  stepDotDone:    css`background: #5c6bc0;`,
  stepDotPending: css`background: #3a3a3a; border: 1px solid #555;`,

  stepText: css`flex: 1;`,
  stepDone: css`color: #666; text-decoration: line-through;`,

  checkIcon: css`color: #5c6bc0; font-size: 11px; flex-shrink: 0;`,

  alertBox: css`
    background: #252525; border: 1px solid #3a3a3a; border-radius: 10px;
    padding: 12px 14px; display: flex; gap: 10px; align-items: flex-start;
  `,
  alertTitle: css`font-size: 13px; font-weight: 600; color: #fff;`,
  alertSub:   css`font-size: 12px; color: #666;`,
}));