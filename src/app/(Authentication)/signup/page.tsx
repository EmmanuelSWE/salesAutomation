'use client'

import { Input, Select } from "antd";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupStyles } from "../../components/signup/signup.module";
import { registerAction } from "../../lib/actions";
import { setToken } from "../../lib/utils/axiosInstance";
import {SubmitButton} from "../../components/loggedIn/form/submitButton";
import Link from "next/link";

const { Option } = Select;

const Signup = () => {
  const { styles } = useSignupStyles();
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, { status: "idle" });
  const [tenantIdValue, setTenantIdValue] = useState("");
  const [roleValue, setRoleValue] = useState("SalesRep");

  useEffect(() => {
    if (state.status === "success" && state.token) {
      setToken(state.token);
      router.push("/login");
    }
  }, [state.status, state.token, router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign Up</h1>
        <p className={styles.subtitle}>Create your account to get started</p>

        {state.status === "error" && state.message && (
          <p style={{ color: "red", marginBottom: 12 }}>{state.message}</p>
        )}

        {/* 
          Three Registration Scenarios:
          1. Create new organization: Fill in Tenant Name (no Tenant ID) → become Admin/Owner
          2. Join existing organization: Fill in Tenant ID + select Role → join with specified role
          3. Default tenant: Leave both empty → register with default tenant as SalesRep
        */}
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

          {/* Tenant Name (Optional) */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="tenantName"
              placeholder="Tenant / Organization Name (optional)"
              className={styles.input}
              autoComplete="organization"
            />
            {state.errors?.tenantName && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.tenantName}
              </p>
            )}
          </div>

          {/* Tenant ID (Optional) */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="tenantId"
              placeholder="Tenant ID (optional - to join existing organization)"
              className={styles.input}
              value={tenantIdValue}
              onChange={(e) => setTenantIdValue(e.target.value)}
            />
            {state.errors?.tenantId && (
              <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                {state.errors.tenantId}
              </p>
            )}
          </div>

          {/* Role (Conditional - only if Tenant ID provided) */}
          {tenantIdValue?.trim() && (
            <div style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select Role"
                className={styles.input}
                value={roleValue}
                onChange={(value) => setRoleValue(value)}
                popupMatchSelectWidth={false}
                dropdownRender={(menu) => (
                  <div style={{ background: 'white' }}>
                    {menu}
                  </div>
                )}
              >
                <Option value="SalesRep">Sales Rep</Option>
                <Option value="SalesManager">Sales Manager</Option>
              </Select>
              <input type="hidden" name="role" value={roleValue} />
              {state.errors?.role && (
                <p style={{ color: "red", fontSize: 12, textAlign: "left", marginTop: 4 }}>
                  {state.errors.role}
                </p>
              )}
            </div>
          )}

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