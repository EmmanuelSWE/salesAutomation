"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProposal, createActivity, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { ScopeItems }   from "../../dashboard/scopeItems/scopeItems";
import { SubmitButton } from "../submitButton/submitButton";
import { useSubmitProposalStyles } from "./submitProposal.module";

interface SubmitProposalProps {
  prefillClientId?:      string;
  prefillClientName?:    string;
  prefillOpportunityId?: string;
}

const SubmitProposal = ({ prefillClientId, prefillClientName, prefillOpportunityId }: Readonly<SubmitProposalProps> = {}) => {
  const { styles } = useSubmitProposalStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);
  const [clientName, setClientName] = useState(prefillClientName ?? "");
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("ZAR");

  async function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("clientId",   prefillClientId ?? "");
    fd.set("clientName", clientName);
    fd.set("title",      title);
    fd.set("currency",   currency);
    if (prefillOpportunityId) fd.set("opportunityId", prefillOpportunityId);

    setIsPending(true);
    try {
      const opportunityId = (fd.get("opportunityId") as string) || prefillOpportunityId || "";
      const res = await createProposal(fd, {
        opportunityId,
        title,
        currency,
      });
      /* ── Create one Task activity per line item ── */
      const deadline = (fd.get("deadline") as string) || new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
      const reScope  = /^scopeItem_(\d+)_(.+)$/;
      const itemMap  = new Map<number, Record<string, string>>();
      for (const [key, val] of fd.entries()) {
        const m = reScope.exec(key);
        if (!m || typeof val !== "string") continue;
        const idx = Number.parseInt(m[1], 10);
        if (!itemMap.has(idx)) itemMap.set(idx, {});
        itemMap.get(idx)![m[2]] = val;
      }
      const relType = opportunityId ? "Opportunity" : prefillClientId ? "Client" : undefined;
      const relId   = opportunityId || prefillClientId || undefined;
      await Promise.allSettled(
        Array.from(itemMap.entries())
          .sort(([a], [b]) => a - b)
          .filter(([, item]) => item.productServiceName?.trim())
          .map(([, item]) =>
            createActivity({
              type:          "Task",
              subject:       `Deliver: ${item.productServiceName.trim()}`,
              description:   item.description?.trim() || `Line item from proposal "${title}"`,
              priority:      "Medium",
              dueDate:       deadline,
              ...(relType ? { relatedToType: relType } : {}),
              ...(relId   ? { relatedToId:   relId }   : {}),
            })
          )
      );

      setState({ status: "success", message: "Proposal submitted successfully." });
      if (prefillClientId) {
        router.push(`/Client/${prefillClientId}/clientOverView`);
      } else {
        router.push(`/proposals/${res.data.id}`);
      }
      router.refresh();
    } catch (err) {
      setState({ status: "error", message: extractApiMessage(err) });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form} encType="multipart/form-data">
        <h1 className={styles.formTitle}>Proposal Request Form</h1>

        {state.status === "success" && (
          <div style={{
            background: "#1a3a1a", border: "1px solid #4caf50",
            borderRadius: 10, padding: "10px 14px",
            color: "#4caf50", fontSize: 13,
          }}>
            {state.message}
          </div>
        )}
        {state.status === "error" && (
          <div style={{
            background: "rgba(255,107,107,0.08)", border: "1px solid #f44336",
            borderRadius: 10, padding: "10px 14px",
            color: "#f44336", fontSize: 13,
          }}>
            {state.message}
          </div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Client Information</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="clientName">Client Name</label>
            <input
              id="clientName"
              className={styles.input}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              style={state.errors?.clientName ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.clientName && (
              <span style={{ color: "#f44336", fontSize: 11 }}>{state.errors.clientName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="proposalTitle">Proposal Title</label>
            <input
              id="proposalTitle"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this proposal"
              style={state.errors?.title ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.title && (
              <span style={{ color: "#f44336", fontSize: 11 }}>{state.errors.title}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="currency">Currency</label>
            <select
              id="currency"
              className={styles.input}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
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

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Scope of Work</h2>
          <ScopeItems />
        </section>

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

        <div className={styles.submitRow}>
          <SubmitButton isPending={isPending} />
        </div>
      </form>
    </div>
  );
}

export default SubmitProposal;
