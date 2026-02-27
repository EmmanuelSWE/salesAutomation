'use client'

import { Input } from "antd";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginStyles } from "../../components/login/login.module";
import { loginAction } from "../../lib/actions";
import { setToken } from "../../lib/utils/axiosInstance";
import { SubmitButton } from "../../components/loggedIn/form/submitButton";

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
        <h1 className={styles.title}>Login</h1>

        {state.status === "error" && (
          <p style={{ color: "red", marginBottom: 12 }}>
            {state.message ?? "Invalid credentials."}
          </p>
        )}

        <form action={formAction}>
          <div style={{ marginBottom: 16 }}>
            <Input
              name="email"
              placeholder="Email"
              className={styles.input}
              autoComplete="email"
            />
            {state.errors?.email && (
              <p style={{ color: "red", fontSize: 12 }}>{state.errors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <Input.Password
              name="password"
              placeholder="Password"
              className={styles.input}
              autoComplete="current-password"
            />
            {state.errors?.password && (
              <p style={{ color: "red", fontSize: 12 }}>{state.errors.password}</p>
            )}
          </div>

          <SubmitButton label="Login" pendingLabel="Logging in…" />
        </form>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          Don&apos;t have an account?{" "}
          <a href="/signup" style={{ color: "#f97316" }}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;