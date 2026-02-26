'use client'

import { Input, Select } from "antd";

import { useActionState, useEffect } from "react";
import { useSignupStyles } from "../../components/signup/signup.module";
import { useUserAction } from "../../lib/providers/index";
import { registerAction } from "../../lib/actions";
import {SubmitButton} from "../../components/loggedIn/form/submitButton";
import Link from "next/link";

const { Option } = Select;

const Signup = () => {
  const { styles } = useSignupStyles();
  const { registerUser } = useUserAction();
  const [state, formAction] = useActionState(registerAction, { status: "idle" });

  useEffect(() => {
    if (state.status === "success" && state.user) {
      registerUser(state.user);
    }
  }, [state.status]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <p className={styles.subtitle}>Create your account to get started</p>

        {state.status === "error" && state.message && (
          <p style={{ color: "red", marginBottom: 12 }}>{state.message}</p>
        )}

        <form action={formAction}>
          {/* First Name */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="firstName"
              placeholder="First Name"
              className={styles.input}
              autoComplete="given-name"
            />
            {state.errors?.firstName && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="lastName"
              placeholder="Last Name"
              className={styles.input}
              autoComplete="family-name"
            />
            {state.errors?.lastName && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="email"
              placeholder="Email"
              className={styles.input}
              autoComplete="email"
            />
            {state.errors?.email && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              className={styles.input}
              autoComplete="tel"
            />
            {state.errors?.phoneNumber && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <Input.Password
              name="password"
              placeholder="Password"
              className={styles.input}
              autoComplete="new-password"
            />
            {state.errors?.password && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: 16 }}>
            <Input.Password
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.input}
              autoComplete="new-password"
            />
            {state.errors?.confirmPassword && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.confirmPassword}
              </p>
            )}
          </div>

          <SubmitButton label="Sign Up" pendingLabel="Registering…" />  
        </form>

        <p className={styles.footer}>
          Already have an account?
          <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;