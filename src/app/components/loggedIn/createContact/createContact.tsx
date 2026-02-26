"use client";
import { useActionState } from "react";
import { createContactAction, type FormState } from "../../../lib/providers/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

const initial: FormState = { status: "idle" };

export default function CreateContact() {
  const { styles } = useFormStyles();
  const [state, formAction] = useActionState(createContactAction, initial);
  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.formTitle}>Create Contact</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Linked Client</h2>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientId">Client ID</label>
            <input id="clientId" name="clientId" className={styles.input} placeholder="Client UUID"
              style={state.errors?.clientId ? { borderColor: "#f44336" } : {}} />
            {state.errors?.clientId && <span className={styles.errorText}>{state.errors.clientId}</span>}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Info</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">First Name</label>
              <input id="firstName" name="firstName" className={styles.input}
                style={state.errors?.firstName ? { borderColor: "#f44336" } : {}} />
              {state.errors?.firstName && <span className={styles.errorText}>{state.errors.firstName}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Last Name</label>
              <input id="lastName" name="lastName" className={styles.input}
                style={state.errors?.lastName ? { borderColor: "#f44336" } : {}} />
              {state.errors?.lastName && <span className={styles.errorText}>{state.errors.lastName}</span>}
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className={styles.input} placeholder="jane@acme.com"
              style={state.errors?.email ? { borderColor: "#f44336" } : {}} />
            {state.errors?.email && <span className={styles.errorText}>{state.errors.email}</span>}
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phoneNumber">Phone Number</label>
              <input id="phoneNumber" name="phoneNumber" type="tel" className={styles.input} placeholder="+27 11 123 4567" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="position">Position</label>
              <input id="position" name="position" className={styles.input} placeholder="Procurement Manager" />
            </div>
          </div>
          <label className={styles.toggle}>
            <input type="checkbox" name="isPrimaryContact" value="true" className={styles.checkbox} />
            Set as primary contact
          </label>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Contact" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}