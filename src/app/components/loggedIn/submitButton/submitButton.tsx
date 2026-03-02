"use client";

import { useSubmitProposalStyles } from "../submitProposal/submitProposal.module";

interface Props { isPending?: boolean; }

export function SubmitButton({ isPending = false }: Props) {
  const { styles } = useSubmitProposalStyles();

  return (
    <button
      type="submit"
      disabled={isPending}
      className={styles.submitBtn}
      style={isPending ? { opacity: 0.6, cursor: "not-allowed" } : {}}
    >
      {isPending ? "Submitting..." : "Submit"}
    </button>
  );
}
