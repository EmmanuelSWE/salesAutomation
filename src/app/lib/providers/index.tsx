'use client';
import { ReactNode, useContext, useReducer } from "react";
import { getAxiosInstance } from "../utils/axiosInstance";

/* ── contexts ── */
import {
  INITIAL_CLIENT_STATE,    ClientStateContext,    ClientActionsContext,    IClient,
  INITIAL_CONTACT_STATE,   ContactStateContext,   ContactActionsContext,   IContact,
  INITIAL_OPPORTUNITY_STATE, OpportunityStateContext, OpportunityActionsContext, IOpportunity,
  INITIAL_PROPOSAL_STATE,  ProposalStateContext,  ProposalActionsContext,  IProposal, IProposalLineItem,
  INITIAL_PRICING_STATE, PricingRequestStateContext, PricingRequestActionsContext, IPricingRequest,
  INITIAL_CONTRACT_STATE,  ContractStateContext,  ContractActionsContext,  IContract, IContractRenewal,
  INITIAL_ACTIVITY_STATE,  ActivityStateContext,  ActivityActionsContext,  IActivity,
  INITIAL_NOTE_STATE,      NoteStateContext,      NoteActionsContext,      INote,
} from "./context";

import { INITIAL_USER_STATE, UserStateContext, UserActionsContext, IUser } from "./context";
import type { OpportunityStage, ActivityStatus, ContractStatus, PricingRequestStatus, Priority, ActivityType, RelatedToType } from "../utils/apiEnums";

/* ── reducers ── */
import {
  UserReducer, ClientReducer, ContactReducer, OpportunityReducer,
  ProposalReducer, PricingRequestReducer, ContractReducer,
  ActivityReducer, NoteReducer,
} from "./reducers";

/* ── actions ── */
import {
  loginPending, loginSuccess, loginError,
  registerPending, registerSuccess, registerError,
  getUsersPending, getUsersSuccess, getUsersError,
  getOneUserPending, getOneUserSuccess, getOneUserError,
  updateUserPending, updateUserSuccess, updateUserError,
  deleteUserPending, deleteUserSuccess, deleteUserError,

  getClientsPending, getClientsSuccess, getClientsError,
  getOneClientPending, getOneClientSuccess, getOneClientError,
  createClientPending, createClientSuccess, createClientError,
  updateClientPending, updateClientSuccess, updateClientError,
  deleteClientPending, deleteClientSuccess, deleteClientError,

  getContactsPending, getContactsSuccess, getContactsError,
  getOneContactPending, getOneContactSuccess, getOneContactError,
  createContactPending, createContactSuccess, createContactError,
  updateContactPending, updateContactSuccess, updateContactError,
  deleteContactPending, deleteContactSuccess, deleteContactError,

  getOpportunitiesPending, getOpportunitiesSuccess, getOpportunitiesError,
  getOneOpportunityPending, getOneOpportunitySuccess, getOneOpportunityError,
  getStageHistoryPending, getStageHistorySuccess, getStageHistoryError,
  createOpportunityPending, createOpportunitySuccess, createOpportunityError,
  updateOpportunityPending, updateOpportunitySuccess, updateOpportunityError,
  deleteOpportunityPending, deleteOpportunitySuccess, deleteOpportunityError,

  getProposalsPending, getProposalsSuccess, getProposalsError,
  getOneProposalPending, getOneProposalSuccess, getOneProposalError,
  createProposalPending, createProposalSuccess, createProposalError,
  updateProposalPending, updateProposalSuccess, updateProposalError,
  deleteProposalPending, deleteProposalSuccess, deleteProposalError,

  getPricingRequestsPending, getPricingRequestsSuccess, getPricingRequestsError,
  getOnePricingRequestPending, getOnePricingRequestSuccess, getOnePricingRequestError,
  createPricingRequestPending, createPricingRequestSuccess, createPricingRequestError,
  updatePricingRequestPending, updatePricingRequestSuccess, updatePricingRequestError,

  getContractsPending, getContractsSuccess, getContractsError,
  getOneContractPending, getOneContractSuccess, getOneContractError,
  createContractPending, createContractSuccess, createContractError,
  updateContractPending, updateContractSuccess, updateContractError,
  deleteContractPending, deleteContractSuccess, deleteContractError,
  createRenewalPending, createRenewalSuccess, createRenewalError,

  getActivitiesPending, getActivitiesSuccess, getActivitiesError,
  getOneActivityPending, getOneActivitySuccess, getOneActivityError,
  createActivityPending, createActivitySuccess, createActivityError,
  updateActivityPending, updateActivitySuccess, updateActivityError,
  deleteActivityPending, deleteActivitySuccess, deleteActivityError,

  getNotesPending, getNotesSuccess, getNotesError,
  getOneNotePending, getOneNoteSuccess, getOneNoteError,
  createNotePending, createNoteSuccess, createNoteError,
  updateNotePending, updateNoteSuccess, updateNoteError,
  deleteNotePending, deleteNoteSuccess, deleteNoteError,
} from "./actions";

/* ══════════════════════════════════════════════════════
   USER PROVIDER
══════════════════════════════════════════════════════ */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_USER_STATE);
  const instance = getAxiosInstance();

  const loginUser = async (email: string, password: string) => {
    dispatch(loginPending());
    console.log(`email: ${email}, password: ${password}`);
    await instance.post(`/auth/login`, { email, password })
      .then(res => { console.log("login success", res.data); dispatch(loginSuccess(res.data)); })
      .catch(err => { console.log("login error", err.response?.data); dispatch(loginError()); });
  };

  const registerUser = async (user: IUser) => {
    dispatch(registerPending());
    await instance.post(`/auth/register`, user)
      .then(res => { console.log("register success", res.data); dispatch(registerSuccess(res.data)); })
      .catch(err => { console.log("register error", err.response?.data); dispatch(registerError()); });
  };

  const getUsers = async () => {
    dispatch(getUsersPending());
    await instance.get(`/users`)
      .then(res => { console.log("getUsers success", res.data); dispatch(getUsersSuccess(res.data)); })
      .catch(err => { console.log("getUsers error", err.response?.data); dispatch(getUsersError()); });
  };

  const getOneUser = async (id: string) => {
    dispatch(getOneUserPending());
    await instance.get(`/users/${id}`)
      .then(res => { console.log("getOneUser success", res.data); dispatch(getOneUserSuccess(res.data)); })
      .catch(err => { console.log("getOneUser error", err.response?.data); dispatch(getOneUserError()); });
  };

  const updateUser = async (id: string, user: Partial<IUser>) => {
    dispatch(updateUserPending());
    await instance.put(`/users/${id}`, user)
      .then(res => { console.log("updateUser success", res.data); dispatch(updateUserSuccess()); })
      .catch(err => { console.log("updateUser error", err.response?.data); dispatch(updateUserError()); });
  };

  const deleteUser = async (id: string) => {
    dispatch(deleteUserPending());
    await instance.delete(`/users/${id}`)
      .then(res => { console.log("deleteUser success", res.data); dispatch(deleteUserSuccess()); })
      .catch(err => { console.log("deleteUser error", err.response?.data); dispatch(deleteUserError()); });
  };

  return (
    <UserStateContext.Provider value={state}>
      <UserActionsContext.Provider value={{ registerUser, loginUser, getUsers, getOneUser, updateUser, deleteUser }}>
        {children}
      </UserActionsContext.Provider>
    </UserStateContext.Provider>
  );
};

export const useUserState  = () => { const ctx = useContext(UserStateContext);   if (!ctx) throw new Error("UserStateContext missing");   return ctx; };
export const useUserAction = () => { const ctx = useContext(UserActionsContext); if (!ctx) throw new Error("UserActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   CLIENT PROVIDER
══════════════════════════════════════════════════════ */
export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ClientReducer, INITIAL_CLIENT_STATE);
  const instance = getAxiosInstance();

  const getClients = async (params?: object) => {
    dispatch(getClientsPending());
    await instance.get(`/clients`, { params })
      .then(res => { console.log("getClients", res.data); dispatch(getClientsSuccess(res.data)); })
      .catch(err => { console.log("getClients error", err.response?.data); dispatch(getClientsError()); });
  };

  const getOneClient = async (id: string) => {
    dispatch(getOneClientPending());
    await instance.get(`/clients/${id}`)
      .then(res => { console.log("getOneClient", res.data); dispatch(getOneClientSuccess(res.data)); })
      .catch(err => { console.log("getOneClient error", err.response?.data); dispatch(getOneClientError()); });
  };

  const createClient = async (client: IClient) => {
    dispatch(createClientPending());
    await instance.post(`/clients`, client)
      .then(res => { console.log("createClient", res.data); dispatch(createClientSuccess()); })
      .catch(err => { console.log("createClient error", err.response?.data); dispatch(createClientError()); });
  };

  const updateClient = async (id: string, client: Partial<IClient>) => {
    dispatch(updateClientPending());
    await instance.put(`/clients/${id}`, client)
      .then(res => { console.log("updateClient", res.data); dispatch(updateClientSuccess()); })
      .catch(err => { console.log("updateClient error", err.response?.data); dispatch(updateClientError()); });
  };

  const deleteClient = async (id: string) => {
    dispatch(deleteClientPending());
    await instance.delete(`/clients/${id}`)
      .then(res => { console.log("deleteClient", res.data); dispatch(deleteClientSuccess()); })
      .catch(err => { console.log("deleteClient error", err.response?.data); dispatch(deleteClientError()); });
  };

  return (
    <ClientStateContext.Provider value={state}>
      <ClientActionsContext.Provider value={{ getClients, getOneClient, createClient, updateClient, deleteClient }}>
        {children}
      </ClientActionsContext.Provider>
    </ClientStateContext.Provider>
  );
};

export const useClientState  = () => { const ctx = useContext(ClientStateContext);   if (!ctx) throw new Error("ClientStateContext missing");   return ctx; };
export const useClientAction = () => { const ctx = useContext(ClientActionsContext); if (!ctx) throw new Error("ClientActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   CONTACT PROVIDER
══════════════════════════════════════════════════════ */
export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ContactReducer, INITIAL_CONTACT_STATE);
  const instance = getAxiosInstance();

  const getContacts = async (params?: object) => {
    dispatch(getContactsPending());
    await instance.get(`/contacts`, { params })
      .then(res => { console.log("getContacts", res.data); dispatch(getContactsSuccess(res.data)); })
      .catch(err => { console.log("getContacts error", err.response?.data); dispatch(getContactsError()); });
  };

  const getContactsByClient = async (clientId: string) => {
    dispatch(getContactsPending());
    await instance.get(`/contacts/by-client/${clientId}`)
      .then(res => { console.log("getContactsByClient", res.data); dispatch(getContactsSuccess(res.data)); })
      .catch(err => { console.log("getContactsByClient error", err.response?.data); dispatch(getContactsError()); });
  };

  const getOneContact = async (id: string) => {
    dispatch(getOneContactPending());
    await instance.get(`/contacts/${id}`)
      .then(res => { console.log("getOneContact", res.data); dispatch(getOneContactSuccess(res.data)); })
      .catch(err => { console.log("getOneContact error", err.response?.data); dispatch(getOneContactError()); });
  };

  const createContact = async (contact: IContact) => {
    dispatch(createContactPending());
    await instance.post(`/contacts`, contact)
      .then(res => { console.log("createContact", res.data); dispatch(createContactSuccess()); })
      .catch(err => { console.log("createContact error", err.response?.data); dispatch(createContactError()); });
  };

  const updateContact = async (id: string, contact: Partial<IContact>) => {
    dispatch(updateContactPending());
    await instance.put(`/contacts/${id}`, contact)
      .then(res => { console.log("updateContact", res.data); dispatch(updateContactSuccess()); })
      .catch(err => { console.log("updateContact error", err.response?.data); dispatch(updateContactError()); });
  };

  const setPrimaryContact = async (id: string) => {
    dispatch(updateContactPending());
    await instance.put(`/contacts/${id}/set-primary`)
      .then(res => { console.log("setPrimary", res.data); dispatch(updateContactSuccess()); })
      .catch(err => { console.log("setPrimary error", err.response?.data); dispatch(updateContactError()); });
  };

  const deleteContact = async (id: string) => {
    dispatch(deleteContactPending());
    await instance.delete(`/contacts/${id}`)
      .then(res => { console.log("deleteContact", res.data); dispatch(deleteContactSuccess()); })
      .catch(err => { console.log("deleteContact error", err.response?.data); dispatch(deleteContactError()); });
  };

  return (
    <ContactStateContext.Provider value={state}>
      <ContactActionsContext.Provider value={{ getContacts, getContactsByClient, getOneContact, createContact, updateContact, setPrimaryContact, deleteContact }}>
        {children}
      </ContactActionsContext.Provider>
    </ContactStateContext.Provider>
  );
};

export const useContactState  = () => { const ctx = useContext(ContactStateContext);   if (!ctx) throw new Error("ContactStateContext missing");   return ctx; };
export const useContactAction = () => { const ctx = useContext(ContactActionsContext); if (!ctx) throw new Error("ContactActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   OPPORTUNITY PROVIDER
══════════════════════════════════════════════════════ */
export const OpportunityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(OpportunityReducer, INITIAL_OPPORTUNITY_STATE);
  const instance = getAxiosInstance();

  const getOpportunities = async (params?: object) => {
    dispatch(getOpportunitiesPending());
    await instance.get(`/opportunities`, { params })
      .then(res => { console.log("getOpportunities", res.data); dispatch(getOpportunitiesSuccess(res.data)); })
      .catch(err => { console.log("getOpportunities error", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getMyOpportunities = async (params?: object) => {
    dispatch(getOpportunitiesPending());
    await instance.get(`/opportunities/my-opportunities`, { params })
      .then(res => { console.log("getMyOpportunities", res.data); dispatch(getOpportunitiesSuccess(res.data)); })
      .catch(err => { console.log("getMyOpportunities error", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getPipeline = async (ownerId?: string) => {
    dispatch(getOpportunitiesPending());
    await instance.get(`/opportunities/pipeline`, { params: ownerId ? { ownerId } : undefined })
      .then(res => { console.log("getPipeline", res.data); dispatch(getOpportunitiesSuccess(res.data)); })
      .catch(err => { console.log("getPipeline error", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getOneOpportunity = async (id: string) => {
    dispatch(getOneOpportunityPending());
    await instance.get(`/opportunities/${id}`)
      .then(res => { console.log("getOneOpportunity", res.data); dispatch(getOneOpportunitySuccess(res.data)); })
      .catch(err => { console.log("getOneOpportunity error", err.response?.data); dispatch(getOneOpportunityError()); });
  };

  const getStageHistory = async (id: string) => {
    dispatch(getStageHistoryPending());
    await instance.get(`/opportunities/${id}/stage-history`)
      .then(res => { console.log("getStageHistory", res.data); dispatch(getStageHistorySuccess(res.data)); })
      .catch(err => { console.log("getStageHistory error", err.response?.data); dispatch(getStageHistoryError()); });
  };

  const createOpportunity = async (opportunity: IOpportunity) => {
    dispatch(createOpportunityPending());
    await instance.post(`/opportunities`, opportunity)
      .then(res => { console.log("createOpportunity", res.data); dispatch(createOpportunitySuccess()); })
      .catch(err => { console.log("createOpportunity error", err.response?.data); dispatch(createOpportunityError()); });
  };

  const updateOpportunity = async (id: string, opportunity: Partial<IOpportunity>) => {
    dispatch(updateOpportunityPending());
    await instance.put(`/opportunities/${id}`, opportunity)
      .then(res => { console.log("updateOpportunity", res.data); dispatch(updateOpportunitySuccess()); })
      .catch(err => { console.log("updateOpportunity error", err.response?.data); dispatch(updateOpportunityError()); });
  };

  const updateStage = async (id: string, stage: OpportunityStage, reason?: string) => {
    dispatch(updateOpportunityPending());
    await instance.put(`/opportunities/${id}/stage`, { stage, reason })
      .then(res => { console.log("updateStage", res.data); dispatch(updateOpportunitySuccess()); })
      .catch(err => { console.log("updateStage error", err.response?.data); dispatch(updateOpportunityError()); });
  };

  const assignOpportunity = async (id: string, userId: string) => {
    dispatch(updateOpportunityPending());
    await instance.post(`/opportunities/${id}/assign`, { userId })
      .then(res => { console.log("assignOpportunity", res.data); dispatch(updateOpportunitySuccess()); })
      .catch(err => { console.log("assignOpportunity error", err.response?.data); dispatch(updateOpportunityError()); });
  };

  const deleteOpportunity = async (id: string) => {
    dispatch(deleteOpportunityPending());
    await instance.delete(`/opportunities/${id}`)
      .then(res => { console.log("deleteOpportunity", res.data); dispatch(deleteOpportunitySuccess()); })
      .catch(err => { console.log("deleteOpportunity error", err.response?.data); dispatch(deleteOpportunityError()); });
  };

  return (
    <OpportunityStateContext.Provider value={state}>
      <OpportunityActionsContext.Provider value={{ getOpportunities, getMyOpportunities, getPipeline, getOneOpportunity, getStageHistory, createOpportunity, updateOpportunity, updateStage, assignOpportunity, deleteOpportunity }}>
        {children}
      </OpportunityActionsContext.Provider>
    </OpportunityStateContext.Provider>
  );
};

export const useOpportunityState  = () => { const ctx = useContext(OpportunityStateContext);   if (!ctx) throw new Error("OpportunityStateContext missing");   return ctx; };
export const useOpportunityAction = () => { const ctx = useContext(OpportunityActionsContext); if (!ctx) throw new Error("OpportunityActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   PROPOSAL PROVIDER
══════════════════════════════════════════════════════ */
export const ProposalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ProposalReducer, INITIAL_PROPOSAL_STATE);
  const instance = getAxiosInstance();

  const getProposals = async (params?: object) => {
    dispatch(getProposalsPending());
    await instance.get(`/proposals`, { params })
      .then(res => { console.log("getProposals", res.data); dispatch(getProposalsSuccess(res.data)); })
      .catch(err => { console.log("getProposals error", err.response?.data); dispatch(getProposalsError()); });
  };

  const getOneProposal = async (id: string) => {
    dispatch(getOneProposalPending());
    await instance.get(`/proposals/${id}`)
      .then(res => { console.log("getOneProposal", res.data); dispatch(getOneProposalSuccess(res.data)); })
      .catch(err => { console.log("getOneProposal error", err.response?.data); dispatch(getOneProposalError()); });
  };

  const createProposal = async (proposal: IProposal) => {
    dispatch(createProposalPending());
    await instance.post(`/proposals`, proposal)
      .then(res => { console.log("createProposal", res.data); dispatch(createProposalSuccess()); })
      .catch(err => { console.log("createProposal error", err.response?.data); dispatch(createProposalError()); });
  };

  const updateProposal = async (id: string, proposal: Partial<IProposal>) => {
    dispatch(updateProposalPending());
    await instance.put(`/proposals/${id}`, proposal)
      .then(res => { console.log("updateProposal", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("updateProposal error", err.response?.data); dispatch(updateProposalError()); });
  };

  const addLineItem = async (proposalId: string, item: IProposalLineItem) => {
    dispatch(updateProposalPending());
    await instance.post(`/proposals/${proposalId}/line-items`, item)
      .then(res => { console.log("addLineItem", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("addLineItem error", err.response?.data); dispatch(updateProposalError()); });
  };

  const updateLineItem = async (proposalId: string, lineItemId: string, item: Partial<IProposalLineItem>) => {
    dispatch(updateProposalPending());
    await instance.put(`/proposals/${proposalId}/line-items/${lineItemId}`, item)
      .then(res => { console.log("updateLineItem", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("updateLineItem error", err.response?.data); dispatch(updateProposalError()); });
  };

  const removeLineItem = async (proposalId: string, lineItemId: string) => {
    dispatch(updateProposalPending());
    await instance.delete(`/proposals/${proposalId}/line-items/${lineItemId}`)
      .then(res => { console.log("removeLineItem", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("removeLineItem error", err.response?.data); dispatch(updateProposalError()); });
  };

  const submitProposal = async (id: string) => {
    dispatch(updateProposalPending());
    await instance.put(`/proposals/${id}/submit`)
      .then(res => { console.log("submitProposal", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("submitProposal error", err.response?.data); dispatch(updateProposalError()); });
  };

  const approveProposal = async (id: string) => {
    dispatch(updateProposalPending());
    await instance.put(`/proposals/${id}/approve`)
      .then(res => { console.log("approveProposal", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("approveProposal error", err.response?.data); dispatch(updateProposalError()); });
  };

  const rejectProposal = async (id: string, reason: string) => {
    dispatch(updateProposalPending());
    await instance.put(`/proposals/${id}/reject`, { reason })
      .then(res => { console.log("rejectProposal", res.data); dispatch(updateProposalSuccess()); })
      .catch(err => { console.log("rejectProposal error", err.response?.data); dispatch(updateProposalError()); });
  };

  const deleteProposal = async (id: string) => {
    dispatch(deleteProposalPending());
    await instance.delete(`/proposals/${id}`)
      .then(res => { console.log("deleteProposal", res.data); dispatch(deleteProposalSuccess()); })
      .catch(err => { console.log("deleteProposal error", err.response?.data); dispatch(deleteProposalError()); });
  };

  return (
    <ProposalStateContext.Provider value={state}>
      <ProposalActionsContext.Provider value={{ getProposals, getOneProposal, createProposal, updateProposal, addLineItem, updateLineItem, removeLineItem, submitProposal, approveProposal, rejectProposal, deleteProposal }}>
        {children}
      </ProposalActionsContext.Provider>
    </ProposalStateContext.Provider>
  );
};

export const useProposalState  = () => { const ctx = useContext(ProposalStateContext);   if (!ctx) throw new Error("ProposalStateContext missing");   return ctx; };
export const useProposalAction = () => { const ctx = useContext(ProposalActionsContext); if (!ctx) throw new Error("ProposalActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   PRICING REQUEST PROVIDER
══════════════════════════════════════════════════════ */
export const PricingRequestProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(PricingRequestReducer, INITIAL_PRICING_STATE);
  const instance = getAxiosInstance();

  const getPricingRequests = async (params?: object) => {
    dispatch(getPricingRequestsPending());
    await instance.get(`/pricingrequests`, { params })
      .then(res => { console.log("getPricingRequests", res.data); dispatch(getPricingRequestsSuccess(res.data)); })
      .catch(err => { console.log("getPricingRequests error", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getPendingRequests = async () => {
    dispatch(getPricingRequestsPending());
    await instance.get(`/pricingrequests/pending`)
      .then(res => { console.log("getPendingRequests", res.data); dispatch(getPricingRequestsSuccess(res.data)); })
      .catch(err => { console.log("getPendingRequests error", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getMyRequests = async () => {
    dispatch(getPricingRequestsPending());
    await instance.get(`/pricingrequests/my-requests`)
      .then(res => { console.log("getMyRequests", res.data); dispatch(getPricingRequestsSuccess(res.data)); })
      .catch(err => { console.log("getMyRequests error", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getOnePricingRequest = async (id: string) => {
    dispatch(getOnePricingRequestPending());
    await instance.get(`/pricingrequests/${id}`)
      .then(res => { console.log("getOnePricingRequest", res.data); dispatch(getOnePricingRequestSuccess(res.data)); })
      .catch(err => { console.log("getOnePricingRequest error", err.response?.data); dispatch(getOnePricingRequestError()); });
  };

  const createPricingRequest = async (request: IPricingRequest) => {
    dispatch(createPricingRequestPending());
    await instance.post(`/pricingrequests`, request)
      .then(res => { console.log("createPricingRequest", res.data); dispatch(createPricingRequestSuccess()); })
      .catch(err => { console.log("createPricingRequest error", err.response?.data); dispatch(createPricingRequestError()); });
  };

  const updatePricingRequest = async (id: string, request: Partial<IPricingRequest>) => {
    dispatch(updatePricingRequestPending());
    await instance.put(`/pricingrequests/${id}`, request)
      .then(res => { console.log("updatePricingRequest", res.data); dispatch(updatePricingRequestSuccess()); })
      .catch(err => { console.log("updatePricingRequest error", err.response?.data); dispatch(updatePricingRequestError()); });
  };

  const assignPricingRequest = async (id: string, userId: string) => {
    dispatch(updatePricingRequestPending());
    await instance.post(`/pricingrequests/${id}/assign`, { userId })
      .then(res => { console.log("assignPricingRequest", res.data); dispatch(updatePricingRequestSuccess()); })
      .catch(err => { console.log("assignPricingRequest error", err.response?.data); dispatch(updatePricingRequestError()); });
  };

  const completePricingRequest = async (id: string) => {
    dispatch(updatePricingRequestPending());
    await instance.put(`/pricingrequests/${id}/complete`)
      .then(res => { console.log("completePricingRequest", res.data); dispatch(updatePricingRequestSuccess()); })
      .catch(err => { console.log("completePricingRequest error", err.response?.data); dispatch(updatePricingRequestError()); });
  };

  return (
    <PricingRequestStateContext.Provider value={state}>
      <PricingRequestActionsContext.Provider value={{ getPricingRequests, getPendingRequests, getMyRequests, getOnePricingRequest, createPricingRequest, updatePricingRequest, assignPricingRequest, completePricingRequest }}>
        {children}
      </PricingRequestActionsContext.Provider>
    </PricingRequestStateContext.Provider>
  );
};

export const usePricingRequestState  = () => { const ctx = useContext(PricingRequestStateContext);   if (!ctx) throw new Error("PricingRequestStateContext missing");   return ctx; };
export const usePricingRequestAction = () => { const ctx = useContext(PricingRequestActionsContext); if (!ctx) throw new Error("PricingRequestActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   CONTRACT PROVIDER
══════════════════════════════════════════════════════ */
export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ContractReducer, INITIAL_CONTRACT_STATE);
  const instance = getAxiosInstance();

  const getContracts = async (params?: object) => {
    dispatch(getContractsPending());
    await instance.get(`/contracts`, { params })
      .then(res => { console.log("getContracts", res.data); dispatch(getContractsSuccess(res.data)); })
      .catch(err => { console.log("getContracts error", err.response?.data); dispatch(getContractsError()); });
  };

  const getOneContract = async (id: string) => {
    dispatch(getOneContractPending());
    await instance.get(`/contracts/${id}`)
      .then(res => { console.log("getOneContract", res.data); dispatch(getOneContractSuccess(res.data)); })
      .catch(err => { console.log("getOneContract error", err.response?.data); dispatch(getOneContractError()); });
  };

  const getExpiringContracts = async (daysUntilExpiry?: number) => {
    dispatch(getContractsPending());
    await instance.get(`/contracts/expiring`, { params: { daysUntilExpiry } })
      .then(res => { console.log("getExpiringContracts", res.data); dispatch(getContractsSuccess(res.data)); })
      .catch(err => { console.log("getExpiringContracts error", err.response?.data); dispatch(getContractsError()); });
  };

  const getContractsByClient = async (clientId: string) => {
    dispatch(getContractsPending());
    await instance.get(`/contracts/client/${clientId}`)
      .then(res => { console.log("getContractsByClient", res.data); dispatch(getContractsSuccess(res.data)); })
      .catch(err => { console.log("getContractsByClient error", err.response?.data); dispatch(getContractsError()); });
  };

  const createContract = async (contract: IContract) => {
    dispatch(createContractPending());
    await instance.post(`/contracts`, contract)
      .then(res => { console.log("createContract", res.data); dispatch(createContractSuccess()); })
      .catch(err => { console.log("createContract error", err.response?.data); dispatch(createContractError()); });
  };

  const updateContract = async (id: string, contract: Partial<IContract>) => {
    dispatch(updateContractPending());
    await instance.put(`/contracts/${id}`, contract)
      .then(res => { console.log("updateContract", res.data); dispatch(updateContractSuccess()); })
      .catch(err => { console.log("updateContract error", err.response?.data); dispatch(updateContractError()); });
  };

  const activateContract = async (id: string) => {
    dispatch(updateContractPending());
    await instance.put(`/contracts/${id}/activate`)
      .then(res => { console.log("activateContract", res.data); dispatch(updateContractSuccess()); })
      .catch(err => { console.log("activateContract error", err.response?.data); dispatch(updateContractError()); });
  };

  const cancelContract = async (id: string) => {
    dispatch(updateContractPending());
    await instance.put(`/contracts/${id}/cancel`)
      .then(res => { console.log("cancelContract", res.data); dispatch(updateContractSuccess()); })
      .catch(err => { console.log("cancelContract error", err.response?.data); dispatch(updateContractError()); });
  };

  const deleteContract = async (id: string) => {
    dispatch(deleteContractPending());
    await instance.delete(`/contracts/${id}`)
      .then(res => { console.log("deleteContract", res.data); dispatch(deleteContractSuccess()); })
      .catch(err => { console.log("deleteContract error", err.response?.data); dispatch(deleteContractError()); });
  };

  const createRenewal = async (contractId: string, renewal: IContractRenewal) => {
    dispatch(createRenewalPending());
    await instance.post(`/contracts/${contractId}/renewals`, renewal)
      .then(res => { console.log("createRenewal", res.data); dispatch(createRenewalSuccess(res.data)); })
      .catch(err => { console.log("createRenewal error", err.response?.data); dispatch(createRenewalError()); });
  };

  const completeRenewal = async (renewalId: string) => {
    dispatch(updateContractPending());
    await instance.put(`/contracts/renewals/${renewalId}/complete`)
      .then(res => { console.log("completeRenewal", res.data); dispatch(updateContractSuccess()); })
      .catch(err => { console.log("completeRenewal error", err.response?.data); dispatch(updateContractError()); });
  };

  return (
    <ContractStateContext.Provider value={state}>
      <ContractActionsContext.Provider value={{ getContracts, getOneContract, getExpiringContracts, getContractsByClient, createContract, updateContract, activateContract, cancelContract, deleteContract, createRenewal, completeRenewal }}>
        {children}
      </ContractActionsContext.Provider>
    </ContractStateContext.Provider>
  );
};

export const useContractState  = () => { const ctx = useContext(ContractStateContext);   if (!ctx) throw new Error("ContractStateContext missing");   return ctx; };
export const useContractAction = () => { const ctx = useContext(ContractActionsContext); if (!ctx) throw new Error("ContractActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   ACTIVITY PROVIDER
══════════════════════════════════════════════════════ */
export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ActivityReducer, INITIAL_ACTIVITY_STATE);
  const instance = getAxiosInstance();

  const getActivities = async (params?: object) => {
    dispatch(getActivitiesPending());
    await instance.get(`/activities`, { params })
      .then(res => { console.log("getActivities", res.data); dispatch(getActivitiesSuccess(res.data)); })
      .catch(err => { console.log("getActivities error", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getMyActivities = async (params?: object) => {
    dispatch(getActivitiesPending());
    await instance.get(`/activities/my-activities`, { params })
      .then(res => { console.log("getMyActivities", res.data); dispatch(getActivitiesSuccess(res.data)); })
      .catch(err => { console.log("getMyActivities error", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getUpcoming = async (daysAhead?: number) => {
    dispatch(getActivitiesPending());
    await instance.get(`/activities/upcoming`, { params: { daysAhead } })
      .then(res => { console.log("getUpcoming", res.data); dispatch(getActivitiesSuccess(res.data)); })
      .catch(err => { console.log("getUpcoming error", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOverdue = async () => {
    dispatch(getActivitiesPending());
    await instance.get(`/activities/overdue`)
      .then(res => { console.log("getOverdue", res.data); dispatch(getActivitiesSuccess(res.data)); })
      .catch(err => { console.log("getOverdue error", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOneActivity = async (id: string) => {
    dispatch(getOneActivityPending());
    await instance.get(`/activities/${id}`)
      .then(res => { console.log("getOneActivity", res.data); dispatch(getOneActivitySuccess(res.data)); })
      .catch(err => { console.log("getOneActivity error", err.response?.data); dispatch(getOneActivityError()); });
  };

  const createActivity = async (activity: IActivity) => {
    dispatch(createActivityPending());
    await instance.post(`/activities`, activity)
      .then(res => { console.log("createActivity", res.data); dispatch(createActivitySuccess()); })
      .catch(err => { console.log("createActivity error", err.response?.data); dispatch(createActivityError()); });
  };

  const updateActivity = async (id: string, activity: Partial<IActivity>) => {
    dispatch(updateActivityPending());
    await instance.put(`/activities/${id}`, activity)
      .then(res => { console.log("updateActivity", res.data); dispatch(updateActivitySuccess()); })
      .catch(err => { console.log("updateActivity error", err.response?.data); dispatch(updateActivityError()); });
  };

  const completeActivity = async (id: string, outcome: string) => {
    dispatch(updateActivityPending());
    await instance.put(`/activities/${id}/complete`, { outcome })
      .then(res => { console.log("completeActivity", res.data); dispatch(updateActivitySuccess()); })
      .catch(err => { console.log("completeActivity error", err.response?.data); dispatch(updateActivityError()); });
  };

  const cancelActivity = async (id: string) => {
    dispatch(updateActivityPending());
    await instance.put(`/activities/${id}/cancel`)
      .then(res => { console.log("cancelActivity", res.data); dispatch(updateActivitySuccess()); })
      .catch(err => { console.log("cancelActivity error", err.response?.data); dispatch(updateActivityError()); });
  };

  const deleteActivity = async (id: string) => {
    dispatch(deleteActivityPending());
    await instance.delete(`/activities/${id}`)
      .then(res => { console.log("deleteActivity", res.data); dispatch(deleteActivitySuccess()); })
      .catch(err => { console.log("deleteActivity error", err.response?.data); dispatch(deleteActivityError()); });
  };

  return (
    <ActivityStateContext.Provider value={state}>
      <ActivityActionsContext.Provider value={{ getActivities, getMyActivities, getUpcoming, getOverdue, getOneActivity, createActivity, updateActivity, completeActivity, cancelActivity, deleteActivity }}>
        {children}
      </ActivityActionsContext.Provider>
    </ActivityStateContext.Provider>
  );
};

export const useActivityState  = () => { const ctx = useContext(ActivityStateContext);   if (!ctx) throw new Error("ActivityStateContext missing");   return ctx; };
export const useActivityAction = () => { const ctx = useContext(ActivityActionsContext); if (!ctx) throw new Error("ActivityActionsContext missing"); return ctx; };

/* ══════════════════════════════════════════════════════
   NOTE PROVIDER
══════════════════════════════════════════════════════ */
export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(NoteReducer, INITIAL_NOTE_STATE);
  const instance = getAxiosInstance();

  const getNotes = async (params?: object) => {
    dispatch(getNotesPending());
    await instance.get(`/notes`, { params })
      .then(res => { console.log("getNotes", res.data); dispatch(getNotesSuccess(res.data)); })
      .catch(err => { console.log("getNotes error", err.response?.data); dispatch(getNotesError()); });
  };

  const getOneNote = async (id: string) => {
    dispatch(getOneNotePending());
    await instance.get(`/notes/${id}`)
      .then(res => { console.log("getOneNote", res.data); dispatch(getOneNoteSuccess(res.data)); })
      .catch(err => { console.log("getOneNote error", err.response?.data); dispatch(getOneNoteError()); });
  };

  const createNote = async (note: INote) => {
    dispatch(createNotePending());
    await instance.post(`/notes`, note)
      .then(res => { console.log("createNote", res.data); dispatch(createNoteSuccess()); })
      .catch(err => { console.log("createNote error", err.response?.data); dispatch(createNoteError()); });
  };

  const updateNote = async (id: string, note: Partial<INote>) => {
    dispatch(updateNotePending());
    await instance.put(`/notes/${id}`, note)
      .then(res => { console.log("updateNote", res.data); dispatch(updateNoteSuccess()); })
      .catch(err => { console.log("updateNote error", err.response?.data); dispatch(updateNoteError()); });
  };

  const deleteNote = async (id: string) => {
    dispatch(deleteNotePending());
    await instance.delete(`/notes/${id}`)
      .then(res => { console.log("deleteNote", res.data); dispatch(deleteNoteSuccess()); })
      .catch(err => { console.log("deleteNote error", err.response?.data); dispatch(deleteNoteError()); });
  };

  return (
    <NoteStateContext.Provider value={state}>
      <NoteActionsContext.Provider value={{ getNotes, getOneNote, createNote, updateNote, deleteNote }}>
        {children}
      </NoteActionsContext.Provider>
    </NoteStateContext.Provider>
  );
};

export const useNoteState  = () => { const ctx = useContext(NoteStateContext);   if (!ctx) throw new Error("NoteStateContext missing");   return ctx; };
export const useNoteAction = () => { const ctx = useContext(NoteActionsContext); if (!ctx) throw new Error("NoteActionsContext missing"); return ctx; };