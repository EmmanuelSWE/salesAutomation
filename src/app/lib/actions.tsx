"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IUser } from "./providers/context";

export type ProposalFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

export async function submitProposalAction(
  _prevState: ProposalFormState,
  formData: FormData
): Promise<ProposalFormState> {
  /* ── Extract fields ── */
  const clientName       = formData.get("clientName") as string;
  const opportunityId    = formData.get("opportunityId") as string;
  const deadline         = formData.get("deadline") as string;
  const requirements     = formData.get("requirements") as string;
  const licenses         = formData.get("licenses") as string;
  const contractDuration = formData.get("contractDuration") as string;
  const services         = formData.get("services") as string;
  const attachments      = formData.getAll("attachments") as File[];

  // Scope items — submitted as scopeItem_0, scopeItem_1 ...
  const scopeItems: string[] = [];
  for (const [key, val] of formData.entries()) {
    if (key.startsWith("scopeItem_") && typeof val === "string" && val.trim()) {
      scopeItems.push(val.trim());
    }
  }

  /* ── Validation ── */
  const errors: Partial<Record<string, string>> = {};
  if (!clientName?.trim())    errors.clientName    = "Client name is required.";
  if (!opportunityId?.trim()) errors.opportunityId = "Opportunity ID is required.";
  if (!deadline)              errors.deadline      = "Deadline is required.";
  if (!requirements?.trim())  errors.requirements  = "Requirements are required.";

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  /* ── Business logic (replace with DB/API call) ── */
  console.log("Proposal submitted:", {
    clientName, opportunityId, deadline,
    requirements, scopeItems, licenses,
    contractDuration, services,
    attachmentCount: attachments.filter((f) => f.size > 0).length,
  });

  // TODO: await db.proposals.create({ ... })

  revalidatePath("/submitProposal");
  // TODO: fetch opportunity to get clientId, then redirect("/Client/" + clientId)
  return { status: "success", message: "Proposal submitted successfully!" };
}






export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

/* ─── POST /api/contacts ─────────────────────────────── */
export async function createContactAction(_prev: FormState, formData: FormData): Promise<FormState> {
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
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/contacts`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ clientId, firstName, lastName, email, phoneNumber, position, isPrimaryContact }) });
  console.log("createContact:", { clientId, firstName, lastName, email, phoneNumber, position, isPrimaryContact });
  revalidatePath(`/Client/${clientId}`);
  redirect(`/Client/${clientId}`);
}

/* ─── POST /api/opportunities ────────────────────────── */
export async function createOpportunityAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const title             = formData.get("title")             as string;
  const clientId          = formData.get("clientId")          as string;
  const contactId         = formData.get("contactId")         as string;
  const estimatedValue    = formData.get("estimatedValue")    as string;
  const currency          = formData.get("currency")          as string;
  const stage             = formData.get("stage")             as string;
  const source            = formData.get("source")            as string;
  const probability       = formData.get("probability")       as string;
  const expectedCloseDate = formData.get("expectedCloseDate") as string;
  const description       = formData.get("description")       as string;

  const errors: Partial<Record<string, string>> = {};
  if (!title?.trim())       errors.title            = "Title is required.";
  if (!clientId?.trim())    errors.clientId         = "Client ID is required.";
  if (!estimatedValue)      errors.estimatedValue   = "Estimated value is required.";
  if (!stage)               errors.stage            = "Stage is required.";
  if (!expectedCloseDate)   errors.expectedCloseDate = "Expected close date is required.";
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/opportunities`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ title, clientId, contactId, estimatedValue: Number(estimatedValue), currency, stage: Number(stage), source: Number(source), probability: Number(probability), expectedCloseDate, description }) });
  console.log("createOpportunity:", { title, clientId, contactId, estimatedValue: Number(estimatedValue), currency, stage: Number(stage), source: Number(source), probability: Number(probability), expectedCloseDate, description });
  revalidatePath("/opportunities");
  redirect("/opportunities");
}

/* ─── POST /api/pricingrequests ──────────────────────── */
export async function createPricingRequestAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const title          = formData.get("title")          as string;
  const description    = formData.get("description")    as string;
  const clientId       = formData.get("clientId")       as string;
  const opportunityId  = formData.get("opportunityId")  as string;
  const requestedById  = formData.get("requestedById")  as string;
  const priority       = formData.get("priority")       as string;
  const requiredByDate = formData.get("requiredByDate") as string;

  const errors: Partial<Record<string, string>> = {};
  if (!title?.trim())    errors.title         = "Title is required.";
  if (!clientId?.trim()) errors.clientId      = "Client ID is required.";
  if (!requiredByDate)   errors.requiredByDate = "Required by date is required.";
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/pricingrequests`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ title, description, clientId, opportunityId, requestedById, priority: Number(priority), requiredByDate }) });
  console.log("createPricingRequest:", { title, description, clientId, opportunityId, requestedById, priority: Number(priority), requiredByDate });
  revalidatePath(`/Client/${clientId}`);
  redirect(`/Client/${clientId}`);
}

/* ─── POST /api/contracts ────────────────────────────── */
export async function createContractAction(_prev: FormState, formData: FormData): Promise<FormState> {
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
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/contracts`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ clientId, opportunityId, proposalId, title, contractValue: Number(contractValue), currency, startDate, endDate, ownerId, renewalNoticePeriod: Number(renewalNoticePeriod), autoRenew, terms }) });
  console.log("createContract:", { clientId, opportunityId, proposalId, title, contractValue: Number(contractValue), currency, startDate, endDate, ownerId, renewalNoticePeriod: Number(renewalNoticePeriod), autoRenew, terms });
  revalidatePath(`/Client/${clientId}`);
  redirect(`/Client/${clientId}`);
}

/* ─── POST /api/contracts/{contractId}/renewals ──────── */
export async function createRenewalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const contractId        = formData.get("contractId")        as string;
  const proposedStartDate = formData.get("proposedStartDate") as string;
  const proposedEndDate   = formData.get("proposedEndDate")   as string;
  const proposedValue     = formData.get("proposedValue")     as string;
  const notes             = formData.get("notes")             as string;

  const errors: Partial<Record<string, string>> = {};
  if (!contractId?.trim())  errors.contractId        = "Contract ID is required.";
  if (!proposedStartDate)   errors.proposedStartDate = "Proposed start date is required.";
  if (!proposedEndDate)     errors.proposedEndDate   = "Proposed end date is required.";
  if (!proposedValue)       errors.proposedValue     = "Proposed value is required.";
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/contracts/${contractId}/renewals`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ proposedStartDate, proposedEndDate, proposedValue: Number(proposedValue), notes }) });
  console.log("createRenewal:", { contractId, proposedStartDate, proposedEndDate, proposedValue: Number(proposedValue), notes });
  revalidatePath(`/Client/[clientId]`);
  // TODO: fetch contract to get clientId, then redirect("/Client/" + clientId)
  return { status: "success", message: "Renewal created successfully." };
}

/* ─── POST /api/activities ───────────────────────────── */
export async function createActivityAction(_prev: FormState, formData: FormData): Promise<FormState> {
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
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/activities`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ type: Number(type), subject, description, priority: Number(priority), dueDate, assignedToId, relatedToType: Number(relatedToType), relatedToId, duration: Number(duration), location }) });
  console.log("createActivity:", { type: Number(type), subject, description, priority: Number(priority), dueDate, assignedToId, relatedToType: Number(relatedToType), relatedToId, duration: Number(duration), location });
  revalidatePath("/activities");
  redirect("/activities");
}

/* ─── POST /api/notes ────────────────────────────────── */
export async function createNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const content       = formData.get("content")       as string;
  const relatedToType = formData.get("relatedToType") as string;
  const relatedToId   = formData.get("relatedToId")   as string;
  const isPrivate     = formData.get("isPrivate") === "true";

  const errors: Partial<Record<string, string>> = {};
  if (!content?.trim())     errors.content      = "Note content is required.";
  if (!relatedToType)       errors.relatedToType = "Related entity type is required.";
  if (!relatedToId?.trim()) errors.relatedToId  = "Related entity ID is required.";
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/notes`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ content, relatedToType: Number(relatedToType), relatedToId, isPrivate }) });
  console.log("createNote:", { content, relatedToType: Number(relatedToType), relatedToId, isPrivate });
  revalidatePath(`/Client/${relatedToId}`);
  // TODO: Determine actual entity type and redirect accordingly (Client, Opportunity, etc.)
  redirect(`/Client/${relatedToId}`);
}

/* ─── POST /api/clients ──────────────────────────────── */
export async function createClientAction(_prev: FormState, formData: FormData): Promise<FormState> {
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
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: await fetch(`${process.env.API_BASE_URL}/api/clients`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name, industry, clientType: Number(clientType), website, billingAddress, taxNumber, companySize }) });
  console.log("createClient:", { name, industry, clientType: Number(clientType), website, billingAddress, taxNumber, companySize });
  revalidatePath("/clients");
  // TODO: Get newClientId from API response, then redirect("/Client/" + newClientId)
  return { status: "success", message: `Client "${name}" created.` };
}


export type LoginFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  email?: string;
  password?: string;
  errors?: Partial<Record<string, string>>;
};

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;

  const errors: Partial<Record<string, string>> = {};
  if (!email?.trim())    errors.email    = "Email is required.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!password?.trim()) errors.password = "Password is required.";
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: Call login API with email and password
  // TODO: Store auth token in cookies
  // On success, redirect to dashboard
  redirect("/admin");
}


export type RegisterFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  user?: IUser;
  errors?: Partial<Record<string, string>>;
};

export async function registerAction(
  _prev: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const firstName       = formData.get("firstName")       as string;
  const lastName        = formData.get("lastName")        as string;
  const email           = formData.get("email")           as string;
  const password        = formData.get("password")        as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const errors: Partial<Record<string, string>> = {};
  if (!firstName?.trim())  errors.firstName = "First name is required.";
  if (!lastName?.trim())   errors.lastName  = "Last name is required.";
  if (!email?.trim())      errors.email     = "Email is required.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!password?.trim())   errors.password  = "Password is required.";
  if (password && password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (password !== confirmPassword)    errors.confirmPassword = "Passwords do not match.";
  if (Object.keys(errors).length) return { status: "error", errors };

  // TODO: Call registration API to create user
  // On success, redirect to login page
  redirect("/login");
}