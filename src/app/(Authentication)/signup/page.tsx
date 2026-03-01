'use client'

import { Input, Select } from "antd";
import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupStyles } from "../../components/signup/signup.module";
import { registerAction } from "../../lib/actions";
import { setToken } from "../../lib/utils/axiosInstance";
import Link from "next/link";
import { AuthButton } from "../../components/auth/authButton";

const ROLE_OPTIONS = [
  { value: "SalesRep",      label: "Sales Rep" },
  { value: "SalesManager",  label: "Sales Manager" },
  { value: "Admin",         label: "Admin" },
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
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(registerAction, { status: "idle" });

  // Pre-fill from invitation URL (?tenantId=xxx&role=yyy)
  // Fall back to the env-configured default org so staff always join the right tenant
  const envDefaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID ?? "";
  const urlTenantId        = searchParams.get("tenantId") ?? "";
  const inviteTenantId     = urlTenantId || envDefaultTenantId;
  const inviteRole         = searchParams.get("role") ?? "";
  const isInvite           = Boolean(urlTenantId);   // true only when from a real invite link
  const hasDefault         = !isInvite && Boolean(envDefaultTenantId); // env fallback, no URL

  const [scenario,    setScenario]   = useState<Scenario>((isInvite || hasDefault) ? "join-org" : "quickstart");
  const [roleValue,   setRoleValue]  = useState(inviteRole || "SalesRep");
  const [tenantIdVal, setTenantIdVal] = useState(inviteTenantId);

  // If page is loaded with invite / default params after hydration, ensure state is set
  useEffect(() => {
    if (inviteTenantId) {
      setScenario("join-org");
      setTenantIdVal(inviteTenantId);
    }
    if (inviteRole) setRoleValue(inviteRole);
  }, [inviteTenantId, inviteRole]);

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

        {/* Invitation banner */}
        {isInvite ? (
          <div style={{
            background: "rgba(245,166,35,0.1)",
            border: "1px solid rgba(245,166,35,0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            color: "#f5a623",
            textAlign: "left",
          }}>
            🎉 You have been invited to join an organisation as <strong>{inviteRole || "a team member"}</strong>. Your details are pre-filled below.
          </div>
        ) : hasDefault ? (
          <div style={{
            background: "rgba(82,196,26,0.08)",
            border: "1px solid rgba(82,196,26,0.3)",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 16,
            fontSize: 13,
            color: "#52c41a",
            textAlign: "left",
          }}>
            🏢 The organisation ID has been pre-filled. Complete the form below to join.
          </div>
        ) : (
          <p className={styles.subtitle}>Choose how you want to get started</p>
        )}

        {/* Scenario tabs — hide when coming from an invite link or when default org is set */}
        {!isInvite && !hasDefault && (
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
        )}

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
                  value={tenantIdVal}
                  onChange={(e) => setTenantIdVal(e.target.value)}
                  readOnly={isInvite}
                  style={isInvite ? { opacity: 0.7, cursor: "not-allowed" } : {}}
                />
                {isInvite && (
                  <span style={{ fontSize: 11, color: "#666" }}>Pre-filled from your invitation link</span>
                )}
                {hasDefault && (
                  <span style={{ fontSize: 11, color: "#52c41a" }}>Default organisation — you can change this if needed</span>
                )}
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
                  disabled={isInvite}
                />
                <input type="hidden" name="role" value={roleValue} />
                {isInvite && (
                  <span style={{ fontSize: 11, color: "#666" }}>Pre-filled from your invitation link</span>
                )}
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

function getSubmitLabel(scenario: "quickstart" | "create-org" | "join-org"): string {
  if (scenario === "create-org") return "Create Organization";
  if (scenario === "join-org")   return "Join Organization";
  return "Create Account";
}

export default Signup;
