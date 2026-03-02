/**
 * strictApi.ts
 *
 * Typed axios wrapper that validates both request bodies and response shapes
 * using the Zod schemas in contract.ts.
 *
 * Usage:
 *   import { strictApi } from "./strictApi";
 *   import { zPaged, zClient } from "./contract";
 *
 *   const data = await strictApi.get("/clients", { schema: zPaged(zClient), params: { pageNumber: 1 } });
 *   // data is fully typed as Paged<Client>
 */

import { z } from "zod";
import { message } from "antd";
import api from "../utils/axiosInstance";

/* ══════════════════════════════════════════════════════
   TYPED VALIDATION ERROR
   Thrown BEFORE the request is sent (req validation)
   or AFTER the response arrives (res validation).
══════════════════════════════════════════════════════ */
export class TypedValidationError extends Error {
  public readonly issues: z.ZodIssue[];
  public readonly phase:  "request" | "response";

  constructor(issues: z.ZodIssue[], phase: "request" | "response") {
    const summary = issues
      .slice(0, 3)
      .map(i => `[${i.path.join(".")}] ${i.message}`)
      .join("; ");
    super(`${phase === "request" ? "Request" : "Response"} validation failed: ${summary}`);
    this.name   = "TypedValidationError";
    this.issues = issues;
    this.phase  = phase;
  }
}

/* ══════════════════════════════════════════════════════
   VALIDATION HELPERS
══════════════════════════════════════════════════════ */

function validateRequest<S extends z.ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new TypedValidationError(result.error.issues, "request");
  }
  return result.data;
}

function validateResponse<S extends z.ZodTypeAny>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Surface the first few issues to the developer; do NOT swallow.
    throw new TypedValidationError(result.error.issues, "response");
  }
  return result.data;
}

/* ══════════════════════════════════════════════════════
   ERROR HANDLER  — for use inside providers
   Converts TypedValidationError → antd message.error so
   the user sees a clear message; re-throws for callers.
══════════════════════════════════════════════════════ */
export function handleProviderError(
  context:  string,
  err:      unknown,
  dispatchError?: () => void,
): void {
  if (err instanceof TypedValidationError) {
    const friendly = err.issues
      .slice(0, 2)
      .map(i => `${i.path.join(".") || "field"}: ${i.message}`)
      .join("; ");
    message.error(`${context} — ${err.phase} validation: ${friendly}`);
    dispatchError?.();
    return;
  }

  // Axios HTTP error
  const axiosErr = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
  const status   = axiosErr.response?.status;
  const serverMsg = axiosErr.response?.data?.message;

  if (status === 400) {
    message.error(`${context}: ${serverMsg ?? "Bad request. Check required fields."}`);
  } else if (status === 401) {
    message.error(`${context}: Session expired. Please log in again.`);
  } else if (status === 403) {
    message.error(`${context}: You do not have permission for this action.`);
  } else if (status === 404) {
    message.error(`${context}: Resource not found.`);
  } else if (status === 409) {
    message.error(`${context}: ${serverMsg ?? "Conflict — the record may already exist."}`);
  } else {
    message.error(`${context}: ${serverMsg ?? axiosErr.message ?? "Unexpected error."}`);
  }

  dispatchError?.();
}

/* ══════════════════════════════════════════════════════
   GET
   strictApi.get("/clients", { schema: zPaged(zClient), params: { pageNumber: 1 } })
══════════════════════════════════════════════════════ */
async function get<S extends z.ZodTypeAny>(
  path:   string,
  opts:   { schema: S; params?: Record<string, unknown> },
): Promise<z.infer<S>> {
  const res = await api.get(path, { params: opts.params });
  return validateResponse(opts.schema, res.data);
}

/* ══════════════════════════════════════════════════════
   POST
   strictApi.post("/clients", payload, { reqSchema: zCreateClient, resSchema: zClient })
   Pass resSchema as undefined for 204 / void responses.
══════════════════════════════════════════════════════ */
async function post<S extends z.ZodTypeAny | undefined = undefined>(
  path:    string,
  body:    unknown,
  opts?:   {
    reqSchema?: z.ZodTypeAny;
    resSchema?: S;
    params?:    Record<string, unknown>;
  },
): Promise<S extends z.ZodTypeAny ? z.infer<S> : void> {
  const validated = opts?.reqSchema ? validateRequest(opts.reqSchema, body) : body;
  const res = await api.post(path, validated, { params: opts?.params });
  if (opts?.resSchema) {
    return validateResponse(opts.resSchema, res.data) as S extends z.ZodTypeAny ? z.infer<S> : void;
  }
  return undefined as S extends z.ZodTypeAny ? z.infer<S> : void;
}

/* ══════════════════════════════════════════════════════
   PUT
   strictApi.put("/proposals/123/submit")              — no body (no args)
   strictApi.put("/opportunities/123/stage", stageBody, { reqSchema: zStageBody })
══════════════════════════════════════════════════════ */
async function put<S extends z.ZodTypeAny | undefined = undefined>(
  path:    string,
  body?:   unknown,
  opts?:   {
    reqSchema?: z.ZodTypeAny;
    resSchema?: S;
    params?:    Record<string, unknown>;
  },
): Promise<S extends z.ZodTypeAny ? z.infer<S> : void> {
  const validated = (body !== undefined && opts?.reqSchema)
    ? validateRequest(opts.reqSchema, body)
    : body;

  const res = await api.put(path, validated !== undefined ? validated : undefined, { params: opts?.params });

  if (opts?.resSchema) {
    return validateResponse(opts.resSchema, res.data) as S extends z.ZodTypeAny ? z.infer<S> : void;
  }
  return undefined as S extends z.ZodTypeAny ? z.infer<S> : void;
}

/* ══════════════════════════════════════════════════════
   DELETE
   strictApi.del("/clients/123")
══════════════════════════════════════════════════════ */
async function del(path: string, params?: Record<string, unknown>): Promise<void> {
  await api.delete(path, { params });
}

/* ══════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════ */
export const strictApi = { get, post, put, del } as const;
