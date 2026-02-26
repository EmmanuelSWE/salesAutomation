"use client";

import { useFormStatus } from "react-dom";
import  {useSubmitProposalStyles}  from "../submitProposal/submitProposal.module";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const { styles }  = useSubmitProposalStyles();

  return (
    <button
      type="submit"
      disabled={pending}
      className={styles.submitBtn}
      style={pending ? { opacity: 0.6, cursor: "not-allowed" } : {}}
    >
      {pending ? "Submitting…" : "Submit"}
    </button>
  );
}