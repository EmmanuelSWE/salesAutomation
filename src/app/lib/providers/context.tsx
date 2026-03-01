'use client';
import { createContext } from "react";
import type { ActivityStatus, ActivityType, ClientType, ContractStatus, DocumentCategory, OpportunitySource, OpportunityStage, PricingRequestStatus, Priority, ProposalStatus, RelatedToType } from "../utils/apiEnums";

/* ══════════════════════════════════════════════════════
   USER INTERFACE
   Matches POST /api/auth/register request shape
══════════════════════════════════════════════════════ */
export interface IUser {
  id?:           string;
  email:         string;          // required — must be unique
  password:      string;          // required — minimum 6 characters
  firstName:     string;          // required
  lastName:      string;          // required
  phoneNumber?:  string;          // optional
  tenantName?:   string;          // optional — creates new org, caller becomes Admin
           //            mutually exclusive with tenantId
  tenantId?:     string;          // optional guid — joins existing org by ID
  role?:         string;          // optional — defaults to "SalesRep"
  roles?:        string[];        // array of roles returned by the API
  isActive?:     boolean;
  createdAt?:    string;          // ISO date string
  updatedAt?:    string;          // ISO date string
}

/* ══════════════════════════════════════════════════════
   STATE INTERFACE
══════════════════════════════════════════════════════ */
export interface IUserStateContext {
  isPending:     boolean;
  isSuccess:     boolean;
  isError:       boolean;
  isInitialized: boolean;
   token?:        string;
  user?:      IUser;
  users?:     IUser[];
}

/* ══════════════════════════════════════════════════════
   ACTIONS INTERFACE
══════════════════════════════════════════════════════ */
export interface IUserActionsContext {
  getUsers:    (params?: { role?: string; isActive?: boolean; [key: string]: unknown }) => Promise<void>;
  getOneUser:  (id: string) => Promise<void>;
  logoutUser:  ()           => void;
}

/* ══════════════════════════════════════════════════════
   INITIAL STATE
══════════════════════════════════════════════════════ */
export const INITIAL_USER_STATE: IUserStateContext = {
  isPending:     false,
  isSuccess:     false,
  isError:       false,
  isInitialized: false,
};

/* ══════════════════════════════════════════════════════
   CONTEXTS
══════════════════════════════════════════════════════ */
export const UserStateContext   = createContext<IUserStateContext>(INITIAL_USER_STATE);
export const UserActionsContext = createContext<IUserActionsContext>(null as unknown as IUserActionsContext);




/* ── Interface ── */
export interface IClient {
  id?:                  string;
  name:                 string;
  industry:             string;
  clientType:           ClientType;
  website?:             string;
  billingAddress?:      string;
  taxNumber?:           string;
  companySize?:         string;
  isActive?:            boolean;
  createdById?:         string;
  createdByName?:       string;
  createdAt?:           string;
  updatedAt?:           string;
  contactsCount?:       number;
  opportunitiesCount?:  number;
  contractsCount?:      number;
}

export interface IClientPage {
  items:           IClient[];
  pageNumber:      number;
  pageSize:        number;
  totalCount:      number;
  totalPages:      number;
  hasNextPage:     boolean;
  hasPreviousPage: boolean;
}

/* ── State ── */
export interface IClientStateContext {
  isPending:          boolean;
  isSuccess:          boolean;
  isError:            boolean;
  client?:            IClient;
  clients?:           IClient[];
  clientsTotalCount?: number;
  clientsTotalPages?: number;
  clientsPageNumber?: number;
  clientsHasNextPage?: boolean;
}

/* ── Actions ── */
export interface IClientActionsContext {
  getClients:   (params?: { pageNumber?: number; pageSize?: number; [key: string]: unknown }) => Promise<void>;
  getOneClient: (id: string) => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_CLIENT_STATE: IClientStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const ClientStateContext   = createContext<IClientStateContext>(INITIAL_CLIENT_STATE);
export const ClientActionsContext = createContext<IClientActionsContext>(null as unknown as IClientActionsContext);


/* ── Interface ── */
export interface IContact {
  id?:               string;
  clientId:          string;
  firstName:         string;
  lastName:          string;
  email:             string;
  phoneNumber?:      string;
  position?:         string;
  isPrimaryContact?: boolean;
  createdAt?:        string;
  updatedAt?:        string;
}

/* ── State ── */
export interface IContactStateContext {
  isPending:  boolean;
  isSuccess:  boolean;
  isError:    boolean;
  contact?:   IContact;
  contacts?:  IContact[];
}

/* ── Actions ── */
export interface IContactActionsContext {
  getContacts:         (params?: object)  => Promise<void>;
  getContactsByClient: (clientId: string) => Promise<void>;
  getOneContact:       (id: string)       => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_CONTACT_STATE: IContactStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const ContactStateContext   = createContext<IContactStateContext>(INITIAL_CONTACT_STATE);
export const ContactActionsContext = createContext<IContactActionsContext>(null as unknown as IContactActionsContext);




/* ── Interface ── */
export interface IOpportunity {
  id?:                string;
  title:              string;
  clientId:           string;
  contactId?:         string;
  estimatedValue:     number;
  currency:           string;
  stage:              OpportunityStage;
  source?:            OpportunitySource;
  probability?:       number;           // 0–100
  expectedCloseDate:  string;           // ISO date string
  description?:       string;
  assignedToId?:      string;
  createdAt?:         string;
  updatedAt?:         string;
}

/* ── Stage history entry ── */
export interface IOpportunityStageHistory {
  id:         string;
  stage:      OpportunityStage;
  reason?:    string;
  changedAt:  string;
}

/* ── State ── */
export interface IOpportunityStateContext {
  isPending:      boolean;
  isSuccess:      boolean;
  isError:        boolean;
  opportunity?:   IOpportunity;
  opportunities?: IOpportunity[];
  stageHistory?:  IOpportunityStageHistory[];
}

/* ── Actions ── */
export interface IOpportunityActionsContext {
  getOpportunities:   (params?: object)  => Promise<void>;
  getMyOpportunities: (params?: object)  => Promise<void>;
  getPipeline:        (ownerId?: string) => Promise<void>;
  getOneOpportunity:  (id: string)       => Promise<void>;
  getStageHistory:    (id: string)       => Promise<void>;
  advanceStage:       (id: string, stage: number, reason?: string) => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_OPPORTUNITY_STATE: IOpportunityStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const OpportunityStateContext   = createContext<IOpportunityStateContext>(INITIAL_OPPORTUNITY_STATE);
export const OpportunityActionsContext = createContext<IOpportunityActionsContext>(null as unknown as IOpportunityActionsContext);


/* ── Line item ── */
export interface IProposalLineItem {
  id?:                  string;
  productServiceName:   string;
  description?:         string;
  quantity:             number;
  unitPrice:            number;
  discount?:            number;   // percentage 0–100
  taxRate?:             number;   // percentage e.g. 15
  // computed: (quantity × unitPrice × (1 − discount/100)) × (1 + taxRate/100)
  lineTotal?:           number;
}

/* ── Proposal ──
   lineItems is optional — a proposal may be created without them
   and items can be added afterwards via addLineItem              */
export interface IProposal {
  id?:            string;
  opportunityId:  string;
  clientId:       string;
  title:          string;
  description?:   string;
  currency:       string;
  validUntil:     string;           // ISO date string
  status?:        ProposalStatus;   // default "Draft" on creation
  lineItems?:     IProposalLineItem[];
  createdAt?:     string;
  updatedAt?:     string;
}

/* ── State ── */
export interface IProposalStateContext {
  isPending:   boolean;
  isSuccess:   boolean;
  isError:     boolean;
  proposal?:   IProposal;
  proposals?:  IProposal[];
}

/* ── Actions ── */
export interface IProposalActionsContext {
  getProposals:    (params?: object) => Promise<void>;
  getOneProposal:  (id: string)      => Promise<void>;
  submitProposal:  (id: string)      => Promise<void>;
  approveProposal: (id: string, comment?: string) => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_PROPOSAL_STATE: IProposalStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const ProposalStateContext   = createContext<IProposalStateContext>(INITIAL_PROPOSAL_STATE);
export const ProposalActionsContext = createContext<IProposalActionsContext>(null as unknown as IProposalActionsContext);



/* ── Interface ── */
export interface IPricingRequest {
  id?:              string;
  title:            string;
  description?:     string;
  clientId:         string;
  opportunityId?:   string;
  requestedById?:   string;
  assignedToId?:    string;
  priority:         Priority;
  requiredByDate:   string;             // ISO date string
  status?:          PricingRequestStatus; // defaults to "Pending"
  createdAt?:       string;
  updatedAt?:       string;
}

/* ── State ── */
export interface IPricingRequestStateContext {
  isPending:          boolean;
  isSuccess:          boolean;
  isError:            boolean;
  pricingRequest?:    IPricingRequest;
  pricingRequests?:   IPricingRequest[];
}

/* ── Actions ── */
export interface IPricingRequestActionsContext {
  getPricingRequests:   (params?: object)                                   => Promise<void>;
  getPendingRequests:   ()                                                  => Promise<void>;
  getMyRequests:        ()                                                  => Promise<void>;
  getOnePricingRequest: (id: string)                                        => Promise<void>;
  assignRequest:        (id: string, assignedToId: string)                  => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_PRICING_STATE: IPricingRequestStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const PricingRequestStateContext   = createContext<IPricingRequestStateContext>(INITIAL_PRICING_STATE);
export const PricingRequestActionsContext = createContext<IPricingRequestActionsContext>(null as unknown as IPricingRequestActionsContext);


/* ── Renewal interface ── */
export interface IContractRenewal {
  id?:                string;
  contractId?:        string;
  proposedStartDate:  string;   // ISO date string
  proposedEndDate:    string;   // ISO date string
  proposedValue:      number;
  notes?:             string;
  createdAt?:         string;
}

/* ── Contract interface ── */
export interface IContract {
  id?:                   string;
  clientId:              string;
  opportunityId?:        string;
  proposalId?:           string;
  title:                 string;
  contractValue:         number;
  currency:              string;
  startDate:             string;    // ISO date string
  endDate:               string;    // ISO date string
  ownerId?:              string;
  renewalNoticePeriod?:  number;    // days
  autoRenew?:            boolean;
  terms?:                string;
  status?:               ContractStatus;  // defaults to "Draft"
  // computed fields returned by GET /api/contracts/{id}
  isExpiringSoon?:       boolean;
  daysUntilExpiry?:      number;
  createdAt?:            string;
  updatedAt?:            string;
}

/* ── State ── */
export interface IContractStateContext {
  isPending:    boolean;
  isSuccess:    boolean;
  isError:      boolean;
  contract?:    IContract;
  contracts?:   IContract[];
  renewal?:     IContractRenewal;
  renewals?:    IContractRenewal[];
}

/* ── Actions ── */
export interface IContractActionsContext {
  getContracts:         (params?: object)          => Promise<void>;
  getOneContract:       (id: string)               => Promise<void>;
  getExpiringContracts: (daysUntilExpiry?: number)  => Promise<void>;
  getContractsByClient: (clientId: string)         => Promise<void>;
  activateContract:     (id: string)               => Promise<void>;
  completeRenewal:      (renewalId: string)         => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_CONTRACT_STATE: IContractStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const ContractStateContext   = createContext<IContractStateContext>(INITIAL_CONTRACT_STATE);
export const ContractActionsContext = createContext<IContractActionsContext>(null as unknown as IContractActionsContext);


/* ── Interface ── */
export interface IActivity {
  id?:             string;
  type:            ActivityType;
  subject:         string;
  description?:    string;
  priority?:       Priority;
  dueDate:         string;          // ISO datetime string
  assignedToId?:   string;
  relatedToType?:  RelatedToType;
  relatedToId?:    string;
  duration?:       number;          // minutes
  location?:       string;
  status?:         ActivityStatus;  // defaults to "Scheduled"
  outcome?:        string;          // filled on completion
  createdAt?:      string;
  updatedAt?:      string;
}

/* ── State ── */
export interface IActivityStateContext {
  isPending:    boolean;
  isSuccess:    boolean;
  isError:      boolean;
  activity?:    IActivity;
  activities?:  IActivity[];
}

/* ── Actions ── */
export interface IActivityActionsContext {
  getActivities:   (params?: object)    => Promise<void>;
  getMyActivities: (params?: object)    => Promise<void>;
  getUpcoming:     (daysAhead?: number) => Promise<void>;
  getOverdue:      ()                   => Promise<void>;
  getOneActivity:  (id: string)         => Promise<void>;
  updateActivity:  (id: string, payload: Partial<IActivity>) => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_ACTIVITY_STATE: IActivityStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const ActivityStateContext   = createContext<IActivityStateContext>(INITIAL_ACTIVITY_STATE);
export const ActivityActionsContext = createContext<IActivityActionsContext>(null as unknown as IActivityActionsContext);


/* ── Interface ── */
export interface IDocument {
  id?:               string;
  fileName?:         string;
  fileSize?:         number;       // bytes
  mimeType?:         string;
  documentCategory?: DocumentCategory;
  relatedToType?:    RelatedToType;
  relatedToId?:      string;
  description?:      string;
  uploadedById?:     string;
  createdAt?:        string;
}

/* ── Upload payload (multipart/form-data) ── */
export interface IDocumentUpload {
  file:               File;
  documentCategory?:  DocumentCategory;
  relatedToType?:     RelatedToType;
  relatedToId?:       string;
  description?:       string;
}

/* ── State ── */
export interface IDocumentStateContext {
  isPending:   boolean;
  isSuccess:   boolean;
  isError:     boolean;
  document?:   IDocument;
  documents?:  IDocument[];
}

/* ── Actions ── */
export interface IDocumentActionsContext {
  getDocuments:     (params?: { relatedToType?: RelatedToType; relatedToId?: string; category?: DocumentCategory; pageNumber?: number; pageSize?: number }) => void;
  getOneDocument:   (id: string)               => void;
  uploadDocument:   (payload: IDocumentUpload) => void;
  downloadDocument: (id: string)               => void;
  deleteDocument:   (id: string)               => void;
}

/* ── Initial state ── */
export const INITIAL_DOCUMENT_STATE: IDocumentStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const DocumentStateContext   = createContext<IDocumentStateContext>(INITIAL_DOCUMENT_STATE);
export const DocumentActionsContext = createContext<IDocumentActionsContext>(null as unknown as IDocumentActionsContext);


/* ── Interface ── */
export interface INote {
  id?:             string;
  content:         string;
  relatedToType:   RelatedToType;
  relatedToId:     string;
  isPrivate?:      boolean;      // defaults to false
  createdById?:    string;
  createdAt?:      string;
  updatedAt?:      string;
}

/* ── State ── */
export interface INoteStateContext {
  isPending:  boolean;
  isSuccess:  boolean;
  isError:    boolean;
  note?:      INote;
  notes?:     INote[];
}

/* ── Actions ── */
export interface INoteActionsContext {
  getNotes:   (params?: object) => Promise<void>;
  getOneNote: (id: string)      => Promise<void>;
}

/* ── Initial state ── */
export const INITIAL_NOTE_STATE: INoteStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ── Contexts ── */
export const NoteStateContext   = createContext<INoteStateContext>(INITIAL_NOTE_STATE);
export const NoteActionsContext = createContext<INoteActionsContext>(null as unknown as INoteActionsContext);