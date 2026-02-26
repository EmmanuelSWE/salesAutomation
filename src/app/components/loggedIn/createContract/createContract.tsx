"use client";
import { useActionState } from "react";
import { createContractAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

const initial: FormState = { status: "idle" };

export default function CreateContract() {
  const { styles } = useFormStyles();
  const [state, formAction] = useActionState(createContractAction, initial);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.formTitle}>Create Contract</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>References</h2>
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
            <label className={styles.label} htmlFor="proposalId">Proposal ID</label>
            <input id="proposalId" name="proposalId" className={styles.input} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contract Details</h2>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input id="title" name="title" className={styles.input}
              style={state.errors?.title ? { borderColor: "#f44336" } : {}} />
            {state.errors?.title && <span className={styles.errorText}>{state.errors.title}</span>}
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contractValue">Contract Value</label>
              <input id="contractValue" name="contractValue" type="number" min="0" className={styles.input}
                style={state.errors?.contractValue ? { borderColor: "#f44336" } : {}} />
              {state.errors?.contractValue && <span className={styles.errorText}>{state.errors.contractValue}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currency">Currency</label>
              <select id="currency" name="currency" className={styles.select} defaultValue="ZAR">
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="startDate">Start Date</label>
              <input id="startDate" name="startDate" type="date" className={styles.input}
                style={state.errors?.startDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.startDate && <span className={styles.errorText}>{state.errors.startDate}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="endDate">End Date</label>
              <input id="endDate" name="endDate" type="date" className={styles.input}
                style={state.errors?.endDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.endDate && <span className={styles.errorText}>{state.errors.endDate}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="terms">Terms</label>
            <textarea id="terms" name="terms" className={styles.textarea} />
          </div>

          <label className={styles.toggle}>
            <input type="checkbox" name="autoRenew" value="true" className={styles.checkbox} />
            Auto renew
          </label>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Contract" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
