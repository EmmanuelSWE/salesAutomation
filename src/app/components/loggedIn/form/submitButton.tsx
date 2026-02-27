"use client";
import { useFormStatus } from "react-dom";
import { useFormStyles } from "./form.module";

interface Props { label?: string; pendingLabel?: string; }

export function SubmitButton({ label = "Submit", pendingLabel = "Submitting…" }: Readonly<Props>) {
  const { pending } = useFormStatus();
  const { styles }  = useFormStyles();
  return (
    <button type="submit" disabled={pending} className={styles.submitBtn}>
      {pending ? pendingLabel : label}
    </button>
  );
}