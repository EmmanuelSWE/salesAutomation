"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { createPricingRequestAction, type FormState } from "../../../lib/actions";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";
import { useUserState, useUserAction, useClientState, useClientAction } from "../../../lib/providers/provider";

const initial: FormState = { status: "idle" };

export default function CreatePricingRequest() {
  const { styles } = useFormStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const [state, formAction] = useActionState(createPricingRequestAction, initial);

  const { users, isPending: usersPending } = useUserState();
  const { getUsers } = useUserAction();
  const { clients, isPending: clientsPending } = useClientState();
  const { getClients } = useClientAction();

  useEffect(() => {
    getUsers({ isActive: true });
    getClients({ pageSize: 200 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeUsers = users ?? [];
  const activeClients = clients ?? [];

  function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("_token", localStorage.getItem("auth_token") ?? "");
    startTransition(() => formAction(fd));
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
        <h1 className={styles.formTitle}>Create Pricing Request</h1>

        {state.status === "success" && (
          <div className={styles.successBanner}>{state.message}</div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input id="title" name="title" className={styles.input}
              style={state.errors?.title ? { borderColor: "#f44336" } : {}} />
            {state.errors?.title && <span className={styles.errorText}>{state.errors.title}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Links</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientId">Client</label>
            <select
              id="clientId"
              name="clientId"
              className={styles.select}
              defaultValue=""
              disabled={clientsPending}
              style={state.errors?.clientId ? { borderColor: "#f44336" } : {}}
            >
              {clientsPending
                ? <option value="">Loading clients…</option>
                : <>
                    <option value="">Select client…</option>
                    {activeClients.map((c) => (
                      <option key={c.id} value={c.id ?? ""}>{c.name}</option>
                    ))}
                  </>
              }
            </select>
            {state.errors?.clientId && <span className={styles.errorText}>{state.errors.clientId}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="opportunityId">Opportunity ID <span style={{ color: "#666", fontWeight: 400 }}>(optional)</span></label>
            <input id="opportunityId" name="opportunityId" className={styles.input} placeholder="Paste opportunity UUID if linked…" />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="requestedById">Requested By</label>
            <select id="requestedById" name="requestedById" className={styles.select} defaultValue="" disabled={usersPending}>
              {usersPending
                ? <option value="">Loading users…</option>
                : <>
                    <option value="">Select requester…</option>
                    {activeUsers.map((u) => (
                      <option key={u.id} value={u.id ?? ""}>
                        {u.firstName} {u.lastName} ({u.role ?? "User"})
                      </option>
                    ))}
                  </>
              }
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Scheduling & Priority</h2>

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
              <label className={styles.label} htmlFor="requiredByDate">Required By</label>
              <input id="requiredByDate" name="requiredByDate" type="date" className={styles.input}
                style={state.errors?.requiredByDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.requiredByDate && <span className={styles.errorText}>{state.errors.requiredByDate}</span>}
            </div>
          </div>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Pricing Request" pendingLabel="Creating…" />
        </div>
      </form>
    </div>
  );
}
