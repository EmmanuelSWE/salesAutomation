/**
 * apiMutations.ts
 * ──────────────────────────────────────────────────────
 * All write operations (POST / PUT / DELETE) as typed
 * client-side axios functions.  The shared `api` instance
 * in axiosInstance.tsx automatically attaches the Bearer
 * token from localStorage on every request.
 */
import api from "./axiosInstance";
import {
  ACTIVITY_TYPE_NUM,
  PRIORITY_NUM,
  RELATED_TO_TYPE_NUM,
  OPPORTUNITY_STAGE_NUM,
  OPPORTUNITY_SOURCE_NUM,
} from "./apiEnums";

/* ── Shared state shape used by all form components ── */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

/* ── Extract a user-friendly error message from an axios error ── */
export function extractApiMessage(err: unknown): string {
  const data = (err as { response?: { data?: unknown } }).response?.data;
  if (!data || typeof data !== "object") return "An unexpected error occurred.";
  const d = data as Record<string, unknown>;
  if (typeof d.message === "string") return d.message;
  if (typeof d.title   === "string") return d.title;
  if (Array.isArray(d.errors))       return (d.errors as string[]).join("; ");
  if (d.errors && typeof d.errors === "object") {
    return Object.values(d.errors as Record<string, unknown>)
      .flat()
      .join("; ");
  }
  return "An unexpected error occurred.";
}

/* ══════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════ */
export const loginUser = (email: string, password: string) =>
  api.post<{ token: string; userId: string }>("/auth/login", { email: email.trim(), password });

export const registerUser = (payload: object) =>
  api.post<{ token: string }>("/auth/register", payload);

/* ══════════════════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════════════════ */
export const createClient = (payload: object) =>
  api.post<{ id: string }>("/clients", payload);

/* ══════════════════════════════════════════════════════
   CONTACTS
══════════════════════════════════════════════════════ */
export const createContact = (payload: object) =>
  api.post("/contacts", payload);

/* ══════════════════════════════════════════════════════
   OPPORTUNITIES
══════════════════════════════════════════════════════ */
export const createOpportunity = (payload: {
  title: string;
  clientId: string;
  estimatedValue: number;
  stage: string;
  expectedCloseDate: string;
  description?: string;
  currency?: string;
  probability?: number;
  contactId?: string;
  ownerId?: string;
  source?: string;
}) => {
  const body: Record<string, unknown> = {
    title:             payload.title,
    clientId:          payload.clientId,
    estimatedValue:    payload.estimatedValue,
    stage:             OPPORTUNITY_STAGE_NUM[payload.stage] ?? Number(payload.stage),
    expectedCloseDate: payload.expectedCloseDate,
  };
  if (payload.description?.trim())    body.description  = payload.description.trim();
  if (payload.currency?.trim())       body.currency     = payload.currency.trim();
  if (payload.probability != null)    body.probability  = payload.probability;
  if (payload.contactId?.trim())      body.contactId    = payload.contactId.trim();
  if (payload.ownerId?.trim())        body.ownerId      = payload.ownerId.trim();
  if (payload.source?.trim())         body.source       = OPPORTUNITY_SOURCE_NUM[payload.source.trim()] ?? Number(payload.source);
  return api.post<{ id: string }>("/opportunities", body);
};

/* ══════════════════════════════════════════════════════
   PRICING REQUESTS
══════════════════════════════════════════════════════ */
export const createPricingRequest = (payload: {
  title: string;
  requiredByDate: string;
  priority: string;
  description?: string;
  clientId?: string;
  opportunityId?: string;
  assignedToId?: string;
}) =>
  api.post("/pricingrequests", {
    title:          payload.title,
    requiredByDate: payload.requiredByDate,
    priority:       PRIORITY_NUM[payload.priority] ?? 2,
    ...(payload.description?.trim()   ? { description:   payload.description.trim()   } : {}),
    ...(payload.clientId?.trim()      ? { clientId:      payload.clientId.trim()      } : {}),
    ...(payload.opportunityId?.trim() ? { opportunityId: payload.opportunityId.trim() } : {}),
    ...(payload.assignedToId?.trim()  ? { assignedToId:  payload.assignedToId.trim()  } : {}),
  });

/* ══════════════════════════════════════════════════════
   CONTRACTS
══════════════════════════════════════════════════════ */
export const createContract = (payload: object) =>
  api.post("/contracts", payload);

/* ══════════════════════════════════════════════════════
   RENEWALS
══════════════════════════════════════════════════════ */
export const createRenewal = (
  contractId: string,
  payload: { renewalOpportunityId?: string; notes?: string },
) => api.post(`/contracts/${contractId}/renewals`, payload);

/* ══════════════════════════════════════════════════════
   ACTIVITIES
══════════════════════════════════════════════════════ */
export const createActivity = (payload: {
  type: string;
  subject: string;
  dueDate: string;
  description?: string;
  priority?: string;
  assignedToId?: string;
  relatedToType?: string;
  relatedToId?: string;
  duration?: string;
  location?: string;
}) =>
  api.post("/activities", {
    type:    ACTIVITY_TYPE_NUM[payload.type]   ?? Number(payload.type),
    subject: payload.subject,
    dueDate: payload.dueDate.includes("T") ? payload.dueDate : `${payload.dueDate}T00:00:00`,
    ...(payload.description   ? { description: payload.description }                                                           : {}),
    ...(payload.priority      ? { priority: PRIORITY_NUM[payload.priority] ?? Number(payload.priority) }                      : {}),
    ...(payload.assignedToId  ? { assignedToId: payload.assignedToId }                                                        : {}),
    ...(payload.relatedToType ? { relatedToType: RELATED_TO_TYPE_NUM[payload.relatedToType] ?? Number(payload.relatedToType) } : {}),
    ...(payload.relatedToId   ? { relatedToId: payload.relatedToId }                                                          : {}),
    ...(payload.duration      ? { duration: Number(payload.duration) }                                                        : {}),
    ...(payload.location      ? { location: payload.location }                                                                : {}),
  });

/* ══════════════════════════════════════════════════════
   NOTES
══════════════════════════════════════════════════════ */
export const createNote = (payload: {
  content: string;
  relatedToType: string;
  relatedToId: string;
  isPrivate?: boolean;
}) =>
  api.post("/notes", {
    content:       payload.content,
    relatedToType: Number(payload.relatedToType),
    relatedToId:   payload.relatedToId,
    isPrivate:     payload.isPrivate ?? false,
  });

/* ══════════════════════════════════════════════════════
   PROPOSALS
══════════════════════════════════════════════════════ */
function parseLineItemsFromForm(formData: FormData) {
  const re = /^scopeItem_(\d+)_(.+)$/;
  const map = new Map<number, Record<string, string>>();
  for (const [key, val] of formData.entries()) {
    const m = re.exec(key);
    if (!m || typeof val !== "string") continue;
    const idx = Number.parseInt(m[1], 10);
    if (!map.has(idx)) map.set(idx, {});
    map.get(idx)![m[2]] = val;
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([, item]) => ({
      productServiceName: item.productServiceName?.trim() ?? "",
      description:        item.description?.trim() ?? "",
      quantity:           Number.parseFloat(item.quantity)  || 1,
      unitPrice:          Number.parseFloat(item.unitPrice) || 0,
      discount:           Number.parseFloat(item.discount)  || 0,
      taxRate:            Number.parseFloat(item.taxRate)   || 0,
    }))
    .filter((item) => item.productServiceName.length > 0);
}

export const createProposal = (
  formData: FormData,
  opts: { opportunityId: string; title: string; currency: string },
) => {
  const deadline         = formData.get("deadline")         as string;
  const requirements     = formData.get("requirements")     as string;
  const licenses         = formData.get("licenses")         as string;
  const contractDuration = formData.get("contractDuration") as string;
  const services         = formData.get("services")         as string;
  const lineItems        = parseLineItemsFromForm(formData);

  const body: Record<string, unknown> = {
    opportunityId: opts.opportunityId,
    title:         opts.title,
    description:   requirements,
    currency:      opts.currency,
    validUntil:    deadline,
  };
  if (lineItems.length)         body.lineItems        = lineItems;
  if (licenses?.trim())         body.licenses         = Number(licenses)         || licenses.trim();
  if (contractDuration?.trim()) body.contractDuration = Number(contractDuration) || contractDuration.trim();
  if (services?.trim())         body.services         = services.trim();

  return api.post<{ id: string }>("/proposals", body);
};

/* ══════════════════════════════════════════════════════
   AGGREGATE BUTTON ACTIONS
══════════════════════════════════════════════════════ */
export const advanceStage = (opportunityId: string, stage: number, reason?: string) =>
  api.put(`/opportunities/${opportunityId}/stage`, { stage, reason });

export const assignPricingRequest = (id: string, assignedToId: string) =>
  api.post(`/pricingrequests/${id}/assign`, { assignedToId });

export const approveProposal = (id: string, comment?: string) =>
  api.put(`/proposals/${id}/approve`, comment ? { comment } : {});

export const activateContract = (id: string) =>
  api.put(`/contracts/${id}/activate`, {});

export const completeRenewal = (renewalId: string) =>
  api.put(`/contracts/renewals/${renewalId}/complete`, {});
