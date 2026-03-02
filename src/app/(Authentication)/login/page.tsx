'use client'

import { Input } from "antd";
import { useState } from "react";
import { useLoginStyles } from "../../components/login/login.module";
import { loginUser, extractApiMessage } from "../../lib/utils/apiMutations";
import { setToken } from "../../lib/utils/axiosInstance";
import { AuthButton } from "../../components/auth/authButton";

const Login = () => {
  const { styles } = useLoginStyles();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email    = (fd.get("email")    as string)?.trim();
    const password = (fd.get("password") as string);

    const errs: Record<string, string> = {};
    if (!email)    errs.email    = "Email is required.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Password is required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsPending(true);
    setApiError("");
    try {
      const res = await loginUser(email, password);
      setToken(res.data.token);
      if (res.data.userId) localStorage.setItem("auth_user_id", res.data.userId);
      globalThis.window.location.href = "/activities";
    } catch (err) {
      setApiError(extractApiMessage(err) || "Invalid credentials.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>&#9889;</div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        {apiError && (
          <p style={{ color: "#ff6b6b", marginBottom: 16, fontSize: 13, background: "rgba(255,107,107,0.08)", borderRadius: 8, padding: "10px 14px" }}>
            {apiError}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18, textAlign: "left" }}>
            <label className={styles.label} htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              placeholder="you@company.com"
              className={styles.input}
              autoComplete="email"
            />
            {errors.email && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4 }}>{errors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: 24, textAlign: "left" }}>
            <label className={styles.label} htmlFor="password">Password</label>
            <Input.Password
              id="password"
              name="password"
              placeholder=""
              className={styles.input}
              autoComplete="current-password"
            />
            {errors.password && (
              <p style={{ color: "#ff6b6b", fontSize: 12, marginTop: 4 }}>{errors.password}</p>
            )}
          </div>

          <AuthButton label={isPending ? "Signing in..." : "Login"} isPending={isPending} />
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
