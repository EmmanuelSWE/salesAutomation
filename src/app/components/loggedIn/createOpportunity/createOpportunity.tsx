"use client";
import { useActionState } from "react";
import { createOpportunityAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

const initial: FormState = { status: "idle" };
const STAGES    = [["1","Prospecting"],["2","Qualification"],["3","Proposal"],["4","Negotiation"],["5","Closed Won"],["6","Closed Lost"]];
const SOURCES   = [["1","Cold Call"],["2","Email"],["3","Referral"],["4","Website"],["5","Event"],["6","Other"]];
const CURRENCIES = ["ZAR","USD","EUR","GBP"];

export default function CreateOpportunity() {
  const { styles } = useFormStyles();
  const [state, formAction] = useActionState(createOpportunityAction, initial);
  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
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
              <label className={styles.label} htmlFor="clientId">Client ID</label>
              <input id="clientId" name="clientId" className={styles.input}
                style={state.errors?.clientId ? { borderColor: "#f44336" } : {}} />
              {state.errors?.clientId && <span className={styles.errorText}>{state.errors.clientId}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contactId">Contact ID</label>
              <input id="contactId" name="contactId" className={styles.input} />
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
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Opportunity" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}