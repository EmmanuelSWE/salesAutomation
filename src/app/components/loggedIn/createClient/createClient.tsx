"use client";

import { useActionState, useEffect, useState } from "react";
import { createClientAction, type FormState } from "../../../lib/actions";
import { CreateClientSubmitButton } from "./submitButton/submitButton";
import { useCreateClientStyles } from "./createClient.module";

const initialState: FormState = { status: "idle" };

const CLIENT_TYPES = [
  { value: "1", label: "Direct"     },
  { value: "2", label: "Partner"    },
  { value: "3", label: "Reseller"   },
  { value: "4", label: "Enterprise" },
];

const COMPANY_SIZES = [
  { value: "1-10",      label: "1–10"      },
  { value: "11-50",     label: "11–50"     },
  { value: "50-100",    label: "50–100"    },
  { value: "101-500",   label: "101–500"   },
  { value: "500+",      label: "500+"      },
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Retail",
  "Manufacturing", "Education", "Legal", "Other",
];

const CreateClient =()=> {
  const { styles } = useCreateClientStyles();
  const [token, setToken] = useState("");
  const [state, formAction] = useActionState(createClientAction, initialState);

  useEffect(() => {
    setToken(localStorage.getItem("auth_token") ?? "");
  }, []);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="_token" value={token} />
        <h1 className={styles.formTitle}>Create New Client</h1>

        {/* ── Success banner ── */}
        {state.status === "success" && (
          <div className={styles.successBanner}>{state.message}</div>
        )}

        {/* ══════════════════════════════
            SECTION 1 — Company Details
        ══════════════════════════════ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Company Details</h2>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Company Name</label>
            <input
              id="name"
              name="name"
              className={styles.input}
              placeholder="e.g. Acme Corp"
              style={state.errors?.name ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.name && (
              <span className={styles.errorText}>{state.errors.name}</span>
            )}
          </div>

          {/* Industry */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="industry">Industry</label>
            <select
              id="industry"
              name="industry"
              className={styles.select}
              style={state.errors?.industry ? { borderColor: "#f44336" } : {}}
              defaultValue=""
            >
              <option value="" disabled>Select industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            {state.errors?.industry && (
              <span className={styles.errorText}>{state.errors.industry}</span>
            )}
          </div>

          {/* Client Type + Company Size — 2 col */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="clientType">Client Type</label>
              <select
                id="clientType"
                name="clientType"
                className={styles.select}
                style={state.errors?.clientType ? { borderColor: "#f44336" } : {}}
                defaultValue=""
              >
                <option value="" disabled>Select type…</option>
                {CLIENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {state.errors?.clientType && (
                <span className={styles.errorText}>{state.errors.clientType}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="companySize">Company Size</label>
              <select
                id="companySize"
                name="companySize"
                className={styles.select}
                defaultValue=""
              >
                <option value="" disabled>Select size…</option>
                {COMPANY_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            SECTION 2 — Contact & Web
        ══════════════════════════════ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact & Web</h2>

          {/* Website */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="url"
              className={styles.input}
              placeholder="https://acme.com"
              style={state.errors?.website ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.website && (
              <span className={styles.errorText}>{state.errors.website}</span>
            )}
          </div>

          {/* Billing Address */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="billingAddress">Billing Address</label>
            <input
              id="billingAddress"
              name="billingAddress"
              className={styles.input}
              placeholder="123 Main St, City, Country"
              style={state.errors?.billingAddress ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.billingAddress && (
              <span className={styles.errorText}>{state.errors.billingAddress}</span>
            )}
          </div>
        </section>

        {/* ══════════════════════════════
            SECTION 3 — Financial Info
        ══════════════════════════════ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Financial Info</h2>

          {/* Tax Number */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="taxNumber">Tax Number</label>
            <input
              id="taxNumber"
              name="taxNumber"
              className={styles.input}
              placeholder="1234567890"
            />
          </div>
        </section>

        {/* Submit */}
        <div className={styles.submitRow}>
          <CreateClientSubmitButton />
        </div>
      </form>
    </div>
  );
}


export default CreateClient;