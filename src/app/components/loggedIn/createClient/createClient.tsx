"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { CreateClientSubmitButton } from "./submitButton/submitButton";
import { useCreateClientStyles } from "./createClient.module";

const CLIENT_TYPES = [
  { value: "Government", label: "Government" },
  { value: "Private",    label: "Private"    },
  { value: "Partner",    label: "Partner"    },
];

const COMPANY_SIZES = [
  { value: "1-10",    label: "1-10"    },
  { value: "11-50",   label: "11-50"   },
  { value: "50-100",  label: "50-100"  },
  { value: "101-500", label: "101-500" },
  { value: "500+",    label: "500+"    },
];

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Retail",
  "Manufacturing", "Education", "Legal", "Other",
];

const CreateClient = () => {
  const { styles } = useCreateClientStyles();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setIsPending(true);
    try {
      const res = await createClient({
        name:           fd.get("name")           as string,
        industry:       fd.get("industry")       as string,
        clientType:     fd.get("clientType")     as string,
        website:        fd.get("website")        as string,
        billingAddress: fd.get("billingAddress") as string,
        taxNumber:      fd.get("taxNumber")      as string,
        companySize:    fd.get("companySize")    as string,
      });
      setState({ status: "success", message: "Client created." });
      router.push(`/Client/${res.data.id}/clientOverView`);
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
        <h1 className={styles.formTitle}>Create New Client</h1>

        {state.status === "success" && (
          <div className={styles.successBanner}>{state.message}</div>
        )}
        {state.status === "error" && (
          <div className={styles.errorBanner}>{state.message}</div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Company Details</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Company Name</label>
            <input
              id="name" name="name" className={styles.input} placeholder="e.g. Acme Corp"
              style={state.errors?.name ? { borderColor: "#f44336" } : {}}
            />
            {state.errors?.name && <span className={styles.errorText}>{state.errors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="industry">Industry</label>
            <select id="industry" name="industry" className={styles.select} defaultValue=""
              style={state.errors?.industry ? { borderColor: "#f44336" } : {}}>
              <option value="" disabled>Select industry...</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            {state.errors?.industry && <span className={styles.errorText}>{state.errors.industry}</span>}
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="clientType">Client Type</label>
              <select id="clientType" name="clientType" className={styles.select} defaultValue=""
                style={state.errors?.clientType ? { borderColor: "#f44336" } : {}}>
                <option value="" disabled>Select type...</option>
                {CLIENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              {state.errors?.clientType && <span className={styles.errorText}>{state.errors.clientType}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="companySize">Company Size</label>
              <select id="companySize" name="companySize" className={styles.select} defaultValue="">
                <option value="" disabled>Select size...</option>
                {COMPANY_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact &amp; Web</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="website">Website</label>
            <input id="website" name="website" type="url" className={styles.input} placeholder="https://acme.com"
              style={state.errors?.website ? { borderColor: "#f44336" } : {}} />
            {state.errors?.website && <span className={styles.errorText}>{state.errors.website}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="billingAddress">Billing Address</label>
            <input id="billingAddress" name="billingAddress" className={styles.input} placeholder="123 Main St, City, Country"
              style={state.errors?.billingAddress ? { borderColor: "#f44336" } : {}} />
            {state.errors?.billingAddress && <span className={styles.errorText}>{state.errors.billingAddress}</span>}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Financial Info</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="taxNumber">Tax Number</label>
            <input id="taxNumber" name="taxNumber" className={styles.input} placeholder="1234567890" />
          </div>
        </section>

        <div className={styles.submitRow}>
          <CreateClientSubmitButton isPending={isPending} />
        </div>
      </form>
    </div>
  );
}

export default CreateClient;
