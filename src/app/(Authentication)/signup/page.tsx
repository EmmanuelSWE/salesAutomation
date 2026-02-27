'use client'

import { Input, Select } from "antd";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupStyles } from "../../components/signup/signup.module";
import { registerAction } from "../../lib/actions";
import { setToken } from "../../lib/utils/axiosInstance";
import Link from "next/link";
import { AuthButton } from "../../components/auth/authButton";

const ROLE_OPTIONS = [
  { value: "SalesRep", label: "Sales Rep" },
  { value: "SalesManager", label: "Sales Manager" },
];

type Scenario = "quickstart" | "create-org" | "join-org";

const SCENARIOS: { key: Scenario; label: string; note: string }[] = [
  {
    key: "quickstart",
    label: "Quick Start",
    note: "Register immediately with no organization. You'll be added to the default workspace as a Sales Rep.",
  },
  {
    key: "create-org",
    label: "New Org",
    note: "Create a brand-new organization. You'll become the Admin/Owner and can invite your team.",
  },
  {
    key: "join-org",
    label: "Join Org",
    note: "Join an existing organization using the Tenant ID provided by your administrator.",
  },
];

/** Personal info fields shared across all 3 scenarios */
const PersonalFields = ({ styles, errors }: Readonly<{ styles: Record<string, string>; errors?: Record<string, string> }>) => (
  <>
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label className={styles.label} htmlFor="firstName">First Name</label>
      <Input id="firstName" name="firstName" placeholder="Jane" className={styles.input} autoComplete="given-name" />
      {errors?.firstName && <span className={styles.errorPill}>{errors.firstName}</span>}
    </div>
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label className={styles.label} htmlFor="lastName">Last Name</label>
      <Input id="lastName" name="lastName" placeholder="Smith" className={styles.input} autoComplete="family-name" />
      {errors?.lastName && <span className={styles.errorPill}>{errors.lastName}</span>}
    </div>
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label className={styles.label} htmlFor="email">Email</label>
      <Input id="email" name="email" placeholder="you@company.com" className={styles.input} autoComplete="email" />
      {errors?.email && <span className={styles.errorPill}>{errors.email}</span>}
    </div>
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label className={styles.label} htmlFor="phoneNumber">Phone Number</label>
      <Input id="phoneNumber" name="phoneNumber" placeholder="+1 (555) 000-0000" className={styles.input} autoComplete="tel" />
      {errors?.phoneNumber && <span className={styles.errorPill}>{errors.phoneNumber}</span>}
    </div>
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label className={styles.label} htmlFor="password">Password</label>
      <Input.Password id="password" name="password" placeholder="••••••••" className={styles.input} autoComplete="new-password" />
      {errors?.password && <span className={styles.errorPill}>{errors.password}</span>}
    </div>
    <div style={{ marginBottom: 20, textAlign: "left" }}>
      <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
      <Input.Password id="confirmPassword" name="confirmPassword" placeholder="••••••••" className={styles.input} autoComplete="new-password" />
      {errors?.confirmPassword && <span className={styles.errorPill}>{errors.confirmPassword}</span>}
    </div>
  </>
);

const Signup = () => {
  const { styles } = useSignupStyles();
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, { status: "idle" });
  const [scenario, setScenario] = useState<Scenario>("quickstart");
  const [roleValue, setRoleValue] = useState("SalesRep");

  useEffect(() => {
    if (state.status === "success") {
      if (state.token) setToken(state.token);
      router.push("/login");
    }
  }, [state.status, state.token, router]);

  const activeScenario = SCENARIOS.find((s) => s.key === scenario)!;

  const submitLabel =
    scenario === "create-org" ? "Create Organization" :
    scenario === "join-org" ? "Join Organization" :
    "Create Account";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>⚡</div>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Choose how you want to get started</p>

        {/* Scenario tabs */}
        <div className={styles.tabs}>
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={scenario === s.key ? styles.tabActive : styles.tab}
              onClick={() => setScenario(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Scenario description */}
        <p className={styles.scenarioNote}>{activeScenario.note}</p>

        {state.status === "error" && state.message && (
          <div className={styles.formError}>{state.message}</div>
        )}

        <form action={formAction}>
          {/* Hidden field to communicate scenario */}
          <input type="hidden" name="scenario" value={scenario} />

          <PersonalFields styles={styles} errors={state.errors as Record<string, string> | undefined} />

          <hr className={styles.divider} />

          {/* Scenario-specific fields */}
          {scenario === "create-org" && (
            <div style={{ marginBottom: 16, textAlign: "left" }}>
              <label className={styles.label} htmlFor="tenantName">Organization Name</label>
              <Input
                id="tenantName"
                name="tenantName"
                placeholder="e.g. Acme Corp"
                className={styles.input}
                autoComplete="organization"
              />
              {state.errors?.tenantName && (
                <span className={styles.errorPill}>{state.errors.tenantName}</span>
              )}
            </div>
          )}

          {scenario === "join-org" && (
            <>
              <div style={{ marginBottom: 16, textAlign: "left" }}>
                <label className={styles.label} htmlFor="tenantId">Tenant ID</label>
                <Input
                  id="tenantId"
                  name="tenantId"
                  placeholder="e.g. acme-corp-123"
                  className={styles.input}
                />
                {state.errors?.tenantId && (
                  <span className={styles.errorPill}>{state.errors.tenantId}</span>
                )}
              </div>
              <div style={{ marginBottom: 16, textAlign: "left" }}>
                <label className={styles.label} htmlFor="role">Role</label>
                <Select
                  id="role"
                  placeholder="Select Role"
                  className={styles.select}
                  value={roleValue}
                  onChange={(value) => setRoleValue(value)}
                  popupMatchSelectWidth={false}
                  options={ROLE_OPTIONS}
                />
                <input type="hidden" name="role" value={roleValue} />
                {state.errors?.role && (
                  <span className={styles.errorPill}>{state.errors.role}</span>
                )}
              </div>
            </>
          )}

          <AuthButton label={submitLabel} />
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;