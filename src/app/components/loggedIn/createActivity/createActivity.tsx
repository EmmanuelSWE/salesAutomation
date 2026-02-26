"use client";
import { useActionState } from "react";
import { createActivityAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";

const initial: FormState = { status: "idle" };

export default function CreateActivity() {
  const { styles } = useFormStyles();
  const [state, formAction] = useActionState(createActivityAction, initial);

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <h1 className={styles.formTitle}>Create Activity</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        <section className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="type">Type</label>
            <input id="type" name="type" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="subject">Subject</label>
            <input id="subject" name="subject" className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} />
          </div>
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
              <label className={styles.label} htmlFor="dueDate">Due Date</label>
              <input id="dueDate" name="dueDate" type="date" className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="assignedToId">Assigned To (User ID)</label>
            <input id="assignedToId" name="assignedToId" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="relatedToType">Related To (type/id)</label>
            <input id="relatedToType" name="relatedToType" className={styles.input} placeholder="e.g. client:UUID or opportunity:UUID" />
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Activity" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
