'use client'

import { Input } from "antd";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginStyles } from "../../components/login/login.module";
import { loginAction } from "../../lib/actions";
import { setToken } from "../../lib/utils/axiosInstance";
import { AuthButton } from "../../components/auth/authButton";

const Login = () => {
  const { styles } = useLoginStyles();
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, { status: "idle" });

  useEffect(() => {
    if (state.status === "success" && state.token) {
      setToken(state.token);
      router.push("/clients");
    }
  }, [state.status, state.token]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>⚡</div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {state.status === "error" && (
          <p style={{ color: "#ff6b6b", marginBottom: 16, fontSize: 13, background: "rgba(255,107,107,0.08)", borderRadius: 8, padding: "10px 14px" }}>
            {state.message ?? "Invalid credentials."}
          </p>
        )}

        <form action={formAction}>
          <div style={{ marginBottom: 18, textAlign: "left" }}>
            <label className={styles.label} htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              placeholder="you@company.com"
              className={styles.input}
              autoComplete="email"
            />
            {state.errors?.email && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4 }}>{state.errors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: 24, textAlign: "left" }}>
            <label className={styles.label} htmlFor="password">Password</label>
            <Input.Password
              id="password"
              name="password"
              placeholder="••••••••"
              className={styles.input}
              autoComplete="current-password"
            />
            {state.errors?.password && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4 }}>{state.errors.password}</p>
            )}
          </div>

          <AuthButton label="Login" />
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;