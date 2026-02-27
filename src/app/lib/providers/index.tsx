'use client';

import { ReactNode, useContext, useReducer, useEffect } from "react";

/* ── axios instance ── */
import api from "../utils/axiosInstance";

/* ── contexts ── */
import {
  INITIAL_CLIENT_STATE,    ClientStateContext,    ClientActionsContext,
  INITIAL_CONTACT_STATE,   ContactStateContext,   ContactActionsContext,
  INITIAL_OPPORTUNITY_STATE, OpportunityStateContext, OpportunityActionsContext,
  INITIAL_PROPOSAL_STATE,  ProposalStateContext,  ProposalActionsContext,
  INITIAL_PRICING_STATE,   PricingRequestStateContext, PricingRequestActionsContext,
  INITIAL_CONTRACT_STATE,  ContractStateContext,  ContractActionsContext,
  INITIAL_ACTIVITY_STATE,  ActivityStateContext,  ActivityActionsContext,
  INITIAL_NOTE_STATE,      NoteStateContext,      NoteActionsContext,
  INITIAL_USER_STATE,      UserStateContext,      UserActionsContext,
} from "./context";

/* ── reducers ── */
import {
  UserReducer, ClientReducer, ContactReducer, OpportunityReducer,
  ProposalReducer, PricingRequestReducer, ContractReducer,
  ActivityReducer, NoteReducer,
} from "./reducers";

/* ── actions ── */
import {
  loginPending, loginSuccess, loginError,
  getUsersPending, getUsersSuccess, getUsersError,
  getOneUserPending, getOneUserSuccess, getOneUserError,

  getClientsPending, getClientsSuccess, getClientsError,
  getOneClientPending, getOneClientSuccess, getOneClientError,

  getContactsPending, getContactsSuccess, getContactsError,
  getOneContactPending, getOneContactSuccess, getOneContactError,

  getOpportunitiesPending, getOpportunitiesSuccess, getOpportunitiesError,
  getOneOpportunityPending, getOneOpportunitySuccess, getOneOpportunityError,
  getStageHistoryPending, getStageHistorySuccess, getStageHistoryError,

  getProposalsPending, getProposalsSuccess, getProposalsError,
  getOneProposalPending, getOneProposalSuccess, getOneProposalError,

  getPricingRequestsPending, getPricingRequestsSuccess, getPricingRequestsError,
  getOnePricingRequestPending, getOnePricingRequestSuccess, getOnePricingRequestError,

  getContractsPending, getContractsSuccess, getContractsError,
  getOneContractPending, getOneContractSuccess, getOneContractError,

  getActivitiesPending, getActivitiesSuccess, getActivitiesError,
  getOneActivityPending, getOneActivitySuccess, getOneActivityError,

  getNotesPending, getNotesSuccess, getNotesError,
  getOneNotePending, getOneNoteSuccess, getOneNoteError,
} from "./actions";

/* ══════════════════════════════════════════════════════
   USER PROVIDER
══════════════════════════════════════════════════════ */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_USER_STATE);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
    if (match) {
      dispatch(loginPending());
      api.get("/auth/me")
        .then(res => dispatch(loginSuccess(res.data)))
        .catch(() => dispatch(loginError()));
    }
  }, []);

  const getUsers = async () => {
    dispatch(getUsersPending());
    await api.get("/users")
      .then(res => dispatch(getUsersSuccess(res.data)))
      .catch(err => { console.error("getUsers", err.response?.data); dispatch(getUsersError()); });
  };

  const getOneUser = async (id: string) => {
    dispatch(getOneUserPending());
    await api.get(`/users/${id}`)
      .then(res => dispatch(getOneUserSuccess(res.data)))
      .catch(err => { console.error("getOneUser", err.response?.data); dispatch(getOneUserError()); });
  };

  const logoutUser = () => {
    document.cookie = "auth_token=; Max-Age=0; path=/";
    dispatch(loginError());
    window.location.href = "/login";
  };

  return (
    <UserStateContext.Provider value={state}>
      <UserActionsContext.Provider value={{ getUsers, getOneUser, logoutUser }}>
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

  const getClients = async (params?: object) => {
    dispatch(getClientsPending());
    await api.get("/clients", { params })
      .then(res => dispatch(getClientsSuccess(res.data)))
      .catch(err => { console.error("getClients", err.response?.data); dispatch(getClientsError()); });
  };

  const getOneClient = async (id: string) => {
    dispatch(getOneClientPending());
    await api.get(`/clients/${id}`)
      .then(res => dispatch(getOneClientSuccess(res.data)))
      .catch(err => { console.error("getOneClient", err.response?.data); dispatch(getOneClientError()); });
  };

  return (
    <ClientStateContext.Provider value={state}>
      <ClientActionsContext.Provider value={{ getClients, getOneClient }}>
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

  const getContacts = async (params?: object) => {
    dispatch(getContactsPending());
    await api.get("/contacts", { params })
      .then(res => dispatch(getContactsSuccess(res.data)))
      .catch(err => { console.error("getContacts", err.response?.data); dispatch(getContactsError()); });
  };

  const getContactsByClient = async (clientId: string) => {
    dispatch(getContactsPending());
    await api.get(`/contacts/by-client/${clientId}`)
      .then(res => dispatch(getContactsSuccess(res.data)))
      .catch(err => { console.error("getContactsByClient", err.response?.data); dispatch(getContactsError()); });
  };

  const getOneContact = async (id: string) => {
    dispatch(getOneContactPending());
    await api.get(`/contacts/${id}`)
      .then(res => dispatch(getOneContactSuccess(res.data)))
      .catch(err => { console.error("getOneContact", err.response?.data); dispatch(getOneContactError()); });
  };

  return (
    <ContactStateContext.Provider value={state}>
      <ContactActionsContext.Provider value={{ getContacts, getContactsByClient, getOneContact }}>
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

  const getOpportunities = async (params?: object) => {
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities", { params })
      .then(res => dispatch(getOpportunitiesSuccess(res.data)))
      .catch(err => { console.error("getOpportunities", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getMyOpportunities = async (params?: object) => {
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities/my-opportunities", { params })
      .then(res => dispatch(getOpportunitiesSuccess(res.data)))
      .catch(err => { console.error("getMyOpportunities", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getPipeline = async (ownerId?: string) => {
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities/pipeline", { params: ownerId ? { ownerId } : undefined })
      .then(res => dispatch(getOpportunitiesSuccess(res.data)))
      .catch(err => { console.error("getPipeline", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getOneOpportunity = async (id: string) => {
    dispatch(getOneOpportunityPending());
    await api.get(`/opportunities/${id}`)
      .then(res => dispatch(getOneOpportunitySuccess(res.data)))
      .catch(err => { console.error("getOneOpportunity", err.response?.data); dispatch(getOneOpportunityError()); });
  };

  const getStageHistory = async (id: string) => {
    dispatch(getStageHistoryPending());
    await api.get(`/opportunities/${id}/stage-history`)
      .then(res => dispatch(getStageHistorySuccess(res.data)))
      .catch(err => { console.error("getStageHistory", err.response?.data); dispatch(getStageHistoryError()); });
  };

  return (
    <OpportunityStateContext.Provider value={state}>
      <OpportunityActionsContext.Provider value={{ getOpportunities, getMyOpportunities, getPipeline, getOneOpportunity, getStageHistory }}>
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

  const getProposals = async (params?: object) => {
    dispatch(getProposalsPending());
    await api.get("/proposals", { params })
      .then(res => dispatch(getProposalsSuccess(res.data)))
      .catch(err => { console.error("getProposals", err.response?.data); dispatch(getProposalsError()); });
  };

  const getOneProposal = async (id: string) => {
    dispatch(getOneProposalPending());
    await api.get(`/proposals/${id}`)
      .then(res => dispatch(getOneProposalSuccess(res.data)))
      .catch(err => { console.error("getOneProposal", err.response?.data); dispatch(getOneProposalError()); });
  };

  return (
    <ProposalStateContext.Provider value={state}>
      <ProposalActionsContext.Provider value={{ getProposals, getOneProposal }}>
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

  const getPricingRequests = async (params?: object) => {
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests", { params })
      .then(res => dispatch(getPricingRequestsSuccess(res.data)))
      .catch(err => { console.error("getPricingRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getPendingRequests = async () => {
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests/pending")
      .then(res => dispatch(getPricingRequestsSuccess(res.data)))
      .catch(err => { console.error("getPendingRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getMyRequests = async () => {
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests/my-requests")
      .then(res => dispatch(getPricingRequestsSuccess(res.data)))
      .catch(err => { console.error("getMyRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getOnePricingRequest = async (id: string) => {
    dispatch(getOnePricingRequestPending());
    await api.get(`/pricingrequests/${id}`)
      .then(res => dispatch(getOnePricingRequestSuccess(res.data)))
      .catch(err => { console.error("getOnePricingRequest", err.response?.data); dispatch(getOnePricingRequestError()); });
  };

  return (
    <PricingRequestStateContext.Provider value={state}>
      <PricingRequestActionsContext.Provider value={{ getPricingRequests, getPendingRequests, getMyRequests, getOnePricingRequest }}>
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

  const getContracts = async (params?: object) => {
    dispatch(getContractsPending());
    await api.get("/contracts", { params })
      .then(res => dispatch(getContractsSuccess(res.data)))
      .catch(err => { console.error("getContracts", err.response?.data); dispatch(getContractsError()); });
  };

  const getOneContract = async (id: string) => {
    dispatch(getOneContractPending());
    await api.get(`/contracts/${id}`)
      .then(res => dispatch(getOneContractSuccess(res.data)))
      .catch(err => { console.error("getOneContract", err.response?.data); dispatch(getOneContractError()); });
  };

  const getExpiringContracts = async (daysUntilExpiry?: number) => {
    dispatch(getContractsPending());
    await api.get("/contracts/expiring", { params: { daysUntilExpiry } })
      .then(res => dispatch(getContractsSuccess(res.data)))
      .catch(err => { console.error("getExpiringContracts", err.response?.data); dispatch(getContractsError()); });
  };

  const getContractsByClient = async (clientId: string) => {
    dispatch(getContractsPending());
    await api.get(`/contracts/client/${clientId}`)
      .then(res => dispatch(getContractsSuccess(res.data)))
      .catch(err => { console.error("getContractsByClient", err.response?.data); dispatch(getContractsError()); });
  };

  return (
    <ContractStateContext.Provider value={state}>
      <ContractActionsContext.Provider value={{ getContracts, getOneContract, getExpiringContracts, getContractsByClient }}>
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

  const getActivities = async (params?: object) => {
    dispatch(getActivitiesPending());
    await api.get("/activities", { params })
      .then(res => dispatch(getActivitiesSuccess(res.data)))
      .catch(err => { console.error("getActivities", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getMyActivities = async (params?: object) => {
    dispatch(getActivitiesPending());
    await api.get("/activities/my-activities", { params })
      .then(res => dispatch(getActivitiesSuccess(res.data)))
      .catch(err => { console.error("getMyActivities", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getUpcoming = async (daysAhead?: number) => {
    dispatch(getActivitiesPending());
    await api.get("/activities/upcoming", { params: { daysAhead } })
      .then(res => dispatch(getActivitiesSuccess(res.data)))
      .catch(err => { console.error("getUpcoming", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOverdue = async () => {
    dispatch(getActivitiesPending());
    await api.get("/activities/overdue")
      .then(res => dispatch(getActivitiesSuccess(res.data)))
      .catch(err => { console.error("getOverdue", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOneActivity = async (id: string) => {
    dispatch(getOneActivityPending());
    await api.get(`/activities/${id}`)
      .then(res => dispatch(getOneActivitySuccess(res.data)))
      .catch(err => { console.error("getOneActivity", err.response?.data); dispatch(getOneActivityError()); });
  };

  return (
    <ActivityStateContext.Provider value={state}>
      <ActivityActionsContext.Provider value={{ getActivities, getMyActivities, getUpcoming, getOverdue, getOneActivity }}>
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

  const getNotes = async (params?: object) => {
    dispatch(getNotesPending());
    await api.get("/notes", { params })
      .then(res => dispatch(getNotesSuccess(res.data)))
      .catch(err => { console.error("getNotes", err.response?.data); dispatch(getNotesError()); });
  };

  const getOneNote = async (id: string) => {
    dispatch(getOneNotePending());
    await api.get(`/notes/${id}`)
      .then(res => dispatch(getOneNoteSuccess(res.data)))
      .catch(err => { console.error("getOneNote", err.response?.data); dispatch(getOneNoteError()); });
  };

  return (
    <NoteStateContext.Provider value={state}>
      <NoteActionsContext.Provider value={{ getNotes, getOneNote }}>
        {children}
      </NoteActionsContext.Provider>
    </NoteStateContext.Provider>
  );
};

export const useNoteState  = () => { const ctx = useContext(NoteStateContext);   if (!ctx) throw new Error("NoteStateContext missing");   return ctx; };
export const useNoteAction = () => { const ctx = useContext(NoteActionsContext); if (!ctx) throw new Error("NoteActionsContext missing"); return ctx; };