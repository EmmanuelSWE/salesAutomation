"use server";

import { revalidatePath } from "next/cache";

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
  return { status: "success", message: "Proposal submitted successfully!" };
}





export type CreateClientFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
};

export async function createClientAction(
  _prevState: CreateClientFormState,
  formData: FormData
): Promise<CreateClientFormState> {
  /* ── Extract fields ── */
  const name           = formData.get("name")           as string;
  const industry       = formData.get("industry")       as string;
  const clientType     = formData.get("clientType")     as string;
  const website        = formData.get("website")        as string;
  const billingAddress = formData.get("billingAddress") as string;
  const taxNumber      = formData.get("taxNumber")      as string;
  const companySize    = formData.get("companySize")    as string;

  /* ── Validation ── */
  const errors: Partial<Record<string, string>> = {};
  if (!name?.trim())           errors.name           = "Company name is required.";
  if (!industry?.trim())       errors.industry       = "Industry is required.";
  if (!clientType)             errors.clientType     = "Client type is required.";
  if (!billingAddress?.trim()) errors.billingAddress = "Billing address is required.";

  if (website && !/^https?:\/\/.+/.test(website)) {
    errors.website = "Website must start with http:// or https://";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  /* ── POST to /api/clients ── */
  // TODO: replace with your real fetch:
  // const res = await fetch(`${process.env.API_BASE_URL}/api/clients`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ name, industry, clientType: Number(clientType), website, billingAddress, taxNumber, companySize }),
  // });
  // if (!res.ok) return { status: "error", message: "Failed to create client." };

  console.log("Creating client:", {
    name, industry,
    clientType: Number(clientType),
    website, billingAddress, taxNumber, companySize,
  });

  revalidatePath("/admin/clients");
  return { status: "success", message: `Client "${name}" created successfully!` };
}