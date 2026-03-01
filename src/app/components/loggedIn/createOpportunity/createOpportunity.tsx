"use client";
import { useActionState, useEffect, useState } from "react";
import { createOpportunityAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";
import { useUserState, useUserAction, useContactState, useContactAction } from "../../../lib/providers/provider";

const initial: FormState = { status: "idle" };
const STAGES    = [["1","Prospecting"],["2","Qualification"],["3","Proposal"],["4","Negotiation"],["5","Closed Won"],["6","Closed Lost"]];
const SOURCES   = [["1","Cold Call"],["2","Email"],["3","Referral"],["4","Website"],["5","Event"],["6","Other"]];
const CURRENCIES = ["ZAR","USD","EUR","GBP"];

interface Props { clientId: string; }

export default function CreateOpportunity({ clientId }: Readonly<Props>) {
  const { styles } = useFormStyles();
  const [token, setToken] = useState("");
  const [state, formAction] = useActionState(createOpportunityAction, initial);

  const { users, isPending: usersPending } = useUserState();
  const { getUsers } = useUserAction();

  const { contacts, isPending: contactsPending } = useContactState();
  const { getContactsByClient } = useContactAction();

  useEffect(() => {
    setToken(localStorage.getItem("auth_token") ?? "");
    getUsers({ role: "SalesRep", isActive: true });
    getContactsByClient(clientId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const salesReps = users ?? [];
  const primaryContact = (contacts ?? []).find((c) => c.isPrimaryContact);

  function renderPrimaryContact() {
    if (contactsPending) {
      return <div className={styles.input} style={{ background: "#f5f5f5", color: "#aaa", cursor: "not-allowed" }}>Loading…</div>;
    }
    if (primaryContact) {
      return (
        <div className={styles.input} style={{ background: "#f5f5f5", color: "#555", cursor: "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12 }}>🔒</span>
          <span>{primaryContact.firstName} {primaryContact.lastName}</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa" }}>{primaryContact.email}</span>
        </div>
      );
    }
    return (
      <div className={styles.input} style={{ background: "#fff8e1", color: "#b26a00", cursor: "not-allowed", fontSize: 13 }}>
        ⚠ No primary contact on file for this client
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="_token" value={token} />
        <input type="hidden" name="clientId" value={clientId} />
        <input type="hidden" name="contactId" value={primaryContact?.id ?? ""} />
        <h1 className={styles.formTitle}>Create Opportunity</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input id="title" name="title" className={styles.input} placeholder="Big Deal"
              style={state.errors?.title ? { borderColor: "#f44336" } : {}} />
            {state.errors?.title && <span className={styles.errorText}>{state.errors.title}</span>}
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <span className={styles.label}>Client</span>
              <div className={styles.input} style={{ background: "#f5f5f5", color: "#888", cursor: "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12 }}>🔒</span>
                <span style={{ fontFamily: "monospace", fontSize: 12 }}>{clientId}</span>
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Primary Contact</span>
              {renderPrimaryContact()}
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} placeholder="Initial engagement from referral" />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Financials</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="estimatedValue">Estimated Value</label>
              <input id="estimatedValue" name="estimatedValue" type="number" min="0" className={styles.input} placeholder="50000"
                style={state.errors?.estimatedValue ? { borderColor: "#f44336" } : {}} />
              {state.errors?.estimatedValue && <span className={styles.errorText}>{state.errors.estimatedValue}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currency">Currency</label>
              <select id="currency" name="currency" className={styles.select} defaultValue="ZAR">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="probability">Probability (%)</label>
              <input id="probability" name="probability" type="number" min="0" max="100" className={styles.input} placeholder="30" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="expectedCloseDate">Expected Close Date</label>
              <input id="expectedCloseDate" name="expectedCloseDate" type="date" className={styles.input}
                style={state.errors?.expectedCloseDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.expectedCloseDate && <span className={styles.errorText}>{state.errors.expectedCloseDate}</span>}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pipeline</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="stage">Stage</label>
              <select id="stage" name="stage" className={styles.select} defaultValue=""
                style={state.errors?.stage ? { borderColor: "#f44336" } : {}}>
                <option value="" disabled>Select stage…</option>
                {STAGES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              {state.errors?.stage && <span className={styles.errorText}>{state.errors.stage}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="source">Source</label>
              <select id="source" name="source" className={styles.select} defaultValue="">
                <option value="" disabled>Select source…</option>
                {SOURCES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Owner (SalesRep) */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ownerId">Owner</label>
            <select id="ownerId" name="ownerId" className={styles.select} defaultValue="" disabled={usersPending}>
              {usersPending
                ? <option value="">Loading users…</option>
                : <>
                    <option value="">Unassigned</option>
                    {salesReps.map((u) => (
                      <option key={u.id} value={u.id ?? ""}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </>
              }
            </select>
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Opportunity" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}