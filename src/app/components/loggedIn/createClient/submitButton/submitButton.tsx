"use client";

import { useCreateClientStyles } from "../createClient.module";

interface Props { isPending?: boolean; }

export function CreateClientSubmitButton({ isPending = false }: Props) {
  const { styles } = useCreateClientStyles();

  return (
    <button
      type="submit"
      disabled={isPending}
      className={styles.submitBtn}
    >
      {isPending ? "Creating..." : "Create Client"}
    </button>
  );
}
