"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? process.env.API_BASE_URL ?? "").replace(/\/$/, "");

/* ══════════════════════════════════════════════════════
   HELPERS
   Token comes from a hidden _token form field on every
   form — client reads it from localStorage and injects it
══════════════════════════════════════════════════════ */
class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    super(`API error ${status}`);
    this.status = status;
    this.data   = data;
  }
}

async function apiPost(path: string, body: object, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

async function apiPut(path: string, body: object, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

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

/* ══════════════════════════════════════════════════════
   AUTH
   No cookie logic — token is returned in state.
   Client useEffect watches for state.token, calls
   setToken(state.token) then redirects to dashboard.
══════════════════════════════════════════════════════ */
export async function loginAction(
  _prev: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  console.log("[loginAction] Starting login process...");
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  console.log("[loginAction] Email:", email);
  const errors: Partial<Record<string, string>> = {};
  if (!email?.trim())    errors.email    = "Email is required.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!password?.trim()) errors.password = "Password is required.";
  if (Object.keys(errors).length) {
    console.log("[loginAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[loginAction] Calling API:", `${BASE}/auth/login`);
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.log("[loginAction] API error:", data?.message);
      return { status: "error", message: data?.message ?? "Invalid email or password." };
    }

    console.log("[loginAction] Login successful, token received");
    // Return token + userId to client — client stores both in localStorage
    return { status: "success", token: data.token, userId: data.userId };
  } catch (err) {
    console.error("[loginAction] Exception:", err);
    return { status: "error", message: "Login failed. Please try again." };
  }
}

function validateRegister(fields: Record<string, string>) {
  const { firstName, lastName, email, password, confirmPassword, tenantName, tenantId, role } = fields;
  const errors: Partial<Record<string, string>> = {};
  if (!firstName?.trim())  errors.firstName = "First name is required.";
  if (!lastName?.trim())   errors.lastName  = "Last name is required.";
  if (!email?.trim())      errors.email     = "Email is required.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!password?.trim())   errors.password  = "Password is required.";
  if (password && password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (password !== confirmPassword)    errors.confirmPassword = "Passwords do not match.";
  if (tenantName?.trim() && tenantId?.trim()) errors.tenantName = "Cannot specify both Tenant Name and Tenant ID.";
  if (tenantId?.trim() && !role?.trim())      errors.role = "Role is required when joining an organisation.";
  return errors;
}

function buildRegisterPayload(fields: Record<string, string>): Record<string, unknown> {
  const { firstName, lastName, email, password, tenantName, tenantId, role } = fields;
  const payload: Record<string, unknown> = {
    firstName: firstName.trim(), lastName: lastName.trim(),
    email: email.trim(), password,
  };
  if (tenantName?.trim())  payload.tenantName = tenantName.trim();
  if (tenantId?.trim())  { payload.tenantId = tenantId.trim(); payload.role = role.trim(); }
  else if (role?.trim())   payload.role = role.trim();
  return payload;
}

export async function registerAction(
  _prev: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const fields = {
    firstName:       (formData.get("firstName")       as string) || "",
    lastName:        (formData.get("lastName")        as string) || "",
    email:           (formData.get("email")           as string) || "",
    password:        (formData.get("password")        as string) || "",
    confirmPassword: (formData.get("confirmPassword") as string) || "",
    tenantName:      (formData.get("tenantName")      as string) || "",
    tenantId:        (formData.get("tenantId")        as string) || "",
    role:            (formData.get("role")            as string) || 'SalesRep',
  };

  const errors = validateRegister(fields);
  if (Object.keys(errors).length) return { status: "error", errors };

  try {
    const res = await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildRegisterPayload(fields)),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const apiErrors: Partial<Record<string, string>> = {};
      if (data?.errors && typeof data.errors === "object") Object.assign(apiErrors, data.errors);
      return { status: "error", message: data?.message ?? "Registration failed.", errors: apiErrors };
    }
    return { status: "success", token: data.token };
  } catch {
    return { status: "error", message: "Registration failed. Please try again." };
  }
}

/* ══════════════════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════════════════ */
export async function createClientAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createClientAction] Starting client creation...");
  const token          = formData.get("_token")         as string;
  const name           = formData.get("name")           as string;
  const industry       = formData.get("industry")       as string;
  const clientType     = formData.get("clientType")     as string;
  const website        = formData.get("website")        as string;
  const billingAddress = formData.get("billingAddress") as string;
  const taxNumber      = formData.get("taxNumber")      as string;
  const companySize    = formData.get("companySize")    as string;

  const errors: Partial<Record<string, string>> = {};
  if (!name?.trim())           errors.name           = "Company name is required.";
  if (!industry?.trim())       errors.industry       = "Industry is required.";
  if (!clientType)             errors.clientType     = "Client type is required.";
  if (!billingAddress?.trim()) errors.billingAddress = "Billing address is required.";
  if (website && !/^https?:\/\/.+/.test(website)) errors.website = "Must start with http:// or https://";
  if (Object.keys(errors).length) {
    console.log("[createClientAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createClientAction] Calling API with data:", { name, industry, clientType });
    const data = await apiPost("/clients", {
      name: name.trim(), industry: industry.trim(),
      clientType: Number(clientType), website,
      billingAddress, taxNumber, companySize,
    }, token);
    console.log("[createClientAction] Success, client ID:", data.id);
    revalidatePath("/clients");
    redirect(`/Client/${data.id}`);
  } catch (err: unknown) {
    console.error("[createClientAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create client." };
  }
}

/* ══════════════════════════════════════════════════════
   CONTACTS
══════════════════════════════════════════════════════ */
export async function createContactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createContactAction] Starting contact creation...");
  const token            = formData.get("_token")           as string;
  const clientId         = formData.get("clientId")         as string;
  const firstName        = formData.get("firstName")        as string;
  const lastName         = formData.get("lastName")         as string;
  const email            = formData.get("email")            as string;
  const phoneNumber      = formData.get("phoneNumber")      as string;
  const position         = formData.get("position")         as string;
  const isPrimaryContact = formData.get("isPrimaryContact") === "true";

  const errors: Partial<Record<string, string>> = {};
  if (!clientId?.trim())  errors.clientId  = "Client ID is required.";
  if (!firstName?.trim()) errors.firstName = "First name is required.";
  if (!lastName?.trim())  errors.lastName  = "Last name is required.";
  if (!email?.trim())     errors.email     = "Email is required.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (Object.keys(errors).length) {
    console.log("[createContactAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createContactAction] Calling API with data:", { clientId, firstName, lastName, email });
    await apiPost("/contacts", {
      clientId, firstName, lastName, email, phoneNumber, position, isPrimaryContact,
    }, token);
    console.log("[createContactAction] Contact created successfully");
  } catch (err: unknown) {
    console.error("[createContactAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create contact." };
  }

  revalidatePath(`/Client/${clientId}/clientOverView`);
  redirect(`/Client/${clientId}/clientOverView`);
}

/* ══════════════════════════════════════════════════════
   OPPORTUNITIES
══════════════════════════════════════════════════════ */
export async function createOpportunityAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createOpportunityAction] Starting opportunity creation...");
  const token             = formData.get("_token")            as string;
  const title             = formData.get("title")             as string;
  const clientId          = formData.get("clientId")          as string;
  const contactId         = formData.get("contactId")         as string;
  const ownerId           = formData.get("ownerId")           as string;
  const estimatedValue    = formData.get("estimatedValue")    as string;
  const currency          = formData.get("currency")          as string;
  const stage             = formData.get("stage")             as string;
  const source            = formData.get("source")            as string;
  const probability       = formData.get("probability")       as string;
  const expectedCloseDate = formData.get("expectedCloseDate") as string;
  const description       = formData.get("description")       as string;

  const errors: Partial<Record<string, string>> = {};
  if (!title?.trim())     errors.title             = "Title is required.";
  if (!clientId?.trim())  errors.clientId          = "Client ID is required.";
  if (!estimatedValue)    errors.estimatedValue    = "Estimated value is required.";
  if (!stage)             errors.stage             = "Stage is required.";
  if (!expectedCloseDate) errors.expectedCloseDate = "Expected close date is required.";
  if (Object.keys(errors).length) {
    console.log("[createOpportunityAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createOpportunityAction] Calling API with data:", { title, clientId, estimatedValue });
    const data = await apiPost("/opportunities", {
      title, clientId, contactId, ownerId,
      estimatedValue: Number(estimatedValue), currency,
      stage: Number(stage), source: Number(source),
      probability: Number(probability), expectedCloseDate, description,
    }, token);
    console.log("[createOpportunityAction] Success, opportunity ID:", data.id);
    revalidatePath("/opportunities");
    redirect(`/opportunities/${data.id}`);
  } catch (err: unknown) {
    console.error("[createOpportunityAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create opportunity." };
  }
}

/* ══════════════════════════════════════════════════════
   PRICING REQUESTS
══════════════════════════════════════════════════════ */
export async function createPricingRequestAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createPricingRequestAction] Starting pricing request creation...");
  const token          = formData.get("_token")         as string;
  const title          = formData.get("title")          as string;
  const description    = formData.get("description")    as string;
  const clientId       = formData.get("clientId")       as string;
  const opportunityId  = formData.get("opportunityId")  as string;
  const requestedById  = formData.get("requestedById")  as string;
  const priority       = formData.get("priority")       as string;
  const requiredByDate = formData.get("requiredByDate") as string;

  const errors: Partial<Record<string, string>> = {};
  if (!title?.trim())    errors.title          = "Title is required.";
  if (!clientId?.trim()) errors.clientId       = "Client ID is required.";
  if (!requiredByDate)   errors.requiredByDate = "Required by date is required.";
  if (Object.keys(errors).length) {
    console.log("[createPricingRequestAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createPricingRequestAction] Calling API with data:", { title, clientId, priority });
    await apiPost("/pricingrequests", {
      title, description, clientId, opportunityId,
      requestedById, priority: Number(priority), requiredByDate,
    }, token);
    console.log("[createPricingRequestAction] Pricing request created successfully");
  } catch (err: unknown) {
    console.error("[createPricingRequestAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create pricing request." };
  }

  revalidatePath(`/Client/${clientId}`);
  redirect(`/Client/${clientId}`);
}

/* ══════════════════════════════════════════════════════
   CONTRACTS
══════════════════════════════════════════════════════ */
export async function createContractAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createContractAction] Starting contract creation...");
  const token               = formData.get("_token")              as string;
  const clientId            = formData.get("clientId")            as string;
  const opportunityId       = formData.get("opportunityId")       as string;
  const proposalId          = formData.get("proposalId")          as string;
  const title               = formData.get("title")               as string;
  const contractValue       = formData.get("contractValue")       as string;
  const currency            = formData.get("currency")            as string;
  const startDate           = formData.get("startDate")           as string;
  const endDate             = formData.get("endDate")             as string;
  const ownerId             = formData.get("ownerId")             as string;
  const renewalNoticePeriod = formData.get("renewalNoticePeriod") as string;
  const autoRenew           = formData.get("autoRenew") === "true";
  const terms               = formData.get("terms")               as string;

  const errors: Partial<Record<string, string>> = {};
  if (!title?.trim())    errors.title         = "Title is required.";
  if (!clientId?.trim()) errors.clientId      = "Client ID is required.";
  if (!contractValue)    errors.contractValue = "Contract value is required.";
  if (!startDate)        errors.startDate     = "Start date is required.";
  if (!endDate)          errors.endDate       = "End date is required.";
  if (Object.keys(errors).length) {
    console.log("[createContractAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createContractAction] Calling API with data:", { clientId, title, contractValue });
    await apiPost("/contracts", {
      clientId, opportunityId, proposalId, title,
      contractValue: Number(contractValue), currency,
      startDate, endDate, ownerId,
      renewalNoticePeriod: Number(renewalNoticePeriod),
      autoRenew, terms,
    }, token);
    console.log("[createContractAction] Contract created successfully");
  } catch (err: unknown) {
    console.error("[createContractAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create contract." };
  }

  revalidatePath(`/Client/${clientId}`);
  redirect(`/Client/${clientId}`);
}

/* ══════════════════════════════════════════════════════
   RENEWALS
══════════════════════════════════════════════════════ */
export async function createRenewalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createRenewalAction] Starting renewal creation...");
  const token             = formData.get("_token")          as string;
  const contractId        = formData.get("contractId")        as string;
  const clientId          = formData.get("clientId")          as string;
  const proposedStartDate = formData.get("proposedStartDate") as string;
  const proposedEndDate   = formData.get("proposedEndDate")   as string;
  const proposedValue     = formData.get("proposedValue")     as string;
  const notes             = formData.get("notes")             as string;

  const errors: Partial<Record<string, string>> = {};
  if (!contractId?.trim()) errors.contractId        = "Contract ID is required.";
  if (!proposedStartDate)  errors.proposedStartDate = "Proposed start date is required.";
  if (!proposedEndDate)    errors.proposedEndDate   = "Proposed end date is required.";
  if (!proposedValue)      errors.proposedValue     = "Proposed value is required.";
  if (Object.keys(errors).length) {
    console.log("[createRenewalAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createRenewalAction] Calling API with data:", { contractId, proposedValue });
    await apiPost(`/contracts/${contractId}/renewals`, {
      proposedStartDate, proposedEndDate,
      proposedValue: Number(proposedValue), notes,
    }, token);
    console.log("[createRenewalAction] Renewal created successfully");
  } catch (err: unknown) {
    console.error("[createRenewalAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create renewal." };
  }

  revalidatePath(`/Client/${clientId}`);
  redirect(`/Client/${clientId}`);
}

/* ══════════════════════════════════════════════════════
   ACTIVITIES
══════════════════════════════════════════════════════ */
export async function createActivityAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createActivityAction] Starting activity creation...");
  const token         = formData.get("_token")       as string;
  const type          = formData.get("type")          as string;
  const subject       = formData.get("subject")       as string;
  const description   = formData.get("description")   as string;
  const priority      = formData.get("priority")      as string;
  const dueDate       = formData.get("dueDate")       as string;
  const assignedToId  = formData.get("assignedToId")  as string;
  const relatedToType = formData.get("relatedToType") as string;
  const relatedToId   = formData.get("relatedToId")   as string;
  const duration      = formData.get("duration")      as string;
  const location      = formData.get("location")      as string;

  const errors: Partial<Record<string, string>> = {};
  if (!type)            errors.type    = "Activity type is required.";
  if (!subject?.trim()) errors.subject = "Subject is required.";
  if (!dueDate)         errors.dueDate = "Due date is required.";
  if (Object.keys(errors).length) {
    console.log("[createActivityAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createActivityAction] Calling API with data:", { type, subject, priority });
    await apiPost("/activities", {
      type: Number(type), subject, description,
      priority: Number(priority), dueDate, assignedToId,
      relatedToType: Number(relatedToType), relatedToId,
      duration: Number(duration), location,
    }, token);
    console.log("[createActivityAction] Activity created successfully");
  } catch (err: unknown) {
    console.error("[createActivityAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to create activity." };
  }

  revalidatePath("/activities");
  redirect("/activities");
}

/* ══════════════════════════════════════════════════════
   NOTES
══════════════════════════════════════════════════════ */
export async function createNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  console.log("[createNoteAction] Starting note creation...");
  const token         = formData.get("_token")        as string;
  const content       = formData.get("content")       as string;
  const relatedToType = formData.get("relatedToType") as string;
  const relatedToId   = formData.get("relatedToId")   as string;
  const relatedToPath = formData.get("relatedToPath") as string;
  const isPrivate     = formData.get("isPrivate") === "true";

  const errors: Partial<Record<string, string>> = {};
  if (!content?.trim())     errors.content       = "Note content is required.";
  if (!relatedToType)       errors.relatedToType = "Related entity type is required.";
  if (!relatedToId?.trim()) errors.relatedToId   = "Related entity ID is required.";
  if (Object.keys(errors).length) {
    console.log("[createNoteAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[createNoteAction] Calling API with data:", { relatedToType, relatedToId, isPrivate });
    await apiPost("/notes", {
      content, relatedToType: Number(relatedToType), relatedToId, isPrivate,
    }, token);
    console.log("[createNoteAction] Note created successfully");
  } catch (err: unknown) {
    console.error("[createNoteAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to add note." };
  }

  const destination = relatedToPath?.trim() || "/activities";
  revalidatePath(destination);
  redirect(destination);
}

/* ══════════════════════════════════════════════════════
   PROPOSALS
══════════════════════════════════════════════════════ */
export async function submitProposalAction(
  _prevState: ProposalFormState,
  formData: FormData
): Promise<ProposalFormState> {
  console.log("[submitProposalAction] Starting proposal submission...");
  const token            = formData.get("_token")          as string;
  const clientId         = formData.get("clientId")         as string;
  const requestedById    = formData.get("requestedById")    as string;
  const clientName       = formData.get("clientName")       as string;
  const opportunityId    = formData.get("opportunityId")    as string;
  const deadline         = formData.get("deadline")         as string;
  const requirements     = formData.get("requirements")     as string;
  const licenses         = formData.get("licenses")         as string;
  const contractDuration = formData.get("contractDuration") as string;
  const services         = formData.get("services")         as string;
  const attachments      = formData.getAll("attachments")   as File[];

  const scopeItems: string[] = [];
  for (const [key, val] of formData.entries()) {
    if (key.startsWith("scopeItem_") && typeof val === "string" && val.trim()) {
      scopeItems.push(val.trim());
    }
  }

  const errors: Partial<Record<string, string>> = {};
  if (!clientName?.trim())    errors.clientName    = "Client name is required.";
  if (!opportunityId?.trim()) errors.opportunityId = "Opportunity ID is required.";
  if (!deadline)              errors.deadline      = "Deadline is required.";
  if (!requirements?.trim())  errors.requirements  = "Requirements are required.";
  if (Object.keys(errors).length > 0) {
    console.log("[submitProposalAction] Validation errors:", errors);
    return { status: "error", errors };
  }

  try {
    console.log("[submitProposalAction] Calling API with data:", { opportunityId, clientName, scopeItems });
    const data = await apiPost("/proposals", {
      opportunityId, title: clientName, description: requirements,
      validUntil: deadline, licenses, contractDuration, services,
      scopeItems, attachmentCount: attachments.filter(f => f.size > 0).length,
      ...(requestedById ? { requestedById } : {}),
    }, token);
    console.log("[submitProposalAction] Success, proposal ID:", data.id);
    if (clientId?.trim()) {
      revalidatePath(`/Client/${clientId}/clientOverView`);
      redirect(`/Client/${clientId}/clientOverView`);
    }
    revalidatePath("/opportunities");
    redirect(`/proposals/${data.id}`);
  } catch (err: unknown) {
    console.error("[submitProposalAction] Error:", err);
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to submit proposal." };
  }
}

/* ══════════════════════════════════════════════════════
   OPPORTUNITY STAGE ADVANCEMENT
   PUT /opportunities/{id}/stage
══════════════════════════════════════════════════════ */
export async function advanceStageAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token         = formData.get("_token")         as string;
  const opportunityId = formData.get("opportunityId")  as string;
  const stage         = formData.get("stage")          as string;
  const reason        = formData.get("reason")         as string;
  const redirectPath  = formData.get("redirectPath")   as string;

  if (!opportunityId?.trim()) return { status: "error", errors: { opportunityId: "Opportunity ID is required." } };
  if (!stage)                 return { status: "error", errors: { stage: "Stage is required." } };

  try {
    await apiPut(`/opportunities/${opportunityId}/stage`, { stage: Number(stage), reason }, token);
    revalidatePath(redirectPath?.trim() || "/");
    return { status: "success", message: "Stage updated." };
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to advance stage." };
  }
}

/* ══════════════════════════════════════════════════════
   PRICING REQUEST — ASSIGN
   POST /pricingrequests/{id}/assign
══════════════════════════════════════════════════════ */
export async function assignPricingRequestAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token            = formData.get("_token")           as string;
  const pricingRequestId = formData.get("pricingRequestId") as string;
  const assignedToId     = formData.get("assignedToId")     as string;
  const clientId         = formData.get("clientId")         as string;

  if (!pricingRequestId?.trim()) return { status: "error", errors: { pricingRequestId: "Pricing request ID is required." } };
  if (!assignedToId?.trim())     return { status: "error", errors: { assignedToId: "Assignee is required." } };

  try {
    await apiPost(`/pricingrequests/${pricingRequestId}/assign`, { assignedToId }, token);
    if (clientId) revalidatePath(`/Client/${clientId}`);
    return { status: "success", message: "Pricing request assigned." };
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to assign pricing request." };
  }
}

/* ══════════════════════════════════════════════════════
   PROPOSAL — APPROVE
   PUT /proposals/{id}/approve
══════════════════════════════════════════════════════ */
export async function approveProposalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token      = formData.get("_token")     as string;
  const proposalId = formData.get("proposalId") as string;
  const comment    = formData.get("comment")    as string;

  if (!proposalId?.trim()) return { status: "error", errors: { proposalId: "Proposal ID is required." } };

  try {
    await apiPut(`/proposals/${proposalId}/approve`, comment ? { comment } : {}, token);
    revalidatePath(`/proposals/${proposalId}`);
    return { status: "success", message: "Proposal approved." };
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to approve proposal." };
  }
}

/* ══════════════════════════════════════════════════════
   CONTRACT — ACTIVATE
   PUT /contracts/{id}/activate
══════════════════════════════════════════════════════ */
export async function activateContractAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token      = formData.get("_token")     as string;
  const contractId = formData.get("contractId") as string;
  const clientId   = formData.get("clientId")   as string;

  if (!contractId?.trim()) return { status: "error", errors: { contractId: "Contract ID is required." } };

  try {
    await apiPut(`/contracts/${contractId}/activate`, {}, token);
    if (clientId) revalidatePath(`/Client/${clientId}`);
    revalidatePath(`/contracts`);
    return { status: "success", message: "Contract activated." };
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to activate contract." };
  }
}

/* ══════════════════════════════════════════════════════
   RENEWAL — COMPLETE
   PUT /contracts/renewals/{renewalId}/complete
══════════════════════════════════════════════════════ */
export async function completeRenewalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const token      = formData.get("_token")      as string;
  const renewalId  = formData.get("renewalId")   as string;
  const contractId = formData.get("contractId")  as string;
  const clientId   = formData.get("clientId")    as string;

  if (!renewalId?.trim()) return { status: "error", errors: { renewalId: "Renewal ID is required." } };

  try {
    await apiPut(`/contracts/renewals/${renewalId}/complete`, {}, token);
    if (contractId) revalidatePath(`/contracts/${contractId}`);
    if (clientId)   revalidatePath(`/Client/${clientId}`);
    return { status: "success", message: "Renewal completed." };
  } catch (err: unknown) {
    const e = err as { data?: { message?: string } };
    return { status: "error", message: e.data?.message ?? "Failed to complete renewal." };
  }
}