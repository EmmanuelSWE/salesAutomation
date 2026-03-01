"use client";
import { useActionState, useRef, useTransition } from "react";
import { useParams } from "next/navigation";
import { createContactAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useCreateClientStyles } from "../createClient/createClient.module";

const initial: FormState = { status: "idle" };

export default function CreateContact() {
  const { styles } = useCreateClientStyles();
  const params = useParams();
  const clientId = (params?.id as string) ?? "";
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const [state, formAction] = useActionState(createContactAction, initial);

  function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("_token",   localStorage.getItem("auth_token") ?? "");
    fd.set("clientId", clientId);
    startTransition(() => formAction(fd));
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
        <h1 className={styles.formTitle}>Create Contact</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Linked Client</h2>
          <div className={styles.field}>
            <span className={styles.label}>Client</span>
            <div className={styles.input} style={{ background: "#f5f5f5", color: "#555", cursor: "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>🔒</span>
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>{clientId}</span>
            </div>
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
            {" "}Set as primary contact
          </label>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Contact" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}