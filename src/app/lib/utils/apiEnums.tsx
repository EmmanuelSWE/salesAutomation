/* ══════════════════════════════════════════════════════
   ENUMS — string literal unions
   Use these as field types across all context interfaces
══════════════════════════════════════════════════════ */

export type ClientType =
  | "Government"
  | "Private"
  | "Partner";

export type OpportunityStage =
  | "Lead"
  | "Qualified"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export type OpportunitySource =
  | "Inbound"
  | "Outbound"
  | "Referral"
  | "Partner"
  | "RFP";

export type ProposalStatus =
  | "Draft"
  | "Submitted"
  | "Rejected"
  | "Approved";

export type PricingRequestStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export type ContractStatus =
  | "Draft"
  | "Active"
  | "Expired"
  | "Renewed"
  | "Cancelled";

export type ActivityType =
  | "Meeting"
  | "Call"
  | "Email"
  | "Task"
  | "Presentation"
  | "Other";

export type ActivityStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export type Priority =
  | "Low"
  | "Medium"
  | "High"
  | "Urgent";

export type DocumentCategory =
  | "Contract"
  | "Proposal"
  | "Presentation"
  | "Quote"
  | "Report"
  | "Other";

export type RelatedToType =
  | "Client"
  | "Opportunity"
  | "Proposal"
  | "Contract"
  | "Activity";

/* ══════════════════════════════════════════════════════
   NUMERIC ENUM MAPS
   The API accepts integers on all write operations
   (POST / PUT). Use these to convert string labels
   before sending any activity payload.
══════════════════════════════════════════════════════ */
export const CLIENT_TYPE_NUM: Record<string, number> = {
  Government: 1, Private: 2, Partner: 3,
};

export const ACTIVITY_TYPE_NUM: Record<string, number> = {
  Meeting: 1, Call: 2, Email: 3, Task: 4, Presentation: 5, Other: 6,
};

export const PRIORITY_NUM: Record<string, number> = {
  Low: 1, Medium: 2, High: 3, Urgent: 4,
};

export const RELATED_TO_TYPE_NUM: Record<string, number> = {
  Client: 1, Opportunity: 2, Proposal: 3, Contract: 4, Activity: 5,
};

export const OPPORTUNITY_STAGE_NUM: Record<string, number> = {
  // API canonical names — must match what GET /api/opportunities returns for stage
  Lead:          1,
  Qualified:     2,
  Proposal:      3,
  Negotiation:   4,
  "Closed Won":  5,
  "Closed Lost": 6,
};

export const OPPORTUNITY_SOURCE_NUM: Record<string, number> = {
  Inbound:  1,
  Outbound: 2,
  Referral: 3,
  Partner:  4,
  RFP:      5,
};