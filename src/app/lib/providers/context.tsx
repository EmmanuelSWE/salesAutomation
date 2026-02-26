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
                                  //            cannot be "Admin" when joining via tenantId
                                  //            ignored when tenantName is provided
  createdAt?:    string;          // ISO date string
  updatedAt?:    string;          // ISO date string
}

/* ══════════════════════════════════════════════════════
   STATE INTERFACE
══════════════════════════════════════════════════════ */
export interface IUserStateContext {
  isPending:  boolean;
  isSuccess:  boolean;
  isError:    boolean;
  user?:      IUser;
  users?:     IUser[];
}

/* ══════════════════════════════════════════════════════
   ACTIONS INTERFACE
══════════════════════════════════════════════════════ */
export interface IUserActionsContext {
  registerUser:    (user: IUser)                          => void;
  loginUser:       (email: string, password: string)      => void;
  getUsers:        ()                                     => void;
  getOneUser:      (id: string)                           => void;
  updateUser:      (id: string, user: Partial<IUser>)     => void;
  deleteUser:      (id: string)                           => void;
}

/* ══════════════════════════════════════════════════════
   INITIAL STATE
══════════════════════════════════════════════════════ */
export const INITIAL_USER_STATE: IUserStateContext = {
  isPending: false,
  isSuccess: false,
  isError:   false,
};

/* ══════════════════════════════════════════════════════
   CONTEXTS
══════════════════════════════════════════════════════ */
export const UserStateContext   = createContext<IUserStateContext>(INITIAL_USER_STATE);
export const UserActionsContext = createContext<IUserActionsContext>(null as unknown as IUserActionsContext);




/* ── Interface ── */
export interface IClient {
  id?:             string;
  name:            string;
  industry:        string;
  clientType:      ClientType;
  website?:        string;
  billingAddress:  string;
  taxNumber?:      string;
  companySize?:    string;
  isActive?:       boolean;
  createdAt?:      string;
  updatedAt?:      string;
}

/* ── State ── */
export interface IClientStateContext {
  isPending:  boolean;
  isSuccess:  boolean;
  isError:    boolean;
  client?:    IClient;
  clients?:   IClient[];
}

/* ── Actions ── */
export interface IClientActionsContext {
  getClients:    (params?: { searchTerm?: string; industry?: string; clientType?: ClientType; isActive?: boolean; pageNumber?: number; pageSize?: number }) => void;
  getOneClient:  (id: string)                    => void;
  createClient:  (client: IClient)               => void;
  updateClient:  (id: string, client: Partial<IClient>) => void;
  deleteClient:  (id: string)                    => void;
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
  getContacts:          (params?: { clientId?: string; searchTerm?: string; pageNumber?: number; pageSize?: number }) => void;
  getContactsByClient:  (clientId: string)                       => void;
  getOneContact:        (id: string)                             => void;
  createContact:        (contact: IContact)                      => void;
  updateContact:        (id: string, contact: Partial<IContact>) => void;
  setPrimaryContact:    (id: string)                             => void;
  deleteContact:        (id: string)                             => void;
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
  getOpportunities:     (params?: { clientId?: string; stage?: OpportunityStage; ownerId?: string; searchTerm?: string; pageNumber?: number; pageSize?: number }) => void;
  getMyOpportunities:   (params?: { stage?: OpportunityStage; pageNumber?: number; pageSize?: number }) => void;
  getPipeline:          (ownerId?: string)                                   => void;
  getOneOpportunity:    (id: string)                                         => void;
  getStageHistory:      (id: string)                                         => void;
  createOpportunity:    (opportunity: IOpportunity)                          => void;
  updateOpportunity:    (id: string, opportunity: Partial<IOpportunity>)     => void;
  updateStage:          (id: string, stage: OpportunityStage, reason?: string) => void;
  assignOpportunity:    (id: string, userId: string)                         => void;
  deleteOpportunity:    (id: string)                                         => void;
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
  getProposals:     (params?: { clientId?: string; opportunityId?: string; status?: ProposalStatus; pageNumber?: number; pageSize?: number }) => void;
  getOneProposal:   (id: string)                                                         => void;
  createProposal:   (proposal: IProposal)                                                => void;
  updateProposal:   (id: string, proposal: Partial<IProposal>)                           => void;
  // Line item actions — only on Draft proposals
  addLineItem:      (proposalId: string, item: IProposalLineItem)                        => void;
  updateLineItem:   (proposalId: string, lineItemId: string, item: Partial<IProposalLineItem>) => void;
  removeLineItem:   (proposalId: string, lineItemId: string)                             => void;
  // Status transitions
  submitProposal:   (id: string)                                                         => void;
  approveProposal:  (id: string)                                                         => void;
  rejectProposal:   (id: string, reason: string)                                         => void;
  deleteProposal:   (id: string)                                                         => void;
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
  getPricingRequests:      (params?: { status?: PricingRequestStatus; priority?: Priority; assignedToId?: string; pageNumber?: number; pageSize?: number }) => void;
  getPendingRequests:      ()                                                              => void;
  getMyRequests:           ()                                                              => void;
  getOnePricingRequest:    (id: string)                                                   => void;
  createPricingRequest:    (request: IPricingRequest)                                     => void;
  updatePricingRequest:    (id: string, request: Partial<IPricingRequest>)                => void;
  assignPricingRequest:    (id: string, userId: string)                                   => void;
  completePricingRequest:  (id: string)                                                   => void;
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
  getContracts:       (params?: { clientId?: string; status?: ContractStatus; pageNumber?: number; pageSize?: number }) => void;
  getOneContract:     (id: string)                                                   => void;
  getExpiringContracts: (daysUntilExpiry?: number)                                   => void;
  getContractsByClient: (clientId: string)                                            => void;
  createContract:     (contract: IContract)                                          => void;
  updateContract:     (id: string, contract: Partial<IContract>)                     => void;
  activateContract:   (id: string)                                                   => void;
  cancelContract:     (id: string)                                                   => void;
  deleteContract:     (id: string)                                                   => void;
  // Renewals
  createRenewal:      (contractId: string, renewal: IContractRenewal)                => void;
  completeRenewal:    (renewalId: string)                                             => void;
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
  getActivities:      (params?: { assignedToId?: string; type?: ActivityType; status?: ActivityStatus; relatedToType?: RelatedToType; relatedToId?: string; pageNumber?: number; pageSize?: number }) => void;
  getMyActivities:    (params?: { status?: ActivityStatus; pageNumber?: number; pageSize?: number }) => void;
  getUpcoming:        (daysAhead?: number)                                          => void;
  getOverdue:         ()                                                            => void;
  getOneActivity:     (id: string)                                                 => void;
  createActivity:     (activity: IActivity)                                        => void;
  updateActivity:     (id: string, activity: Partial<IActivity>)                   => void;
  completeActivity:   (id: string, outcome: string)                                => void;
  cancelActivity:     (id: string)                                                 => void;
  deleteActivity:     (id: string)                                                 => void;
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
  getNotes:    (params?: { relatedToType?: RelatedToType; relatedToId?: string; pageNumber?: number; pageSize?: number }) => void;
  getOneNote:  (id: string)                           => void;
  createNote:  (note: INote)                          => void;
  updateNote:  (id: string, note: Partial<INote>)     => void;
  deleteNote:  (id: string)                           => void;
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