"use client";
import { useActionState, useEffect, useState } from "react";
import { createRenewalAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

interface Props { contractId?: string }

const initial: FormState = { status: "idle" };

export default function CreateRenewal({ contractId }: Readonly<Props>) {
  const { styles } = useFormStyles();
  const [token, setToken] = useState("");
  const [state, formAction] = useActionState(createRenewalAction, initial);

  useEffect(() => { setToken(localStorage.getItem("auth_token") ?? ""); }, []);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="_token" value={token} />
        <h1 className={styles.formTitle}>Create Renewal</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        {contractId && <input type="hidden" name="contractId" value={contractId} />}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Renewal Dates</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="proposedStartDate">Proposed Start Date</label>
              <input id="proposedStartDate" name="proposedStartDate" type="date" className={styles.input}
                style={state.errors?.proposedStartDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.proposedStartDate && <span className={styles.errorText}>{state.errors.proposedStartDate}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="proposedEndDate">Proposed End Date</label>
              <input id="proposedEndDate" name="proposedEndDate" type="date" className={styles.input}
                style={state.errors?.proposedEndDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.proposedEndDate && <span className={styles.errorText}>{state.errors.proposedEndDate}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="proposedValue">Proposed Value</label>
            <input id="proposedValue" name="proposedValue" type="number" className={styles.input}
              style={state.errors?.proposedValue ? { borderColor: "#f44336" } : {}} />
            {state.errors?.proposedValue && <span className={styles.errorText}>{state.errors.proposedValue}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" className={styles.textarea} />
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Renewal" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
