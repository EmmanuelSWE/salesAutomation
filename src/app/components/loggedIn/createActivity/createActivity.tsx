"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createActivity, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";
import { useUserState, useUserAction } from "../../../lib/providers/provider";

const ACTIVITY_TYPES = [
  ["Meeting",     "Meeting"],
  ["Call",        "Call"],
  ["Email",       "Email"],
  ["Task",        "Task"],
  ["Presentation","Presentation"],
  ["Other",       "Other"],
] as const;

const RELATED_TO_TYPES = [
  ["Client",      "Client"],
  ["Opportunity", "Opportunity"],
  ["Proposal",    "Proposal"],
  ["Contract",    "Contract"],
  ["Activity",    "Activity"],
] as const;

export default function CreateActivity() {
  const { styles } = useFormStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  const { users, isPending: usersPending } = useUserState();
  const { getUsers } = useUserAction();

  useEffect(() => {
    getUsers({ role: "SalesRep", isActive: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const salesReps = users ?? [];

  async function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setIsPending(true);
    try {
      await createActivity({
        type:          fd.get("type")          as string,
        subject:       fd.get("subject")       as string,
        description:   fd.get("description")   as string,
        priority:      fd.get("priority")      as string,
        dueDate:       fd.get("dueDate")       as string,
        assignedToId:  fd.get("assignedToId")  as string,
        relatedToType: fd.get("relatedToType") as string,
        relatedToId:   fd.get("relatedToId")   as string,
      });
      setState({ status: "success", message: "Activity created." });
      router.push("/activities");
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
        <h1 className={styles.formTitle}>Create Activity</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}
        {state.status === "error" && <div className={styles.errorBanner}>{state.message}</div>}

        <section className={styles.section}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="type">Type</label>
            <select id="type" name="type" className={styles.select} defaultValue=""
              style={state.errors?.type ? { borderColor: "#f44336" } : {}}>
              <option value="" disabled>Select type...</option>
              {ACTIVITY_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {state.errors?.type && <span className={styles.errorText}>{state.errors.type}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="subject">Subject</label>
            <input id="subject" name="subject" className={styles.input}
              style={state.errors?.subject ? { borderColor: "#f44336" } : {}} />
            {state.errors?.subject && <span className={styles.errorText}>{state.errors.subject}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="priority">Priority</label>
              <select id="priority" name="priority" className={styles.select} defaultValue="Medium">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dueDate">Due Date</label>
              <input id="dueDate" name="dueDate" type="date" className={styles.input}
                style={state.errors?.dueDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.dueDate && <span className={styles.errorText}>{state.errors.dueDate}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="assignedToId">Assigned To</label>
            <select id="assignedToId" name="assignedToId" className={styles.select} defaultValue="" disabled={usersPending}>
              {usersPending
                ? <option value="">Loading users...</option>
                : <>
                    <option value="">Unassigned</option>
                    {salesReps.map((u) => (
                      <option key={u.id} value={u.id ?? ""}>
                        {u.firstName} {u.lastName}
                      </option>
                    ))}
                  </>
              }
            </select>
          </div>

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
          <SubmitButton label="Create Activity" pendingLabel="Creating..." isPending={isPending} />
        </div>
      </form>
    </div>
  );
}
