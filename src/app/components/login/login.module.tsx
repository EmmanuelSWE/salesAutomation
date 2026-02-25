import { createStyles } from "antd-style";

export const useLoginStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000000; /* PURE BLACK BACKGROUND */
  `,

  card: css`
    width: 380px;
    padding: 40px 30px;
    background: #1b1b1b; /* dark card */
    border-radius: 16px;
    box-shadow: 0 0 30px rgba(0,0,0,0.4);
    text-align: center;
  `,

  title: css`
    font-size: 32px;
    margin-bottom: 30px;
    font-weight: 700;
    color: white;
  `,

  input: css`
    border-radius: 50px !important;
    border: 2px solid #f39c12 !important; /* orange outline */
    padding: 10px 18px !important;
    background: white !important; /* white background */
    color: black !important; /* black text */

    &::placeholder {
      color: #888888; /* darker placeholder for better contrast */
    }

    &:focus {
      outline: none !important;
      border-color: #f39c12 !important;
      box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.3) !important; /* orange glow outline */
    }
  `,

  button: css`
    margin-top: 25px;
    width: 100%;
    border-radius: 50px !important;
    padding: 10px 0 !important;
  `,
}));