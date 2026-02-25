import { createStyles } from "antd-style";

export const useSignupStyles = createStyles(({ css }) => ({
  container: css`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000000; /* PURE BLACK BACKGROUND */
    padding: 20px;
  `,

  card: css`
    width: 420px;
    padding: 40px 30px;
    background: #1b1b1b; /* dark card */
    border-radius: 16px;
    box-shadow: 0 0 30px rgba(0,0,0,0.4);
    text-align: center;
  `,

  title: css`
    font-size: 32px;
    margin-bottom: 10px;
    font-weight: 700;
    color: white;
  `,

  subtitle: css`
    font-size: 14px;
    color: #888;
    margin-bottom: 30px;
    text-align: left;
    border-bottom: 1px solid #333;
    padding-bottom: 15px;
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

    /* Target the actual input element inside AntD components */
    input {
      background: white !important;
      color: black !important;
    }

    /* For Input.Password specifically */
    .ant-input-password {
      background: white !important;
    }

    .ant-input {
      background: white !important;
      color: black !important;
    }
  `,

  button: css`
    margin-top: 25px;
    width: 100%;
    border-radius: 50px !important;
    padding: 10px 0 !important;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  `,

  footer: css`
    margin-top: 20px;
    color: #888;
    font-size: 14px;
    
    a {
      color: #f39c12;
      text-decoration: none;
      margin-left: 5px;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `,
}));