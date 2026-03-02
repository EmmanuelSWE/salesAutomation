"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createRenewal, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

interface Props { contractId?: string; clientId?: string; }

export default function CreateRenewal({ contractId, clientId }: Readonly<Props>) {
  const { styles } = useFormStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    if (!formRef.current || !contractId) return;
    const fd = new FormData(formRef.current);
    setIsPending(true);
    try {
      await createRenewal(contractId, {
        renewalOpportunityId: fd.get("renewalOpportunityId") as string || undefined,
        notes:                fd.get("notes")                as string || undefined,
      });
      setState({ status: "success", message: "Renewal created." });
      if (clientId) { router.push(`/Client/${clientId}`); router.refresh(); }
    } catch (err) {
      setState({ status: "error", message: extractApiMessage(err) });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
        <h1 className={styles.formTitle}>Create Renewal</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}
        {state.status === "error" && <div className={styles.errorBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Renewal Details</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="renewalOpportunityId">
              Link to Opportunity <span style={{ color: "#666", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              id="renewalOpportunityId"
              name="renewalOpportunityId"
              className={styles.input}
              placeholder="Opportunity ID"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="notes">
              Notes <span style={{ color: "#666", fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea id="notes" name="notes" className={styles.textarea} placeholder="e.g. Annual CPI adjustment of 8%" />
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Renewal" pendingLabel="Creating..." isPending={isPending} />
        </div>
      </form>
    </div>
  );
}
