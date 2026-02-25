import { createStyles } from "antd-style";

export const useDashboardStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    min-height: 100vh;
    background: #000000; /* PURE BLACK BACKGROUND */
    padding: 30px;
  `,

  content: css`
    max-width: 1400px;
    margin: 0 auto;
  `,

  header: css`
    margin-bottom: 30px;
    
    h1 {
      color: white;
      font-size: 28px;
      margin: 0 0 5px 0;
      font-weight: 600;
    }
    
    p {
      color: #888;
      margin: 0;
      font-size: 14px;
    }
  `,

  statsRow: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  `,

  statCard: css`
    background: #1b1b1b; /* dark card */
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 0 30px rgba(0,0,0,0.4);
    
    h3 {
      color: #888;
      margin: 0 0 10px 0;
      font-size: 16px;
      font-weight: 500;
    }
    
    .value {
      color: white;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .trend {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      
      &.positive {
        color: #4caf50;
      }
      
      &.negative {
        color: #f44336;
      }
    }
  `,

  gridRow: css`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  `,

  card: css`
    background: #1b1b1b; /* dark card */
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 0 30px rgba(0,0,0,0.4);
    
    canvas {
      max-height: 250px;
      width: 100% !important;
    }
  `,

  cardHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      color: white;
      font-size: 18px;
      margin: 0;
      font-weight: 600;
    }
    
    a {
      color: #f39c12;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `,

  metricLarge: css`
    margin-bottom: 24px;
    
    .label {
      color: #888;
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .number {
      color: white;
      font-size: 42px;
      font-weight: 700;
    }
  `,

  progressList: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,

  progressItem: css`
    .label {
      display: flex;
      justify-content: space-between;
      color: white;
      margin-bottom: 8px;
      font-size: 14px;
      
      span:last-child {
        color: #f39c12;
        font-weight: 600;
      }
    }
    
    .progressBar {
      height: 8px;
      background: #333;
      border-radius: 4px;
      overflow: hidden;
      
      .fill {
        height: 100%;
        background: #f39c12;
        border-radius: 4px;
      }
    }
  `,

  statsGrid: css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  `,

  miniStat: css`
    .label {
      color: #888;
      font-size: 13px;
      margin-bottom: 5px;
    }
    
    .value {
      color: white;
      font-size: 18px;
      font-weight: 600;
    }
    
    .percentage {
      color: #f39c12;
      font-size: 14px;
      margin-left: 5px;
    }
  `,

  incomeCard: css`
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    
    .label {
      color: rgba(255,255,255,0.9);
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .value {
      color: white;
      font-size: 42px;
      font-weight: 700;
    }
  `,

  footer: css`
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #333;
    display: flex;
    justify-content: center;
    gap: 30px;
    
    a {
      color: #888;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        color: #f39c12;
      }
    }
  `,

  canvas: css`
    max-width: 100%;
    height: auto !important;
  `,
}));