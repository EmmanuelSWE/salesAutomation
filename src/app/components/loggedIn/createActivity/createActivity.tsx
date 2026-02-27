"use client";
import { useActionState, useEffect, useState } from "react";
import { createActivityAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";
import { useUserState, useUserAction } from "../../../lib/providers/provider";

const initial: FormState = { status: "idle" };

const ACTIVITY_TYPES = [
  ["1", "Meeting"],
  ["2", "Call"],
  ["3", "Email"],
  ["4", "Task"],
  ["5", "Presentation"],
  ["6", "Other"],
] as const;

const RELATED_TO_TYPES = [
  ["1", "Client"],
  ["2", "Opportunity"],
  ["3", "Proposal"],
  ["4", "Contract"],
  ["5", "Activity"],
] as const;

export default function CreateActivity() {
  const { styles } = useFormStyles();
  const [token, setToken] = useState("");
  const [state, formAction] = useActionState(createActivityAction, initial);

  const { users }      = useUserState();
  const { getUsers }   = useUserAction();

  useEffect(() => {
    setToken(localStorage.getItem("auth_token") ?? "");
    getUsers({ role: "SalesRep", isActive: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const salesReps = users ?? [];

  return (
    <div className={styles.page}>
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="_token" value={token} />
        <h1 className={styles.formTitle}>Create Activity</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}

        <section className={styles.section}>
          {/* Type */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="type">Type</label>
            <select id="type" name="type" className={styles.select} defaultValue=""
              style={state.errors?.type ? { borderColor: "#f44336" } : {}}>
              <option value="" disabled>Select type…</option>
              {ACTIVITY_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {state.errors?.type && <span className={styles.errorText}>{state.errors.type}</span>}
          </div>

          {/* Subject */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="subject">Subject</label>
            <input id="subject" name="subject" className={styles.input}
              style={state.errors?.subject ? { borderColor: "#f44336" } : {}} />
            {state.errors?.subject && <span className={styles.errorText}>{state.errors.subject}</span>}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} />
          </div>

          {/* Priority + Due Date */}
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
              <input id="dueDate" name="dueDate" type="date" className={styles.input}
                style={state.errors?.dueDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.dueDate && <span className={styles.errorText}>{state.errors.dueDate}</span>}
            </div>
          </div>

          {/* Assigned To — SalesRep dropdown */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="assignedToId">Assigned To</label>
            <select id="assignedToId" name="assignedToId" className={styles.select} defaultValue="">
              <option value="">Unassigned</option>
              {salesReps.map((u) => (
                <option key={u.id} value={u.id ?? ""}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Related To — type + id */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="relatedToType">Related To (type)</label>
              <select id="relatedToType" name="relatedToType" className={styles.select} defaultValue="">
                <option value="">None</option>
                {RELATED_TO_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="relatedToId">Related To (ID)</label>
              <input id="relatedToId" name="relatedToId" className={styles.input} placeholder="UUID" />
            </div>
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Activity" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
