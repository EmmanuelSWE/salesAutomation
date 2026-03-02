
'use client';
import { createAction } from "redux-actions";
import {
  IClientStateContext,       IClient,       IClientPage,
  IContactStateContext,      IContact,
  IOpportunityStateContext,  IOpportunity, IOpportunityStageHistory,
  IProposalStateContext,     IProposal,
  IPricingRequestStateContext, IPricingRequest,
  IContractStateContext,     IContract, IContractRenewal,
  IActivityStateContext,     IActivity,
  INoteStateContext,   IUserStateContext, IUser ,       INote,
} from "./context";



/* ══════════════════════════════════════════════════════
   USER
══════════════════════════════════════════════════════ */
export enum UserActionEnums {
  loginPending  = "LOGIN_PENDING",
  loginSuccess  = "LOGIN_SUCCESS",
  loginError    = "LOGIN_ERROR",

  registerPending = "REGISTER_PENDING",
  registerSuccess = "REGISTER_SUCCESS",
  registerError   = "REGISTER_ERROR",

  getUsersPending = "GET_USERS_PENDING",
  getUsersSuccess = "GET_USERS_SUCCESS",
  getUsersError   = "GET_USERS_ERROR",

  getOneUserPending = "GET_ONE_USER_PENDING",
  getOneUserSuccess = "GET_ONE_USER_SUCCESS",
  getOneUserError   = "GET_ONE_USER_ERROR",

  updateUserPending = "UPDATE_USER_PENDING",
  updateUserSuccess = "UPDATE_USER_SUCCESS",
  updateUserError   = "UPDATE_USER_ERROR",

  deleteUserPending = "DELETE_USER_PENDING",
  deleteUserSuccess = "DELETE_USER_SUCCESS",
  deleteUserError   = "DELETE_USER_ERROR",
}

export const loginPending  = createAction<IUserStateContext>(UserActionEnums.loginPending,  () => ({ isPending: true,  isSuccess: false, isError: false, isInitialized: false }));
export const loginSuccess  = createAction<IUserStateContext, IUser>(UserActionEnums.loginSuccess, (user: IUser) => ({ isPending: false, isSuccess: true,  isError: false, isInitialized: true, user }));
export const loginError    = createAction<IUserStateContext>(UserActionEnums.loginError,    () => ({ isPending: false, isSuccess: false, isError: true, isInitialized: true  }));

export const registerPending = createAction<IUserStateContext>(UserActionEnums.registerPending, () => ({ isPending: true,  isSuccess: false, isError: false, isInitialized: false }));
export const registerSuccess = createAction<IUserStateContext, IUser>(UserActionEnums.registerSuccess, (user: IUser) => ({ isPending: false, isSuccess: true,  isError: false, isInitialized: true, user }));
export const registerError   = createAction<IUserStateContext>(UserActionEnums.registerError,   () => ({ isPending: false, isSuccess: false, isError: true, isInitialized: true  }));

export const getUsersPending = createAction<IUserStateContext>(UserActionEnums.getUsersPending, () => ({ isPending: true,  isSuccess: false, isError: false, isInitialized: false }));
export const getUsersSuccess = createAction<IUserStateContext, IUser[]>(UserActionEnums.getUsersSuccess, (users: IUser[]) => ({ isPending: false, isSuccess: true,  isError: false, isInitialized: true, users }));
export const getUsersError   = createAction<IUserStateContext>(UserActionEnums.getUsersError,   () => ({ isPending: false, isSuccess: false, isError: true, isInitialized: true  }));

export const getOneUserPending = createAction<IUserStateContext>(UserActionEnums.getOneUserPending, () => ({ isPending: true,  isSuccess: false, isError: false, isInitialized: false }));
export const getOneUserSuccess = createAction<IUserStateContext, IUser>(UserActionEnums.getOneUserSuccess, (user: IUser) => ({ isPending: false, isSuccess: true,  isError: false, isInitialized: true, user }));
export const getOneUserError   = createAction<IUserStateContext>(UserActionEnums.getOneUserError,   () => ({ isPending: false, isSuccess: false, isError: true, isInitialized: true  }));

export const updateUserPending = createAction<IUserStateContext>(UserActionEnums.updateUserPending, () => ({ isPending: true,  isSuccess: false, isError: false, isInitialized: false }));
export const updateUserSuccess = createAction<IUserStateContext>(UserActionEnums.updateUserSuccess, () => ({ isPending: false, isSuccess: true,  isError: false, isInitialized: true }));
export const updateUserError   = createAction<IUserStateContext>(UserActionEnums.updateUserError,   () => ({ isPending: false, isSuccess: false, isError: true, isInitialized: true  }));

export const deleteUserPending = createAction<IUserStateContext>(UserActionEnums.deleteUserPending, () => ({ isPending: true,  isSuccess: false, isError: false, isInitialized: false }));
export const deleteUserSuccess = createAction<IUserStateContext>(UserActionEnums.deleteUserSuccess, () => ({ isPending: false, isSuccess: true,  isError: false, isInitialized: true }));
export const deleteUserError   = createAction<IUserStateContext>(UserActionEnums.deleteUserError,   () => ({ isPending: false, isSuccess: false, isError: true, isInitialized: true  }));

/* ══════════════════════════════════════════════════════
   CLIENT
══════════════════════════════════════════════════════ */
export enum ClientActionEnums {
  getClientsPending   = "GET_CLIENTS_PENDING",
  getClientsSuccess   = "GET_CLIENTS_SUCCESS",
  getClientsError     = "GET_CLIENTS_ERROR",

  getOneClientPending = "GET_ONE_CLIENT_PENDING",
  getOneClientSuccess = "GET_ONE_CLIENT_SUCCESS",
  getOneClientError   = "GET_ONE_CLIENT_ERROR",

  createClientPending = "CREATE_CLIENT_PENDING",
  createClientSuccess = "CREATE_CLIENT_SUCCESS",
  createClientError   = "CREATE_CLIENT_ERROR",

  updateClientPending = "UPDATE_CLIENT_PENDING",
  updateClientSuccess = "UPDATE_CLIENT_SUCCESS",
  updateClientError   = "UPDATE_CLIENT_ERROR",

  deleteClientPending = "DELETE_CLIENT_PENDING",
  deleteClientSuccess = "DELETE_CLIENT_SUCCESS",
  deleteClientError   = "DELETE_CLIENT_ERROR",
}

export const getClientsPending   = createAction<IClientStateContext>(ClientActionEnums.getClientsPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getClientsSuccess   = createAction<IClientStateContext, IClientPage>(ClientActionEnums.getClientsSuccess, (page: IClientPage) => ({ isPending: false, isSuccess: true, isError: false, clients: page.items, clientsTotalCount: page.totalCount, clientsTotalPages: page.totalPages, clientsPageNumber: page.pageNumber, clientsHasNextPage: page.hasNextPage }));
export const getClientsError     = createAction<IClientStateContext>(ClientActionEnums.getClientsError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneClientPending = createAction<IClientStateContext>(ClientActionEnums.getOneClientPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneClientSuccess = createAction<IClientStateContext, IClient>(ClientActionEnums.getOneClientSuccess, (client: IClient) => ({ isPending: false, isSuccess: true,  isError: false, client }));
export const getOneClientError   = createAction<IClientStateContext>(ClientActionEnums.getOneClientError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createClientPending = createAction<IClientStateContext>(ClientActionEnums.createClientPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createClientSuccess = createAction<IClientStateContext>(ClientActionEnums.createClientSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createClientError   = createAction<IClientStateContext>(ClientActionEnums.createClientError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateClientPending = createAction<IClientStateContext>(ClientActionEnums.updateClientPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateClientSuccess = createAction<IClientStateContext>(ClientActionEnums.updateClientSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateClientError   = createAction<IClientStateContext>(ClientActionEnums.updateClientError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteClientPending = createAction<IClientStateContext>(ClientActionEnums.deleteClientPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteClientSuccess = createAction<IClientStateContext>(ClientActionEnums.deleteClientSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteClientError   = createAction<IClientStateContext>(ClientActionEnums.deleteClientError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════ */
export enum ContactActionEnums {
  getContactsPending   = "GET_CONTACTS_PENDING",
  getContactsSuccess   = "GET_CONTACTS_SUCCESS",
  getContactsError     = "GET_CONTACTS_ERROR",

  getOneContactPending = "GET_ONE_CONTACT_PENDING",
  getOneContactSuccess = "GET_ONE_CONTACT_SUCCESS",
  getOneContactError   = "GET_ONE_CONTACT_ERROR",

  createContactPending = "CREATE_CONTACT_PENDING",
  createContactSuccess = "CREATE_CONTACT_SUCCESS",
  createContactError   = "CREATE_CONTACT_ERROR",

  updateContactPending = "UPDATE_CONTACT_PENDING",
  updateContactSuccess = "UPDATE_CONTACT_SUCCESS",
  updateContactError   = "UPDATE_CONTACT_ERROR",

  deleteContactPending = "DELETE_CONTACT_PENDING",
  deleteContactSuccess = "DELETE_CONTACT_SUCCESS",
  deleteContactError   = "DELETE_CONTACT_ERROR",
}

export const getContactsPending   = createAction<IContactStateContext>(ContactActionEnums.getContactsPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getContactsSuccess   = createAction<IContactStateContext, IContact[]>(ContactActionEnums.getContactsSuccess, (contacts: IContact[]) => ({ isPending: false, isSuccess: true,  isError: false, contacts }));
export const getContactsError     = createAction<IContactStateContext>(ContactActionEnums.getContactsError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneContactPending = createAction<IContactStateContext>(ContactActionEnums.getOneContactPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneContactSuccess = createAction<IContactStateContext, IContact>(ContactActionEnums.getOneContactSuccess, (contact: IContact) => ({ isPending: false, isSuccess: true,  isError: false, contact }));
export const getOneContactError   = createAction<IContactStateContext>(ContactActionEnums.getOneContactError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createContactPending = createAction<IContactStateContext>(ContactActionEnums.createContactPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createContactSuccess = createAction<IContactStateContext>(ContactActionEnums.createContactSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createContactError   = createAction<IContactStateContext>(ContactActionEnums.createContactError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateContactPending = createAction<IContactStateContext>(ContactActionEnums.updateContactPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateContactSuccess = createAction<IContactStateContext>(ContactActionEnums.updateContactSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateContactError   = createAction<IContactStateContext>(ContactActionEnums.updateContactError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteContactPending = createAction<IContactStateContext>(ContactActionEnums.deleteContactPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteContactSuccess = createAction<IContactStateContext>(ContactActionEnums.deleteContactSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteContactError   = createAction<IContactStateContext>(ContactActionEnums.deleteContactError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   OPPORTUNITY
══════════════════════════════════════════════════════ */
export enum OpportunityActionEnums {
  getOpportunitiesPending   = "GET_OPPORTUNITIES_PENDING",
  getOpportunitiesSuccess   = "GET_OPPORTUNITIES_SUCCESS",
  getOpportunitiesError     = "GET_OPPORTUNITIES_ERROR",

  getOneOpportunityPending  = "GET_ONE_OPPORTUNITY_PENDING",
  getOneOpportunitySuccess  = "GET_ONE_OPPORTUNITY_SUCCESS",
  getOneOpportunityError    = "GET_ONE_OPPORTUNITY_ERROR",

  getStageHistoryPending    = "GET_STAGE_HISTORY_PENDING",
  getStageHistorySuccess    = "GET_STAGE_HISTORY_SUCCESS",
  getStageHistoryError      = "GET_STAGE_HISTORY_ERROR",

  createOpportunityPending  = "CREATE_OPPORTUNITY_PENDING",
  createOpportunitySuccess  = "CREATE_OPPORTUNITY_SUCCESS",
  createOpportunityError    = "CREATE_OPPORTUNITY_ERROR",

  updateOpportunityPending  = "UPDATE_OPPORTUNITY_PENDING",
  updateOpportunitySuccess  = "UPDATE_OPPORTUNITY_SUCCESS",
  updateOpportunityError    = "UPDATE_OPPORTUNITY_ERROR",

  deleteOpportunityPending  = "DELETE_OPPORTUNITY_PENDING",
  deleteOpportunitySuccess  = "DELETE_OPPORTUNITY_SUCCESS",
  deleteOpportunityError    = "DELETE_OPPORTUNITY_ERROR",
}

export const getOpportunitiesPending  = createAction<IOpportunityStateContext>(OpportunityActionEnums.getOpportunitiesPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOpportunitiesSuccess  = createAction<IOpportunityStateContext, IOpportunity[]>(OpportunityActionEnums.getOpportunitiesSuccess, (opportunities: IOpportunity[]) => ({ isPending: false, isSuccess: true,  isError: false, opportunities }));
export const getOpportunitiesError    = createAction<IOpportunityStateContext>(OpportunityActionEnums.getOpportunitiesError,    () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneOpportunityPending = createAction<IOpportunityStateContext>(OpportunityActionEnums.getOneOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneOpportunitySuccess = createAction<IOpportunityStateContext, IOpportunity>(OpportunityActionEnums.getOneOpportunitySuccess, (opportunity: IOpportunity) => ({ isPending: false, isSuccess: true,  isError: false, opportunity }));
export const getOneOpportunityError   = createAction<IOpportunityStateContext>(OpportunityActionEnums.getOneOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getStageHistoryPending   = createAction<IOpportunityStateContext>(OpportunityActionEnums.getStageHistoryPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getStageHistorySuccess   = createAction<IOpportunityStateContext, IOpportunityStageHistory[]>(OpportunityActionEnums.getStageHistorySuccess, (stageHistory: IOpportunityStageHistory[]) => ({ isPending: false, isSuccess: true,  isError: false, stageHistory }));
export const getStageHistoryError     = createAction<IOpportunityStateContext>(OpportunityActionEnums.getStageHistoryError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createOpportunityPending = createAction<IOpportunityStateContext>(OpportunityActionEnums.createOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createOpportunitySuccess = createAction<IOpportunityStateContext>(OpportunityActionEnums.createOpportunitySuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createOpportunityError   = createAction<IOpportunityStateContext>(OpportunityActionEnums.createOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateOpportunityPending = createAction<IOpportunityStateContext>(OpportunityActionEnums.updateOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateOpportunitySuccess = createAction<IOpportunityStateContext>(OpportunityActionEnums.updateOpportunitySuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateOpportunityError   = createAction<IOpportunityStateContext>(OpportunityActionEnums.updateOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteOpportunityPending = createAction<IOpportunityStateContext>(OpportunityActionEnums.deleteOpportunityPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteOpportunitySuccess = createAction<IOpportunityStateContext>(OpportunityActionEnums.deleteOpportunitySuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteOpportunityError   = createAction<IOpportunityStateContext>(OpportunityActionEnums.deleteOpportunityError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   PROPOSAL
══════════════════════════════════════════════════════ */
export enum ProposalActionEnums {
  getProposalsPending   = "GET_PROPOSALS_PENDING",
  getProposalsSuccess   = "GET_PROPOSALS_SUCCESS",
  getProposalsError     = "GET_PROPOSALS_ERROR",

  getOneProposalPending = "GET_ONE_PROPOSAL_PENDING",
  getOneProposalSuccess = "GET_ONE_PROPOSAL_SUCCESS",
  getOneProposalError   = "GET_ONE_PROPOSAL_ERROR",

  createProposalPending = "CREATE_PROPOSAL_PENDING",
  createProposalSuccess = "CREATE_PROPOSAL_SUCCESS",
  createProposalError   = "CREATE_PROPOSAL_ERROR",

  updateProposalPending = "UPDATE_PROPOSAL_PENDING",
  updateProposalSuccess = "UPDATE_PROPOSAL_SUCCESS",
  updateProposalError   = "UPDATE_PROPOSAL_ERROR",

  deleteProposalPending = "DELETE_PROPOSAL_PENDING",
  deleteProposalSuccess = "DELETE_PROPOSAL_SUCCESS",
  deleteProposalError   = "DELETE_PROPOSAL_ERROR",
}

export const getProposalsPending   = createAction<IProposalStateContext>(ProposalActionEnums.getProposalsPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getProposalsSuccess   = createAction<IProposalStateContext, IProposal[]>(ProposalActionEnums.getProposalsSuccess, (proposals: IProposal[]) => ({ isPending: false, isSuccess: true,  isError: false, proposals }));
export const getProposalsError     = createAction<IProposalStateContext>(ProposalActionEnums.getProposalsError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneProposalPending = createAction<IProposalStateContext>(ProposalActionEnums.getOneProposalPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneProposalSuccess = createAction<IProposalStateContext, IProposal>(ProposalActionEnums.getOneProposalSuccess, (proposal: IProposal) => ({ isPending: false, isSuccess: true,  isError: false, proposal }));
export const getOneProposalError   = createAction<IProposalStateContext>(ProposalActionEnums.getOneProposalError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createProposalPending = createAction<IProposalStateContext>(ProposalActionEnums.createProposalPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createProposalSuccess = createAction<IProposalStateContext>(ProposalActionEnums.createProposalSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createProposalError   = createAction<IProposalStateContext>(ProposalActionEnums.createProposalError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateProposalPending = createAction<IProposalStateContext>(ProposalActionEnums.updateProposalPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateProposalSuccess = createAction<IProposalStateContext>(ProposalActionEnums.updateProposalSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateProposalError   = createAction<IProposalStateContext>(ProposalActionEnums.updateProposalError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteProposalPending = createAction<IProposalStateContext>(ProposalActionEnums.deleteProposalPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteProposalSuccess = createAction<IProposalStateContext>(ProposalActionEnums.deleteProposalSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteProposalError   = createAction<IProposalStateContext>(ProposalActionEnums.deleteProposalError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   PRICING REQUEST
══════════════════════════════════════════════════════ */
export enum PricingRequestActionEnums {
  getPricingRequestsPending   = "GET_PRICING_REQUESTS_PENDING",
  getPricingRequestsSuccess   = "GET_PRICING_REQUESTS_SUCCESS",
  getPricingRequestsError     = "GET_PRICING_REQUESTS_ERROR",

  getOnePricingRequestPending = "GET_ONE_PRICING_REQUEST_PENDING",
  getOnePricingRequestSuccess = "GET_ONE_PRICING_REQUEST_SUCCESS",
  getOnePricingRequestError   = "GET_ONE_PRICING_REQUEST_ERROR",

  createPricingRequestPending = "CREATE_PRICING_REQUEST_PENDING",
  createPricingRequestSuccess = "CREATE_PRICING_REQUEST_SUCCESS",
  createPricingRequestError   = "CREATE_PRICING_REQUEST_ERROR",

  updatePricingRequestPending = "UPDATE_PRICING_REQUEST_PENDING",
  updatePricingRequestSuccess = "UPDATE_PRICING_REQUEST_SUCCESS",
  updatePricingRequestError   = "UPDATE_PRICING_REQUEST_ERROR",
}

export const getPricingRequestsPending   = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.getPricingRequestsPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getPricingRequestsSuccess   = createAction<IPricingRequestStateContext, IPricingRequest[]>(PricingRequestActionEnums.getPricingRequestsSuccess, (pricingRequests: IPricingRequest[]) => ({ isPending: false, isSuccess: true,  isError: false, pricingRequests }));
export const getPricingRequestsError     = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.getPricingRequestsError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOnePricingRequestPending = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.getOnePricingRequestPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOnePricingRequestSuccess = createAction<IPricingRequestStateContext, IPricingRequest>(PricingRequestActionEnums.getOnePricingRequestSuccess, (pricingRequest: IPricingRequest) => ({ isPending: false, isSuccess: true,  isError: false, pricingRequest }));
export const getOnePricingRequestError   = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.getOnePricingRequestError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createPricingRequestPending = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.createPricingRequestPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createPricingRequestSuccess = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.createPricingRequestSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createPricingRequestError   = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.createPricingRequestError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updatePricingRequestPending = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.updatePricingRequestPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updatePricingRequestSuccess = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.updatePricingRequestSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updatePricingRequestError   = createAction<IPricingRequestStateContext>(PricingRequestActionEnums.updatePricingRequestError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   CONTRACT
══════════════════════════════════════════════════════ */
export enum ContractActionEnums {
  getContractsPending   = "GET_CONTRACTS_PENDING",
  getContractsSuccess   = "GET_CONTRACTS_SUCCESS",
  getContractsError     = "GET_CONTRACTS_ERROR",

  getOneContractPending = "GET_ONE_CONTRACT_PENDING",
  getOneContractSuccess = "GET_ONE_CONTRACT_SUCCESS",
  getOneContractError   = "GET_ONE_CONTRACT_ERROR",

  createContractPending = "CREATE_CONTRACT_PENDING",
  createContractSuccess = "CREATE_CONTRACT_SUCCESS",
  createContractError   = "CREATE_CONTRACT_ERROR",

  updateContractPending = "UPDATE_CONTRACT_PENDING",
  updateContractSuccess = "UPDATE_CONTRACT_SUCCESS",
  updateContractError   = "UPDATE_CONTRACT_ERROR",

  deleteContractPending = "DELETE_CONTRACT_PENDING",
  deleteContractSuccess = "DELETE_CONTRACT_SUCCESS",
  deleteContractError   = "DELETE_CONTRACT_ERROR",

  createRenewalPending  = "CREATE_RENEWAL_PENDING",
  createRenewalSuccess  = "CREATE_RENEWAL_SUCCESS",
  createRenewalError    = "CREATE_RENEWAL_ERROR",
}

export const getContractsPending   = createAction<IContractStateContext>(ContractActionEnums.getContractsPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getContractsSuccess   = createAction<IContractStateContext, IContract[]>(ContractActionEnums.getContractsSuccess, (contracts: IContract[]) => ({ isPending: false, isSuccess: true,  isError: false, contracts }));
export const getContractsError     = createAction<IContractStateContext>(ContractActionEnums.getContractsError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneContractPending = createAction<IContractStateContext>(ContractActionEnums.getOneContractPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneContractSuccess = createAction<IContractStateContext, IContract>(ContractActionEnums.getOneContractSuccess, (contract: IContract) => ({ isPending: false, isSuccess: true,  isError: false, contract }));
export const getOneContractError   = createAction<IContractStateContext>(ContractActionEnums.getOneContractError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createContractPending = createAction<IContractStateContext>(ContractActionEnums.createContractPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createContractSuccess = createAction<IContractStateContext>(ContractActionEnums.createContractSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createContractError   = createAction<IContractStateContext>(ContractActionEnums.createContractError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateContractPending = createAction<IContractStateContext>(ContractActionEnums.updateContractPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateContractSuccess = createAction<IContractStateContext>(ContractActionEnums.updateContractSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateContractError   = createAction<IContractStateContext>(ContractActionEnums.updateContractError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteContractPending = createAction<IContractStateContext>(ContractActionEnums.deleteContractPending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteContractSuccess = createAction<IContractStateContext>(ContractActionEnums.deleteContractSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteContractError   = createAction<IContractStateContext>(ContractActionEnums.deleteContractError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createRenewalPending  = createAction<IContractStateContext>(ContractActionEnums.createRenewalPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createRenewalSuccess  = createAction<IContractStateContext, IContractRenewal>(ContractActionEnums.createRenewalSuccess, (renewal: IContractRenewal) => ({ isPending: false, isSuccess: true,  isError: false, renewal }));
export const createRenewalError    = createAction<IContractStateContext>(ContractActionEnums.createRenewalError,    () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   ACTIVITY
══════════════════════════════════════════════════════ */
export enum ActivityActionEnums {
  getActivitiesPending   = "GET_ACTIVITIES_PENDING",
  getActivitiesSuccess   = "GET_ACTIVITIES_SUCCESS",
  getActivitiesError     = "GET_ACTIVITIES_ERROR",

  getOneActivityPending  = "GET_ONE_ACTIVITY_PENDING",
  getOneActivitySuccess  = "GET_ONE_ACTIVITY_SUCCESS",
  getOneActivityError    = "GET_ONE_ACTIVITY_ERROR",

  createActivityPending  = "CREATE_ACTIVITY_PENDING",
  createActivitySuccess  = "CREATE_ACTIVITY_SUCCESS",
  createActivityError    = "CREATE_ACTIVITY_ERROR",

  updateActivityPending  = "UPDATE_ACTIVITY_PENDING",
  updateActivitySuccess  = "UPDATE_ACTIVITY_SUCCESS",
  updateActivityError    = "UPDATE_ACTIVITY_ERROR",

  deleteActivityPending  = "DELETE_ACTIVITY_PENDING",
  deleteActivitySuccess  = "DELETE_ACTIVITY_SUCCESS",
  deleteActivityError    = "DELETE_ACTIVITY_ERROR",
}

export const getActivitiesPending   = createAction<IActivityStateContext>(ActivityActionEnums.getActivitiesPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getActivitiesSuccess   = createAction<IActivityStateContext, IActivity[]>(ActivityActionEnums.getActivitiesSuccess, (activities: IActivity[]) => ({ isPending: false, isSuccess: true,  isError: false, activities }));
export const getActivitiesError     = createAction<IActivityStateContext>(ActivityActionEnums.getActivitiesError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneActivityPending  = createAction<IActivityStateContext>(ActivityActionEnums.getOneActivityPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneActivitySuccess  = createAction<IActivityStateContext, IActivity>(ActivityActionEnums.getOneActivitySuccess, (activity: IActivity) => ({ isPending: false, isSuccess: true,  isError: false, activity }));
export const getOneActivityError    = createAction<IActivityStateContext>(ActivityActionEnums.getOneActivityError,    () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createActivityPending  = createAction<IActivityStateContext>(ActivityActionEnums.createActivityPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createActivitySuccess  = createAction<IActivityStateContext>(ActivityActionEnums.createActivitySuccess,  () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createActivityError    = createAction<IActivityStateContext>(ActivityActionEnums.createActivityError,    () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateActivityPending  = createAction<IActivityStateContext>(ActivityActionEnums.updateActivityPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateActivitySuccess  = createAction<IActivityStateContext>(ActivityActionEnums.updateActivitySuccess,  () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateActivityError    = createAction<IActivityStateContext>(ActivityActionEnums.updateActivityError,    () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteActivityPending  = createAction<IActivityStateContext>(ActivityActionEnums.deleteActivityPending,  () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteActivitySuccess  = createAction<IActivityStateContext>(ActivityActionEnums.deleteActivitySuccess,  () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteActivityError    = createAction<IActivityStateContext>(ActivityActionEnums.deleteActivityError,    () => ({ isPending: false, isSuccess: false, isError: true  }));

/* ══════════════════════════════════════════════════════
   NOTE
══════════════════════════════════════════════════════ */
export enum NoteActionEnums {
  getNotesPending   = "GET_NOTES_PENDING",
  getNotesSuccess   = "GET_NOTES_SUCCESS",
  getNotesError     = "GET_NOTES_ERROR",

  getOneNotePending = "GET_ONE_NOTE_PENDING",
  getOneNoteSuccess = "GET_ONE_NOTE_SUCCESS",
  getOneNoteError   = "GET_ONE_NOTE_ERROR",

  createNotePending = "CREATE_NOTE_PENDING",
  createNoteSuccess = "CREATE_NOTE_SUCCESS",
  createNoteError   = "CREATE_NOTE_ERROR",

  updateNotePending = "UPDATE_NOTE_PENDING",
  updateNoteSuccess = "UPDATE_NOTE_SUCCESS",
  updateNoteError   = "UPDATE_NOTE_ERROR",

  deleteNotePending = "DELETE_NOTE_PENDING",
  deleteNoteSuccess = "DELETE_NOTE_SUCCESS",
  deleteNoteError   = "DELETE_NOTE_ERROR",
}

export const getNotesPending   = createAction<INoteStateContext>(NoteActionEnums.getNotesPending,   () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getNotesSuccess   = createAction<INoteStateContext, INote[]>(NoteActionEnums.getNotesSuccess, (notes: INote[]) => ({ isPending: false, isSuccess: true,  isError: false, notes }));
export const getNotesError     = createAction<INoteStateContext>(NoteActionEnums.getNotesError,     () => ({ isPending: false, isSuccess: false, isError: true  }));

export const getOneNotePending = createAction<INoteStateContext>(NoteActionEnums.getOneNotePending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const getOneNoteSuccess = createAction<INoteStateContext, INote>(NoteActionEnums.getOneNoteSuccess, (note: INote) => ({ isPending: false, isSuccess: true,  isError: false, note }));
export const getOneNoteError   = createAction<INoteStateContext>(NoteActionEnums.getOneNoteError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const createNotePending = createAction<INoteStateContext>(NoteActionEnums.createNotePending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const createNoteSuccess = createAction<INoteStateContext>(NoteActionEnums.createNoteSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const createNoteError   = createAction<INoteStateContext>(NoteActionEnums.createNoteError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const updateNotePending = createAction<INoteStateContext>(NoteActionEnums.updateNotePending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const updateNoteSuccess = createAction<INoteStateContext>(NoteActionEnums.updateNoteSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const updateNoteError   = createAction<INoteStateContext>(NoteActionEnums.updateNoteError,   () => ({ isPending: false, isSuccess: false, isError: true  }));

export const deleteNotePending = createAction<INoteStateContext>(NoteActionEnums.deleteNotePending, () => ({ isPending: true,  isSuccess: false, isError: false }));
export const deleteNoteSuccess = createAction<INoteStateContext>(NoteActionEnums.deleteNoteSuccess, () => ({ isPending: false, isSuccess: true,  isError: false }));
export const deleteNoteError   = createAction<INoteStateContext>(NoteActionEnums.deleteNoteError,   () => ({ isPending: false, isSuccess: false, isError: true  }));