/**
 * All mutation server actions have been replaced with direct axios calls.
 * See src/app/lib/utils/apiMutations.ts for all mutation functions.
 * Auth is handled client-side in login/signup pages via axios.
 */

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

export type LoginFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  token?:  string; // returned to client → stored in localStorage
  userId?: string; // returned to client → stored in localStorage for rehydration
  errors?: Partial<Record<string, string>>;
};

export type RegisterFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  token?: string; // returned to client → stored in localStorage
  errors?: Partial<Record<string, string>>;
};

export type ProposalFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

export type InviteFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  previewUrl?: string;
  errors?: Partial<Record<string, string>>;
};
