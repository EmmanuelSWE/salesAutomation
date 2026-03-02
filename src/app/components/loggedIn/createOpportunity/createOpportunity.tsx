"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOpportunity, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";
import { useUserState, useUserAction, useContactState, useContactAction } from "../../../lib/providers/provider";

const STAGES   = [["Lead","Lead"],["Qualified","Qualified"],["Proposal","Proposal"],["Negotiation","Negotiation"],["Closed Won","Closed Won"],["Closed Lost","Closed Lost"]];
const SOURCES  = [["Inbound","Inbound"],["Outbound","Outbound"],["Referral","Referral"],["Partner","Partner"],["RFP","RFP"]];
const CURRENCIES = ["ZAR","USD","EUR","GBP"];

interface Props { clientId: string; }

export default function CreateOpportunity({ clientId }: Readonly<Props>) {
  const router = useRouter();
  const { styles } = useFormStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  const { users, isPending: usersPending } = useUserState();
  const { getUsers } = useUserAction();
  const { contacts, isPending: contactsPending } = useContactState();
  const { getContactsByClient } = useContactAction();

  useEffect(() => {
    getUsers({ role: "SalesRep", isActive: true });
    getContactsByClient(clientId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!contactsPending && contacts?.length === 0) {
      router.replace(`/Client/${clientId}/createContact`);
    }
  }, [contactsPending, contacts, clientId, router]);

  const salesReps = users ?? [];
  const primaryContact = (contacts ?? []).find((c) => c.isPrimaryContact) ?? contacts?.[0];

  async function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    fd.set("clientId",  clientId);
    fd.set("contactId", primaryContact?.id ?? "");
    setIsPending(true);
    try {
      await createOpportunity({
        title:             fd.get("title")             as string,
        clientId,
        contactId:         primaryContact?.id,
        ownerId:           fd.get("ownerId")           as string,
        estimatedValue:    Number(fd.get("estimatedValue") as string),
        currency:          fd.get("currency")          as string,
        stage:             fd.get("stage")             as string,
        source:            fd.get("source")            as string,
        probability:       Number(fd.get("probability") as string) || undefined,
        expectedCloseDate: fd.get("expectedCloseDate") as string,
        description:       fd.get("description")       as string,
      });
      setState({ status: "success", message: "Opportunity created." });
      router.push(`/Client/${clientId}/clientOverView`);
      router.refresh();
    } catch (err) {
      setState({ status: "error", message: extractApiMessage(err) });
    } finally {
      setIsPending(false);
    }
  }

  const isLoading = contactsPending || contacts === undefined;

  return (
    <div className={styles.page}>
      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>Loading...</div>
      ) : (
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
        <h1 className={styles.formTitle}>Create Opportunity</h1>
        {state.status === "success" && <div className={styles.successBanner}>{state.message}</div>}
        {state.status === "error" && <div className={styles.errorBanner}>{state.message}</div>}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title</label>
            <input id="title" name="title" className={styles.input} placeholder="Big Deal"
              style={state.errors?.title ? { borderColor: "#f44336" } : {}} />
            {state.errors?.title && <span className={styles.errorText}>{state.errors.title}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">Description</label>
            <textarea id="description" name="description" className={styles.textarea} placeholder="Initial engagement from referral" />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Financials</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="estimatedValue">Estimated Value</label>
              <input id="estimatedValue" name="estimatedValue" type="number" min="0" className={styles.input} placeholder="50000"
                style={state.errors?.estimatedValue ? { borderColor: "#f44336" } : {}} />
              {state.errors?.estimatedValue && <span className={styles.errorText}>{state.errors.estimatedValue}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currency">Currency</label>
              <select id="currency" name="currency" className={styles.select} defaultValue="ZAR">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="probability">Probability (%)</label>
              <input id="probability" name="probability" type="number" min="0" max="100" className={styles.input} placeholder="30" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="expectedCloseDate">Expected Close Date</label>
              <input id="expectedCloseDate" name="expectedCloseDate" type="date" className={styles.input}
                style={state.errors?.expectedCloseDate ? { borderColor: "#f44336" } : {}} />
              {state.errors?.expectedCloseDate && <span className={styles.errorText}>{state.errors.expectedCloseDate}</span>}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pipeline</h2>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="stage">Stage</label>
              <select id="stage" name="stage" className={styles.select} defaultValue=""
                style={state.errors?.stage ? { borderColor: "#f44336" } : {}}>
                <option value="" disabled>Select stage...</option>
                {STAGES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              {state.errors?.stage && <span className={styles.errorText}>{state.errors.stage}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="source">Source</label>
              <select id="source" name="source" className={styles.select} defaultValue="">
                <option value="" disabled>Select source...</option>
                {SOURCES.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ownerId">Owner</label>
            <select id="ownerId" name="ownerId" className={styles.select} defaultValue="" disabled={usersPending}>
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
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Opportunity" pendingLabel="Creating..." isPending={isPending} />
        </div>
      </form>
      )}
    </div>
  );
}
