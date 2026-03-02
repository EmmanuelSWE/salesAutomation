'use client'

import { Input, Select } from "antd";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignupStyles } from "../../components/signup/signup.module";
import { registerUser, extractApiMessage } from "../../lib/utils/apiMutations";
import { setToken } from "../../lib/utils/axiosInstance";
import Link from "next/link";
import { AuthButton } from "../../components/auth/authButton";

const ROLE_OPTIONS = [
  { value: "SalesRep",     label: "Sales Rep" },
  { value: "SalesManager", label: "Sales Manager" },
  { value: "Admin",        label: "Admin" },
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
    </div>
    <div style={{ marginBottom: 16, textAlign: "left" }}>
      <label className={styles.label} htmlFor="password">Password</label>
      <Input.Password id="password" name="password" placeholder="password" className={styles.input} autoComplete="new-password" />
      {errors?.password && <span className={styles.errorPill}>{errors.password}</span>}
    </div>
    <div style={{ marginBottom: 20, textAlign: "left" }}>
      <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
      <Input.Password id="confirmPassword" name="confirmPassword" placeholder="password" className={styles.input} autoComplete="new-password" />
      {errors?.confirmPassword && <span className={styles.errorPill}>{errors.confirmPassword}</span>}
    </div>
  </>
);

const SignupInner = () => {
  const { styles } = useSignupStyles();
  const router = useRouter();
  const searchParams = useSearchParams();

  const envDefaultTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID ?? "";
  const urlTenantId        = searchParams.get("tenantId") ?? "";
  const inviteTenantId     = urlTenantId || envDefaultTenantId;
  const inviteRole         = searchParams.get("role") ?? "";
  const isInvite           = Boolean(urlTenantId);
  const hasDefault         = !isInvite && Boolean(envDefaultTenantId);

  const [scenario,    setScenario]    = useState<Scenario>((isInvite || hasDefault) ? "join-org" : "quickstart");
  const [roleValue,   setRoleValue]   = useState(inviteRole || "SalesRep");
  const [tenantIdVal, setTenantIdVal] = useState(inviteTenantId);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError,    setApiError]    = useState("");
  const [isPending,   setIsPending]   = useState(false);

  useEffect(() => {
    if (inviteTenantId) { setScenario("join-org"); setTenantIdVal(inviteTenantId); }
    if (inviteRole) setRoleValue(inviteRole);
  }, [inviteTenantId, inviteRole]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const firstName       = (fd.get("firstName")       as string) || "";
    const lastName        = (fd.get("lastName")        as string) || "";
    const email           = (fd.get("email")           as string) || "";
    const password        = (fd.get("password")        as string) || "";
    const confirmPassword = (fd.get("confirmPassword") as string) || "";

    const errs: Record<string, string> = {};
    if (!firstName.trim())  errs.firstName = "First name is required.";
    if (!lastName.trim())   errs.lastName  = "Last name is required.";
    if (!email.trim())      errs.email     = "Email is required.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email.";
    if (!password.trim())   errs.password  = "Password is required.";
    if (password && password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    const payload: Record<string, unknown> = {
      firstName: firstName.trim(), lastName: lastName.trim(),
      email: email.trim(), password,
    };
    if (scenario === "create-org") {
      const tenantName = (fd.get("tenantName") as string)?.trim();
      if (tenantName) payload.tenantName = tenantName;
    }
    if (scenario === "join-org") {
      if (tenantIdVal.trim()) payload.tenantId = tenantIdVal.trim();
      payload.role = roleValue;
    }

    setIsPending(true);
    setApiError("");
    setFieldErrors({});
    try {
      const res = await registerUser(payload);
      if (res.data.token) setToken(res.data.token);
      router.push("/login");
    } catch (err) {
      setApiError(extractApiMessage(err) || "Registration failed.");
    } finally {
      setIsPending(false);
    }
  }

  const activeScenario = SCENARIOS.find((s) => s.key === scenario)!;
  const submitLabel = scenario === "create-org" ? "Create Organization" :
                      scenario === "join-org"   ? "Join Organization"   : "Create Account";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>&#9889;</div>
        <h1 className={styles.title}>Create Account</h1>

        {isInvite ? (
          <div style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#f5a623", textAlign: "left" }}>
            You have been invited to join an organisation as <strong>{inviteRole || "a team member"}</strong>. Your details are pre-filled below.
          </div>
        ) : hasDefault ? (
          <div style={{ background: "rgba(82,196,26,0.08)", border: "1px solid rgba(82,196,26,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#52c41a", textAlign: "left" }}>
            The organisation ID has been pre-filled. Complete the form below to join.
          </div>
        ) : (
          <p className={styles.subtitle}>Choose how you want to get started</p>
        )}

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

        <p className={styles.scenarioNote}>{activeScenario.note}</p>

        {apiError && <div className={styles.formError}>{apiError}</div>}

        <form onSubmit={handleSubmit}>
          <PersonalFields styles={styles} errors={fieldErrors} />

          <hr className={styles.divider} />

          {scenario === "create-org" && (
            <div style={{ marginBottom: 16, textAlign: "left" }}>
              <label className={styles.label} htmlFor="tenantName">Organization Name</label>
              <Input id="tenantName" name="tenantName" placeholder="e.g. Acme Corp" className={styles.input} autoComplete="organization" />
              {fieldErrors.tenantName && <span className={styles.errorPill}>{fieldErrors.tenantName}</span>}
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
                {isInvite && <span style={{ fontSize: 11, color: "#666" }}>Pre-filled from your invitation link</span>}
                {hasDefault && <span style={{ fontSize: 11, color: "#52c41a" }}>Default organisation</span>}
                {fieldErrors.tenantId && <span className={styles.errorPill}>{fieldErrors.tenantId}</span>}
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
                {isInvite && <span style={{ fontSize: 11, color: "#666" }}>Pre-filled from your invitation link</span>}
                {fieldErrors.role && <span className={styles.errorPill}>{fieldErrors.role}</span>}
              </div>
            </>
          )}

          <AuthButton label={isPending ? "Processing..." : submitLabel} isPending={isPending} />
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

const Signup = () => (
  <Suspense>
    <SignupInner />
  </Suspense>
);

export default Signup;
