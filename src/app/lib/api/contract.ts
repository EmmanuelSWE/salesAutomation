/**
 * contract.ts
 *
 * Single source of truth for every API request/response shape.
 * Derived directly from TEST-REPORT.md (26 Feb 2026, 89/89 PASS).
 *
 * Rules:
 *  - Paged list endpoints   → zPaged(zEntity)
 *  - Direct-array endpoints → z.array(zEntity)
 *  - Object endpoints       → named object schema
 *  - Mutation bodies        → zCreate* / zUpdate* / zStage* schemas
 *  - No-body endpoints      → callers pass `undefined`; no schema needed
 */

import { z } from "zod";

/* ══════════════════════════════════════════════════════
   SHARED FACTORY — paged envelope
   GET /clients, /opportunities, /proposals, etc.
══════════════════════════════════════════════════════ */
export function zPaged<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    items:       z.array(itemSchema),
    pageNumber:  z.number().int(),
    pageSize:    z.number().int(),
    totalCount:  z.number().int(),
    totalPages:  z.number().int().optional(),
    hasNextPage: z.boolean().optional(),
  });
}

export type Paged<T> = {
  items:       T[];
  pageNumber:  number;
  pageSize:    number;
  totalCount:  number;
  totalPages?: number;
  hasNextPage?: boolean;
};

/* ══════════════════════════════════════════════════════
   STRING ENUM LITERALS  (matching context.tsx unions)
══════════════════════════════════════════════════════ */
const zClientType         = z.enum(["Government", "Private", "Partner"]);
const zOpportunityStage   = z.enum(["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]);
const zOpportunitySource  = z.enum(["Inbound", "Outbound", "Referral", "Partner", "RFP"]);
const zProposalStatus     = z.enum(["Draft", "Submitted", "Approved", "Rejected"]);
const zPricingStatus      = z.enum(["Pending", "In Progress", "Completed"]);
const zContractStatus     = z.enum(["Draft", "Active", "Expired", "Renewed", "Cancelled"]);
const zActivityType       = z.enum(["Meeting", "Call", "Email", "Task", "Presentation", "Other"]);
const zActivityStatus     = z.enum(["Scheduled", "Completed", "Cancelled"]);
const zPriority           = z.enum(["Low", "Medium", "High", "Urgent"]);
const zRelatedToType      = z.enum(["Client", "Opportunity", "Proposal", "Contract", "Activity"]);

/* ══════════════════════════════════════════════════════
   AUTH — §1.2 / §1.3 / §1.4 / §1.7
══════════════════════════════════════════════════════ */
export const zLoginRequest = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export const zLoginResponse = z.object({
  token:     z.string(),
  userId:    z.string().uuid(),
  email:     z.string().email(),
  firstName: z.string(),
  lastName:  z.string(),
  roles:     z.array(z.string()),
  tenantId:  z.string().uuid(),
  expiresAt: z.string(),
});

export const zRegisterRequest = z.object({
  email:      z.string().email(),
  password:   z.string().min(6),
  firstName:  z.string().min(1),
  lastName:   z.string().min(1),
  phoneNumber: z.string().optional(),
  tenantName: z.string().optional(),
  tenantId:   z.string().uuid().optional(),
  role:       z.string().optional(),
});

export type LoginRequest    = z.infer<typeof zLoginRequest>;
export type LoginResponse   = z.infer<typeof zLoginResponse>;
export type RegisterRequest = z.infer<typeof zRegisterRequest>;

/* ══════════════════════════════════════════════════════
   USER  — §1.x
══════════════════════════════════════════════════════ */
export const zUser = z.object({
  id:          z.string().uuid().optional(),
  email:       z.string().email(),
  firstName:   z.string(),
  lastName:    z.string(),
  phoneNumber: z.string().optional().nullable(),
  role:        z.string().optional().nullable(),
  roles:       z.array(z.string()).optional(),
  isActive:    z.boolean().optional(),
  tenantId:    z.string().uuid().optional().nullable(),
  tenant:      z.object({ id: z.string(), name: z.string().optional() }).optional().nullable(),
  createdAt:   z.string().optional().nullable(),
  updatedAt:   z.string().optional().nullable(),
});

export const zUsersResponse  = zPaged(zUser);
export type  User            = z.infer<typeof zUser>;

/* ══════════════════════════════════════════════════════
   CLIENT  — §2
══════════════════════════════════════════════════════ */
export const zClient = z.object({
  id:                  z.string().uuid().optional(),
  name:                z.string().min(1),
  industry:            z.string(),
  clientType:          z.union([zClientType, z.number().int()]),  // GET returns int (1=Gov,2=Private,3=Partner)
  website:             z.string().optional().nullable(),
  billingAddress:      z.string().optional().nullable(),
  taxNumber:           z.string().optional().nullable(),
  companySize:         z.string().optional().nullable(),
  isActive:            z.boolean().optional(),
  createdById:         z.string().uuid().optional().nullable(),
  createdByName:       z.string().optional().nullable(),
  createdAt:           z.string().optional().nullable(),
  updatedAt:           z.string().optional().nullable(),
  contactsCount:       z.number().int().optional(),
  opportunitiesCount:  z.number().int().optional(),
  contractsCount:      z.number().int().optional(),
});

/** POST /api/clients — §2.1 */
export const zCreateClient = z.object({
  name:           z.string().min(1),
  industry:       z.string().min(1),
  clientType:     z.number().int().min(1).max(3), // numeric at wire level
  companySize:    z.string().optional(),
  website:        z.string().url().optional().or(z.literal("")),
  billingAddress: z.string().optional(),
  taxNumber:      z.string().optional(),
});

/** GET /api/clients/{id}/stats — §2.5 */
export const zClientStats = z.object({
  clientId:             z.string().uuid(),
  clientName:           z.string(),
  totalOpportunities:   z.number().int(),
  activeOpportunities:  z.number().int(),
  totalContracts:       z.number().int(),
  totalContractValue:   z.number(),
});

export const zClientsResponse = zPaged(zClient);
export type  Client           = z.infer<typeof zClient>;
export type  ClientStats      = z.infer<typeof zClientStats>;
export type  CreateClient     = z.infer<typeof zCreateClient>;

/* ══════════════════════════════════════════════════════
   CONTACT  — §3
══════════════════════════════════════════════════════ */
export const zContact = z.object({
  id:               z.string().uuid().optional(),
  clientId:         z.string().uuid(),
  firstName:        z.string().min(1),
  lastName:         z.string().min(1),
  email:            z.string().email(),
  phoneNumber:      z.string().optional().nullable(),
  position:         z.string().optional().nullable(),
  isPrimaryContact: z.boolean().optional(),
  createdAt:        z.string().optional().nullable(),
  updatedAt:        z.string().optional().nullable(),
});

/** POST /api/contacts — §3.1 */
export const zCreateContact = z.object({
  clientId:         z.string().uuid(),
  firstName:        z.string().min(1),
  lastName:         z.string().min(1),
  email:            z.string().email(),
  phoneNumber:      z.string().optional(),
  position:         z.string().optional(),
  isPrimaryContact: z.boolean().optional(),
});

export const zContactsResponse    = zPaged(zContact);
export const zContactsArrayResponse = z.array(zContact); // /contacts/by-client/{id}
export type  Contact              = z.infer<typeof zContact>;
export type  CreateContact        = z.infer<typeof zCreateContact>;

/* ══════════════════════════════════════════════════════
   OPPORTUNITY  — §4
══════════════════════════════════════════════════════ */
export const zOpportunity = z.object({
  id:                  z.string().uuid().optional(),
  title:               z.string().min(1),
  clientId:            z.string().uuid(),
  contactId:           z.string().uuid().optional().nullable(),
  estimatedValue:      z.number(),
  currency:            z.string().min(1),
  stage:               z.union([zOpportunityStage, z.number().int()]), // GET returns string name; POST/PUT use int
  source:              z.union([zOpportunitySource, z.number().int()]).optional().nullable(),
  probability:         z.number().min(0).max(100).optional().nullable(),
  expectedCloseDate:   z.string(),
  description:         z.string().optional().nullable(),
  assignedToId:        z.string().uuid().optional().nullable(),
  createdAt:           z.string().optional().nullable(),
  updatedAt:           z.string().optional().nullable(),
});

export const zStageHistoryEntry = z.object({
  id:         z.string().uuid(),
  fromStage:  z.union([zOpportunityStage, z.number().int()]).optional().nullable(),
  toStage:    z.union([zOpportunityStage, z.number().int()]),
  notes:      z.string().optional().nullable(),
  lossReason: z.string().optional().nullable(),
  changedAt:  z.string(),
});

/** PUT /api/opportunities/{id}/stage — §4.6
 *  stage: int, notes: string|null, lossReason: required string when stage===6 */
export const zStageBody = z.object({
  stage:      z.number().int().min(1).max(6),
  notes:      z.string().nullable().optional(),
  lossReason: z.string().nullable().optional(),
}).superRefine((val, ctx) => {
  if (val.stage === 6 && !val.lossReason) {
    ctx.addIssue({
      code:    z.ZodIssueCode.custom,
      path:    ["lossReason"],
      message: "lossReason is required when stage is Closed Lost (6)",
    });
  }
});

/** POST /api/opportunities — §4.1 */
export const zCreateOpportunity = z.object({
  title:             z.string().min(1),
  clientId:          z.string().uuid(),
  ownerId:           z.string().uuid().optional(),
  estimatedValue:    z.number().min(0),
  currency:          z.string().min(1),
  probability:       z.number().min(0).max(100).optional(),
  stage:             z.number().int().min(1).max(6),
  source:            z.number().int().min(1).max(5).optional(),
  expectedCloseDate: z.string(), // ISO datetime
  description:       z.string().optional(),
});

/** POST /api/opportunities/{id}/assign — §4.8 */
export const zAssignBody = z.object({
  userId: z.string().uuid(),
});

export const zPipelineStage = z.object({
  stage:      z.number().int(),
  stageName:  z.string(),
  count:      z.number().int(),
  totalValue: z.number(),
});

/** GET /api/opportunities/pipeline — §4.5 */
export const zPipelineMetrics = z.object({
  stages:                z.array(zPipelineStage),
  weightedPipelineValue: z.number(),
  conversionRate:        z.number().optional(), // present per §4.5 but may be 0/null
});

export const zOpportunitiesResponse       = zPaged(zOpportunity);
export const zStageHistoryArrayResponse   = z.array(zStageHistoryEntry);
export type  Opportunity                  = z.infer<typeof zOpportunity>;
export type  StageBody                    = z.infer<typeof zStageBody>;
export type  PipelineMetrics              = z.infer<typeof zPipelineMetrics>;
export type  PipelineStage                = z.infer<typeof zPipelineStage>;
export type  CreateOpportunity            = z.infer<typeof zCreateOpportunity>;

/* ══════════════════════════════════════════════════════
   PROPOSAL  — §5
══════════════════════════════════════════════════════ */
export const zProposalLineItem = z.object({
  id:                 z.string().uuid().optional(),
  productServiceName: z.string().min(1),
  description:        z.string().optional().nullable(),
  quantity:           z.number().min(0),
  unitPrice:          z.number().min(0),
  discount:           z.number().min(0).max(100).optional().nullable(),
  taxRate:            z.number().min(0).optional().nullable(),
  lineTotal:          z.number().optional().nullable(), // server-computed
});

export const zProposal = z.object({
  id:            z.string().uuid().optional(),
  opportunityId: z.string().uuid(),
  clientId:      z.string().uuid().optional(),
  title:         z.string().min(1),
  description:   z.string().optional().nullable(),
  currency:      z.string().min(1),
  validUntil:    z.string(),
  status:        zProposalStatus.optional(),
  lineItems:     z.array(zProposalLineItem).optional(),
  scopeItems:    z.array(z.string()).optional().nullable(),
  createdAt:     z.string().optional().nullable(),
  updatedAt:     z.string().optional().nullable(),
});

/** POST /api/proposals — §5.1 */
export const zCreateProposal = z.object({
  opportunityId: z.string().uuid(),
  title:         z.string().min(1),
  description:   z.string().optional(),
  currency:      z.string().min(1),
  validUntil:    z.string(), // ISO datetime
  lineItems:     z.array(z.object({
    productServiceName: z.string().min(1),
    description:        z.string().optional(),
    quantity:           z.number().min(0),
    unitPrice:          z.number().min(0),
    discount:           z.number().min(0).max(100).optional(),
    taxRate:            z.number().min(0).optional(),
  })).optional(),
});

/** POST /api/proposals/{id}/line-items — §5.5 */
export const zCreateLineItem = z.object({
  productServiceName: z.string().min(1),
  description:        z.string().optional(),
  quantity:           z.number().min(0),
  unitPrice:          z.number().min(0),
  discount:           z.number().min(0).max(100).optional(),
  taxRate:            z.number().min(0).optional(),
});

export const zProposalsResponse = zPaged(zProposal);
export type  Proposal           = z.infer<typeof zProposal>;
export type  ProposalLineItem   = z.infer<typeof zProposalLineItem>;
export type  CreateProposal     = z.infer<typeof zCreateProposal>;
export type  CreateLineItem     = z.infer<typeof zCreateLineItem>;

/* ══════════════════════════════════════════════════════
   PRICING REQUEST  — §6
══════════════════════════════════════════════════════ */
export const zPricingRequest = z.object({
  id:             z.string().uuid().optional(),
  title:          z.string().min(1),
  description:    z.string().optional().nullable(),
  clientId:       z.string().uuid().optional().nullable(),
  opportunityId:  z.string().uuid().optional().nullable(),
  requestedById:  z.string().uuid().optional().nullable(),
  assignedToId:   z.string().uuid().optional().nullable(),
  priority:       z.union([zPriority, z.number().int()]),    // GET returns int (1=Low…4=Urgent)
  requiredByDate: z.string(),
  status:         zPricingStatus.optional(),
  createdAt:      z.string().optional().nullable(),
  updatedAt:      z.string().optional().nullable(),
});

/** POST /api/pricingrequests — §6.1 */
export const zCreatePricingRequest = z.object({
  opportunityId:  z.string().uuid().optional(),
  title:          z.string().min(1),
  description:    z.string().optional(),
  priority:       z.number().int().min(1).max(4), // numeric at wire level
  assignedToId:   z.string().uuid().optional(),
  requiredByDate: z.string(), // ISO datetime
});

/** PUT /api/pricingrequests/{id} — §6.7 */
export const zUpdatePricingRequest = z.object({
  title:          z.string().min(1).optional(),
  description:    z.string().optional(),
  priority:       z.number().int().min(1).max(4).optional(),
  requiredByDate: z.string().optional(),
});

/** POST /api/pricingrequests/{id}/assign — §6.8 */
export const zAssignPricingRequest = z.object({
  userId: z.string().uuid(),
});

// PUT /api/pricingrequests/{id}/complete — §6.9 → NO body

export const zPricingRequestsResponse = zPaged(zPricingRequest);
export type  PricingRequest           = z.infer<typeof zPricingRequest>;
export type  CreatePricingRequest     = z.infer<typeof zCreatePricingRequest>;

/* ══════════════════════════════════════════════════════
   CONTRACT  — §7
══════════════════════════════════════════════════════ */
export const zContract = z.object({
  id:                   z.string().uuid().optional(),
  clientId:             z.string().uuid(),
  opportunityId:        z.string().uuid().optional().nullable(),
  proposalId:           z.string().uuid().optional().nullable(),
  title:                z.string().min(1),
  contractValue:        z.number(),
  currency:             z.string().min(1),
  startDate:            z.string(),
  endDate:              z.string(),
  ownerId:              z.string().uuid().optional().nullable(),
  renewalNoticePeriod:  z.number().int().optional().nullable(),
  autoRenew:            z.boolean().optional(),
  terms:                z.string().optional().nullable(),
  status:               zContractStatus.optional(),
  isExpiringSoon:       z.boolean().optional(),
  daysUntilExpiry:      z.number().int().optional().nullable(),
  createdAt:            z.string().optional().nullable(),
  updatedAt:            z.string().optional().nullable(),
});

export const zContractRenewal = z.object({
  id:                    z.string().uuid().optional(),
  contractId:            z.string().uuid().optional().nullable(),
  renewalOpportunityId:  z.string().uuid().nullable().optional(),
  notes:                 z.string().optional().nullable(),
  createdAt:             z.string().optional().nullable(),
});

/** POST /api/contracts — §7.1 */
export const zCreateContract = z.object({
  clientId:             z.string().uuid(),
  opportunityId:        z.string().uuid().optional(),
  proposalId:           z.string().uuid().optional(),
  title:                z.string().min(1),
  contractValue:        z.number().min(0),
  currency:             z.string().min(1),
  startDate:            z.string(),
  endDate:              z.string(),
  ownerId:              z.string().uuid().optional(),
  renewalNoticePeriod:  z.number().int().min(0).optional(),
  autoRenew:            z.boolean().optional(),
  terms:                z.string().optional(),
});

/** POST /api/contracts/{contractId}/renewals — §7.9 */
export const zCreateRenewal = z.object({
  renewalOpportunityId: z.string().uuid().nullable().optional(),
  notes:                z.string().optional(),
});

// GET /contracts/expiring, /contracts/client/{id} → direct arrays
export const zContractsResponse      = zPaged(zContract);
export const zContractsArrayResponse = z.array(zContract);
export const zRenewalsArrayResponse  = z.array(zContractRenewal);
export type  Contract                = z.infer<typeof zContract>;
export type  ContractRenewal         = z.infer<typeof zContractRenewal>;
export type  CreateContract          = z.infer<typeof zCreateContract>;

/* ══════════════════════════════════════════════════════
   ACTIVITY  — §8
══════════════════════════════════════════════════════ */
export const zActivity = z.object({
  id:            z.string().uuid().optional(),
  type:          z.union([zActivityType, z.number().int()]),     // int on wire (write), string in GET
  subject:       z.string().min(1),
  description:   z.string().optional().nullable(),
  priority:      z.union([zPriority, z.number().int()]).optional().nullable(),
  dueDate:       z.string(),
  assignedToId:  z.string().uuid().optional().nullable(),
  relatedToType: z.union([zRelatedToType, z.number().int()]).optional().nullable(),
  relatedToId:   z.string().uuid().optional().nullable(),
  duration:      z.number().int().optional().nullable(),
  location:      z.string().optional().nullable(),
  status:        zActivityStatus.optional(),
  outcome:       z.string().optional().nullable(),
  createdAt:     z.string().optional().nullable(),
  updatedAt:     z.string().optional().nullable(),
});

/** POST /api/activities — §8.1 (all enums as integers) */
export const zCreateActivity = z.object({
  type:          z.number().int().min(1).max(6),
  subject:       z.string().min(1),
  description:   z.string().optional(),
  priority:      z.number().int().min(1).max(4).optional(),
  dueDate:       z.string(), // ISO datetime
  assignedToId:  z.string().uuid().optional(),
  relatedToType: z.number().int().min(1).max(5).optional(),
  relatedToId:   z.string().uuid().optional(),
  duration:      z.number().int().optional(),
  location:      z.string().optional(),
});

/** PUT /api/activities/{id}/complete — §8.8 */
export const zCompleteActivity = z.object({
  outcome: z.string().min(1),
});

// PUT /api/activities/{id}/cancel — §8.9 → NO body

export const zActivitiesResponse      = zPaged(zActivity);
export const zActivitiesArrayResponse = z.array(zActivity); // /activities/overdue
export type  Activity                 = z.infer<typeof zActivity>;
export type  CreateActivity           = z.infer<typeof zCreateActivity>;

/* ══════════════════════════════════════════════════════
   NOTES  — §10
══════════════════════════════════════════════════════ */
export const zNote = z.object({
  id:            z.string().uuid().optional(),
  content:       z.string().min(1),
  relatedToType: z.union([zRelatedToType, z.number().int()]),
  relatedToId:   z.string().uuid(),
  isPrivate:     z.boolean().optional(),
  createdById:   z.string().uuid().optional().nullable(),
  createdAt:     z.string().optional().nullable(),
  updatedAt:     z.string().optional().nullable(),
});

export const zNotesResponse = zPaged(zNote);
export type  Note           = z.infer<typeof zNote>;

/* ══════════════════════════════════════════════════════
   DASHBOARD  — §11
══════════════════════════════════════════════════════ */

/** GET /api/dashboard/overview — §11.1 */
export const zDashboardOverview = z.object({
  opportunities: z.object({
    totalCount:    z.number().int(),
    activeCount:   z.number().int().optional(),
    wonCount:      z.number().int(),
    pipelineValue: z.number(),
    winRate:       z.number(),
  }),
  pipeline: z.object({
    stages:                z.array(z.unknown()),
    weightedPipelineValue: z.number(),
  }),
  activities: z.object({
    totalCount:          z.number().int(),
    upcomingCount:       z.number().int(),
    overdueCount:        z.number().int(),
    completedTodayCount: z.number().int(),
  }),
  contracts: z.object({
    totalActiveCount:       z.number().int(),
    expiringThisMonthCount: z.number().int(),
    totalContractValue:     z.number(),
  }),
  revenue: z.object({
    thisMonth:          z.number(),
    projectedThisYear:  z.number().optional().nullable(),
    monthlyTrend:       z.array(z.unknown()),
  }),
});

/** GET /api/dashboard/pipeline-metrics — §11.2 */
export const zDashboardPipelineMetrics = zPipelineMetrics;

/** GET /api/dashboard/sales-performance?topCount=5 — §11.3 */
export const zDashboardSalesPerformance = z.object({
  topPerformers:         z.array(z.object({
    userId:       z.string().optional(),
    userName:     z.string().optional(),
    dealsWon:     z.number().int(),
    totalRevenue: z.number().optional(),
  })).optional(),
  averageDealsPerUser:   z.number().optional(),
  averageRevenuePerUser: z.number().optional(),
});

/** GET /api/dashboard/activities-summary — §11.4 */
export const zDashboardActivitiesSummary = z.object({
  totalCount:          z.number().int(),
  upcomingCount:       z.number().int(),
  overdueCount:        z.number().int(),
  completedTodayCount: z.number().int(),
  byType:              z.record(z.string(), z.number()).optional(),
});

/** GET /api/dashboard/contracts-expiring?days=30 — §11.5 */
export const zContractsExpiringResponse = z.array(zContract);

export type DashboardOverview           = z.infer<typeof zDashboardOverview>;
export type DashboardSalesPerformance   = z.infer<typeof zDashboardSalesPerformance>;
export type DashboardActivitiesSummary  = z.infer<typeof zDashboardActivitiesSummary>;
