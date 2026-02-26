"use client";

import { useFormStatus } from "react-dom";
import { useCreateClientStyles } from "../createClient.module";

export function CreateClientSubmitButton() {
  const { pending } = useFormStatus();
  const { styles }  = useCreateClientStyles();

  return (
    <button
      type="submit"
      disabled={pending}
      className={styles.submitBtn}
    >
      {pending ? "Creating…" : "Create Client"}
    </button>
  );
}