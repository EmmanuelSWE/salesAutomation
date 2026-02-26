"use client";

import { useActionState } from "react";
import { createPricingRequestAction, type FormState } from "../../../lib/providers/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

const initial: FormState = { status: "idle" };

export default function CreatePricingRequest() {
  const { styles } = useFormStyles();
  const [state, formAction] = useActionState(createPricingRequestAction, initial);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.formTitle}>Create Pricing Request</h1>

        {state.status === "success" && (
          <div className={styles.successBanner}>{state.message}</div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input id="title" name="title" className={styles.input}
              style={state.errors?.title ? { borderColor: "#f44336" } : {}} />
            {state.errors?.title && <span className={styles.errorText}>{state.errors.title}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Links</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientId">Client ID</label>
            <input id="clientId" name="clientId" className={styles.input}
              style={state.errors?.clientId ? { borderColor: "#f44336" } : {}} />
            {state.errors?.clientId && <span className={styles.errorText}>{state.errors.clientId}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="opportunityId">Opportunity ID</label>
            <input id="opportunityId" name="opportunityId" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="requestedById">Requested By (User ID)</label>
            <input id="requestedById" name="requestedById" className={styles.input} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Scheduling & Priority</h2>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="priority">Priority</label>
              <select id="priority" name="priority" className={styles.select} defaultValue="3">
                <option value="1">1 — Low</option>
                <option value="2">2</option>
                <option value="3">3 — Normal</option>
                <option value="4">4</option>
                <option value="5">5 — High</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="requiredByDate">Required By</label>
              <input id="requiredByDate" name="requiredByDate" type="date" className={styles.input}
                style={state.errors?.requiredByDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.requiredByDate && <span className={styles.errorText}>{state.errors.requiredByDate}</span>}
            </div>
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Pricing Request" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
