"use client";
import { useFormStyles } from "./form.module";

interface Props { label?: string; pendingLabel?: string; isPending?: boolean; }

export function SubmitButton({ label = "Submit", pendingLabel = "Submitting...", isPending = false }: Readonly<Props>) {
  const { styles } = useFormStyles();
  return (
    <button type="submit" disabled={isPending} className={styles.submitBtn}>
      {isPending ? pendingLabel : label}
    </button>
  );
}
