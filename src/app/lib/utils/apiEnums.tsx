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