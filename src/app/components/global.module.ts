"use client";

import { createStyles } from 'antd-style';

// global theme as TS, not CSS
export const useStyles = createStyles(({ css }) => ({
  "@global": {
    ":root": {
      "--color-bg": "#121212",
      "--color-card": "#1b1b1b",
      "--color-accent": "#f39c12",
      "--color-text": "#ffffff",
      "--font-main": "Inter, Arial, sans-serif",
    },

    "html, body": css`
      background: var(--color-bg);
      color: var(--color-text);
      margin: 0;
      padding: 0;
      font-family: var(--font-main);
    `,

    ".global-orange-button": css`
      background: var(--color-accent) !important;
      border-color: var(--color-accent) !important;
      color: #121212 !important;
      font-weight: 600;
    `,
  },
}));