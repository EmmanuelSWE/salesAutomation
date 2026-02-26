"use client";
import { useActionState } from "react";
import { createNoteAction, type FormState } from "../../../lib/providers/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

const initial: FormState = { status: "idle" };

export default function CreateNote() {
  const { styles } = useFormStyles();
  const [state, formAction] = useActionState(createNoteAction, initial);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.formTitle}>Create Note</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

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
          <SubmitButton label="Create Note" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
