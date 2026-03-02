"use client";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createContact, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { SubmitButton } from "../form/submitButton";
import { useCreateClientStyles } from "../createClient/createClient.module";

export default function CreateContact() {
  const { styles } = useCreateClientStyles();
  const params = useParams();
  const clientId = (params?.id as string) ?? "";
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setIsPending(true);
    try {
      await createContact({
        clientId,
        firstName:        fd.get("firstName")        as string,
        lastName:         fd.get("lastName")         as string,
        email:            fd.get("email")            as string,
        phoneNumber:      fd.get("phoneNumber")      as string,
        position:         fd.get("position")         as string,
        isPrimaryContact: fd.get("isPrimaryContact") === "true",
      });
      setState({ status: "success", message: "Contact created." });
      router.push(`/Client/${clientId}/clientOverView`);
      router.refresh();
    } catch (err) {
      setState({ status: "error", message: extractApiMessage(err) });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
        <h1 className={styles.formTitle}>Create Contact</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}
        {state.status === "error" && <div className={styles.errorBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Linked Client</h2>
          <div className={styles.field}>
            <span className={styles.label}>Client</span>
            <div className={styles.input} style={{ background: "#f5f5f5", color: "#555", cursor: "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12 }}>&#128274;</span>
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
          <SubmitButton label="Create Contact" pendingLabel="Creating..." isPending={isPending} />
        </div>
      </form>
    </div>
  );
}
