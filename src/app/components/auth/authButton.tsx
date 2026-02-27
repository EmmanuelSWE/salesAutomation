"use client";

import { createStyles } from "antd-style";

const useAuthButtonStyles = createStyles(({ css }) => ({
  button: css`
    margin-top: 8px;
    width: 100%;
    height: 46px;
    border-radius: 10px;
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    border: none;
    color: #000;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 20px rgba(243, 156, 18, 0.35);
    transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
      box-shadow: 0 6px 28px rgba(243, 156, 18, 0.5);
    }

    &:active { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
}));

interface AuthButtonProps {
  label: string;
}

export const AuthButton = ({ label }: Readonly<AuthButtonProps>) => {
  const { styles } = useAuthButtonStyles();
  return (
    <button type="submit" className={styles.button}>
      {label}
    </button>
  );
};
