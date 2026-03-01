"use client";

import { useActionState, useRef, useTransition } from "react";
import { submitProposalAction, type ProposalFormState } from "../../../lib/actions";
import { ScopeItems }   from "../../dashboard/scopeItems/scopeItems";
import { SubmitButton } from "../submitButton/submitButton";
import { useSubmitProposalStyles } from "./submitProposal.module";
import { useUserState } from "../../../lib/providers/provider";

const initialState: ProposalFormState = { status: "idle" };

interface SubmitProposalProps {
  prefillClientId?:   string;
  prefillClientName?: string;
  prefillOpportunityId?: string;
}

const SubmitProposal = ({ prefillClientId, prefillClientName, prefillOpportunityId }: Readonly<SubmitProposalProps> = {}) => {
  const { styles } = useSubmitProposalStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();
  const [state, formAction] = useActionState(submitProposalAction, initialState);
  const { user } = useUserState();

  const requesterName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("_token",        localStorage.getItem("auth_token") ?? "");
    fd.set("clientId",      prefillClientId ?? "");
    fd.set("requestedById", user?.id ?? "");
    if (prefillOpportunityId) fd.set("opportunityId", prefillOpportunityId);
    startTransition(() => formAction(fd));
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form} encType="multipart/form-data">
        <h1 className={styles.formTitle}>Proposal Request Form</h1>

        {/* ── Success banner ── */}
        {state.status === "success" && (
          <div style={{
            background: "#1a3a1a", border: "1px solid #4caf50",
            borderRadius: 10, padding: "10px 14px",
            color: "#4caf50", fontSize: 13,
          }}>
            {state.message}
          </div>
        )}

        {/* ── Client Information ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Client Information</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientName">Client Name</label>
            <input
              id="clientName"
              name="clientName"
              className={styles.input}
              defaultValue={prefillClientName ?? ""}
              readOnly={!!prefillClientName}
              style={{
                ...(state.errors?.clientName ? { borderColor: "#f44336" } : {}),
                ...(prefillClientName ? { opacity: 0.7, cursor: "not-allowed" } : {}),
              }}
            />
            {state.errors?.clientName && (
              <span style={{ color: "#f44336", fontSize: 11 }}>{state.errors.clientName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="requestedByName">Requested By</label>
            <input
              id="requestedByName"
              name="requestedByName"
              className={styles.input}
              value={requesterName}
              readOnly
              style={{ opacity: 0.7, cursor: "not-allowed" }}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="opportunityId">Opportunity ID</label>
            <input
              id="opportunityId"
              name="opportunityId"
              className={styles.input}
              defaultValue={prefillOpportunityId ?? ""}
              style={state.errors?.opportunityId ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.opportunityId && (
              <span style={{ color: "#f44336", fontSize: 11 }}>{state.errors.opportunityId}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="deadline">Submission Deadline</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              className={styles.input}
              style={state.errors?.deadline ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.deadline && (
              <span style={{ color: "#f44336", fontSize: 11 }}>{state.errors.deadline}</span>
            )}
          </div>
        </section>

        {/* ── Client Requirements ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Client Requirements</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="requirements">Requirements Description</label>
            <textarea
              id="requirements"
              name="requirements"
              className={styles.textarea}
              style={state.errors?.requirements ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.requirements && (
              <span style={{ color: "#f44336", fontSize: 11 }}>{state.errors.requirements}</span>
            )}
          </div>
        </section>

        {/* ── Scope of Work ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Scope of Work</h2>
          <ScopeItems />
        </section>

        {/* ── Pricing Inputs ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pricing Inputs</h2>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="licenses">Number of Licenses</label>
              <input id="licenses" name="licenses" type="number" min="0" className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contractDuration">Contract Duration (months)</label>
              <input id="contractDuration" name="contractDuration" type="number" min="0" className={styles.input} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="services">Services Needed</label>
            <input id="services" name="services" className={styles.input} />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="attachments">Attachments</label>
            <input id="attachments" name="attachments" type="file" multiple className={styles.dropzone} style={{ cursor: "pointer" }} />
          </div>
        </section>

        {/* ── Submit ── */}
        <div className={styles.submitRow}>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

export default SubmitProposal;
