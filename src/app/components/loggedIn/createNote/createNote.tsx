"use client";
import { useState, useRef } from "react";
import { createNote, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

export default function CreateNote() {
  const { styles } = useFormStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setIsPending(true);
    try {
      await createNote({
        content:       fd.get("content")       as string,
        relatedToType: fd.get("relatedToType") as string,
        relatedToId:   fd.get("relatedToId")   as string,
        isPrivate:     fd.get("isPrivate") === "true",
      });
      setState({ status: "success", message: "Note created." });
    } catch (err) {
      setState({ status: "error", message: extractApiMessage(err) });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
        <h1 className={styles.formTitle}>Create Note</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}
        {state.status === "error" && <div className={styles.errorBanner}>{state.message}</div>}

        <section className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="relatedToId">Related To (ID)</label>
            <input id="relatedToId" name="relatedToId" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="content">Content</label>
            <textarea id="content" name="content" className={styles.textarea} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="authorId">Author ID</label>
            <input id="authorId" name="authorId" className={styles.input} />
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Note" pendingLabel="Creating..." isPending={isPending} />
        </div>
      </form>
    </div>
  );
}
