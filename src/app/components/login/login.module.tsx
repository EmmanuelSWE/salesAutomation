import { createStyles } from "antd-style";

export const useLoginStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background:
      radial-gradient(ellipse 55% 60% at 95% 50%, rgba(243, 156, 18, 0.45) 0%, transparent 70%),
      radial-gradient(ellipse 55% 60% at 5% 50%, rgba(230, 126, 34, 0.40) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 50% 100%, rgba(243, 100, 10, 0.20) 0%, transparent 60%),
      #050505;
  `,

  card: css`
    width: 400px;
    padding: 48px 40px;
    background: #161616;
    border: 1px solid #2e2e2e;
    border-radius: 20px;
    box-shadow: 0 0 60px rgba(243, 156, 18, 0.08), 0 24px 64px rgba(0,0,0,0.6);
    text-align: center;
  `,

  logo: css`
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 24px;
    box-shadow: 0 4px 20px rgba(243, 156, 18, 0.4);
  `,

  title: css`
    font-size: 28px;
    margin: 0 0 6px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
  `,

  subtitle: css`
    font-size: 14px;
    color: #666;
    margin: 0 0 32px;
  `,

  label: css`
    display: block;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #999;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 6px;
  `,

  input: css`
    border-radius: 10px !important;
    border: 1.5px solid #2e2e2e !important;
    padding: 11px 16px !important;
    background: #1f1f1f !important;
    color: #fff !important;
    font-size: 14px !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;

    &::placeholder {
      color: #555 !important;
    }

    &:hover {
      border-color: #444 !important;
    }

    &:focus, &:focus-within {
      border-color: #f39c12 !important;
      box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.18) !important;
      background: #222 !important;
    }

    /* antd password icon color */
    .ant-input-password-icon {
      color: #666 !important;
      &:hover { color: #f39c12 !important; }
    }
  `,

  divider: css`
    border: none;
    border-top: 1px solid #2a2a2a;
    margin: 28px 0;
  `,

  footer: css`
    font-size: 13px;
    color: #555;
    margin-top: 24px;

    a {
      color: #f39c12;
      font-weight: 600;
      text-decoration: none;
      &:hover { color: #f7c948; }
    }
  `,
}));