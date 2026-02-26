'use client'

import { Input } from "antd";
import { useActionState } from "react";
import { useEffect } from "react";
import { useLoginStyles } from "../../components/login/login.module";
import { useUserAction } from "../../lib/providers/index";
import { loginAction } from "../../lib/actions";
import {SubmitButton} from "../../components/loggedIn/form/submitButton";

const Login = () => {
  const { styles } = useLoginStyles();
  const { loginUser } = useUserAction();
  const [state, formAction] = useActionState(loginAction, { status: "idle" });

  useEffect(() => {
    if (state.status === "success" && state.email && state.password) {
      loginUser(state.email, state.password);
    }
  }, [state.status]);

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
      </div>
    </div>
  );
};

export default Login;