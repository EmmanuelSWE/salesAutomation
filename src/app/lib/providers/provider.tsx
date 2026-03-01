'use client';

import { ReactNode, useContext, useReducer, useEffect, useMemo, useState } from "react";

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
  updateActivityPending, updateActivitySuccess, updateActivityError,

  getNotesPending, getNotesSuccess, getNotesError,
  getOneNotePending, getOneNoteSuccess, getOneNoteError,
} from "./actions";

/** Handles both plain-array and paginated `{ items: [] }` API responses. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalize = (data: unknown): any[] =>
  Array.isArray(data) ? data : ((data as { items?: unknown[] })?.items ?? []);

/* ══════════════════════════════════════════════════════
   USER PROVIDER
   Reads auth_token from localStorage on mount, calls
   /auth/me to rehydrate, and stores { ...user, token }
   in state so every child provider can access the token
   via useContext(UserStateContext).
══════════════════════════════════════════════════════ */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, INITIAL_USER_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token  = globalThis.window ? localStorage.getItem("auth_token")   : null;
    const userId = globalThis.window ? localStorage.getItem("auth_user_id") : null;

    if (token && userId) {
      dispatch(loginPending());
      api.get(`/users/${userId}`)
        .then(res => {
          console.log("[UserProvider] /users/:id success:", res.data);
          dispatch(loginSuccess({ ...res.data, token }));
          setAuthToken(token);
          setIsInitialized(true);
        })
        .catch((err) => {
          console.error("[UserProvider] /users/:id failed — status:", err.response?.status, "| data:", err.response?.data, "| message:", err.message);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user_id");
          dispatch(loginError());
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, []);

  const getUsers = async (params?: { role?: string; isActive?: boolean; [key: string]: unknown }) => {
    dispatch(getUsersPending());
    await api.get("/users", { params })
      .then(({ data }) => dispatch(getUsersSuccess(Array.isArray(data) ? data : (data.items ?? []))))
      .catch(err => { console.error("getUsers", err.response?.data); dispatch(getUsersError()); });
  };

  const getOneUser = async (id: string) => {
    dispatch(getOneUserPending());
    await api.get(`/users/${id}`)
      .then(res => dispatch(getOneUserSuccess(res.data)))
      .catch(err => { console.error("getOneUser", err.response?.data); dispatch(getOneUserError()); });
  };

  const logoutUser = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_id");
    setAuthToken(undefined);
    dispatch(loginError());
    globalThis.location.href = "/login";
  };

  const userActions = useMemo(
    () => ({ getUsers, getOneUser, logoutUser }),
    [state.token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const userStateValue = useMemo(
    () => ({ ...state, token: authToken, isInitialized }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, authToken, isInitialized]
  );

  return (
    <UserStateContext.Provider value={userStateValue}>
      <UserActionsContext.Provider value={userActions}>
        {children}
      </UserActionsContext.Provider>
    </UserStateContext.Provider>
  );
};

export const useUserState  = () => useContext(UserStateContext);
export const useUserAction = () => useContext(UserActionsContext);

/* ══════════════════════════════════════════════════════
   CLIENT PROVIDER
══════════════════════════════════════════════════════ */
export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ClientReducer, INITIAL_CLIENT_STATE);
  const { token } = useContext(UserStateContext);

  const getClients = async (params?: { pageNumber?: number; pageSize?: number; [key: string]: unknown }) => {
    dispatch(getClientsPending());
    await api.get("/clients", { params })
      .then(({ data }) => dispatch(getClientsSuccess(data)))
      .catch(err => { console.error("getClients", err.response?.data); dispatch(getClientsError()); });
  };

  const getOneClient = async (id: string) => {
    dispatch(getOneClientPending());
    await api.get(`/clients/${id}`)
      .then(res => dispatch(getOneClientSuccess(res.data)))
      .catch(err => { console.error("getOneClient", err.response?.data); dispatch(getOneClientError()); });
  };

  const clientActions = useMemo(
    () => ({ getClients, getOneClient }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ClientStateContext.Provider value={state}>
      <ClientActionsContext.Provider value={clientActions}>
        {children}
      </ClientActionsContext.Provider>
    </ClientStateContext.Provider>
  );
};

export const useClientState  = () => useContext(ClientStateContext);
export const useClientAction = () => useContext(ClientActionsContext);

/* ══════════════════════════════════════════════════════
   CONTACT PROVIDER
══════════════════════════════════════════════════════ */
export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ContactReducer, INITIAL_CONTACT_STATE);
  const { token } = useContext(UserStateContext);

  const getContacts = async (params?: object) => {
    dispatch(getContactsPending());
    await api.get("/contacts", { params })
      .then(({ data }) => dispatch(getContactsSuccess(normalize(data))))
      .catch(err => { console.error("getContacts", err.response?.data); dispatch(getContactsError()); });
  };

  const getContactsByClient = async (clientId: string) => {
    dispatch(getContactsPending());
    await api.get(`/contacts/by-client/${clientId}`)
      .then(({ data }) => dispatch(getContactsSuccess(normalize(data))))
      .catch(err => { console.error("getContactsByClient", err.response?.data); dispatch(getContactsError()); });
  };

  const getOneContact = async (id: string) => {
    dispatch(getOneContactPending());
    await api.get(`/contacts/${id}`)
      .then(res => dispatch(getOneContactSuccess(res.data)))
      .catch(err => { console.error("getOneContact", err.response?.data); dispatch(getOneContactError()); });
  };

  const contactActions = useMemo(
    () => ({ getContacts, getContactsByClient, getOneContact }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ContactStateContext.Provider value={state}>
      <ContactActionsContext.Provider value={contactActions}>
        {children}
      </ContactActionsContext.Provider>
    </ContactStateContext.Provider>
  );
};

export const useContactState  = () => useContext(ContactStateContext);
export const useContactAction = () => useContext(ContactActionsContext);

/* ══════════════════════════════════════════════════════
   OPPORTUNITY PROVIDER
══════════════════════════════════════════════════════ */
export const OpportunityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(OpportunityReducer, INITIAL_OPPORTUNITY_STATE);
  const { token } = useContext(UserStateContext);

  const getOpportunities = async (params?: object) => {
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities", { params })
      .then(({ data }) => dispatch(getOpportunitiesSuccess(normalize(data))))
      .catch(err => { console.error("getOpportunities", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getMyOpportunities = async (params?: object) => {
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities/my-opportunities", { params })
      .then(({ data }) => dispatch(getOpportunitiesSuccess(normalize(data))))
      .catch(err => { console.error("getMyOpportunities", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getPipeline = async (ownerId?: string) => {
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities/pipeline", { params: ownerId ? { ownerId } : undefined })
      .then(({ data }) => dispatch(getOpportunitiesSuccess(normalize(data))))
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
      .then(({ data }) => dispatch(getStageHistorySuccess(normalize(data))))
      .catch(err => { console.error("getStageHistory", err.response?.data); dispatch(getStageHistoryError()); });
  };

  const advanceStage = async (id: string, stage: number, reason?: string) => {
    await api.put(`/opportunities/${id}/stage`, { stage, reason })
      .then(() => getOneOpportunity(id))
      .catch(err => console.error("advanceStage", err.response?.data));
  };

  const opportunityActions = useMemo(
    () => ({ getOpportunities, getMyOpportunities, getPipeline, getOneOpportunity, getStageHistory, advanceStage }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <OpportunityStateContext.Provider value={state}>
      <OpportunityActionsContext.Provider value={opportunityActions}>
        {children}
      </OpportunityActionsContext.Provider>
    </OpportunityStateContext.Provider>
  );
};

export const useOpportunityState  = () => useContext(OpportunityStateContext);
export const useOpportunityAction = () => useContext(OpportunityActionsContext);

/* ══════════════════════════════════════════════════════
   PROPOSAL PROVIDER
══════════════════════════════════════════════════════ */
export const ProposalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ProposalReducer, INITIAL_PROPOSAL_STATE);
  const { token } = useContext(UserStateContext);

  const getProposals = async (params?: object) => {
    dispatch(getProposalsPending());
    await api.get("/proposals", { params })
      .then(({ data }) => dispatch(getProposalsSuccess(normalize(data))))
      .catch(err => { console.error("getProposals", err.response?.data); dispatch(getProposalsError()); });
  };

  const getOneProposal = async (id: string) => {
    dispatch(getOneProposalPending());
    await api.get(`/proposals/${id}`)
      .then(res => dispatch(getOneProposalSuccess(res.data)))
      .catch(err => { console.error("getOneProposal", err.response?.data); dispatch(getOneProposalError()); });
  };

  const submitProposal = async (id: string) => {
    await api.put(`/proposals/${id}/submit`, {})
      .then(() => getOneProposal(id))
      .catch(err => console.error("submitProposal", err.response?.data));
  };

  const approveProposal = async (id: string, comment?: string) => {
    await api.put(`/proposals/${id}/approve`, comment ? { comment } : {})
      .then(() => getOneProposal(id))
      .catch(err => console.error("approveProposal", err.response?.data));
  };

  const proposalActions = useMemo(
    () => ({ getProposals, getOneProposal, submitProposal, approveProposal }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ProposalStateContext.Provider value={state}>
      <ProposalActionsContext.Provider value={proposalActions}>
        {children}
      </ProposalActionsContext.Provider>
    </ProposalStateContext.Provider>
  );
};

export const useProposalState  = () => useContext(ProposalStateContext);
export const useProposalAction = () => useContext(ProposalActionsContext);

/* ══════════════════════════════════════════════════════
   PRICING REQUEST PROVIDER
══════════════════════════════════════════════════════ */
export const PricingRequestProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(PricingRequestReducer, INITIAL_PRICING_STATE);
  const { token } = useContext(UserStateContext);

  const getPricingRequests = async (params?: object) => {
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests", { params })
      .then(({ data }) => dispatch(getPricingRequestsSuccess(normalize(data))))
      .catch(err => { console.error("getPricingRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getPendingRequests = async () => {
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests/pending")
      .then(({ data }) => dispatch(getPricingRequestsSuccess(normalize(data))))
      .catch(err => { console.error("getPendingRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getMyRequests = async () => {
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests/my-requests")
      .then(({ data }) => dispatch(getPricingRequestsSuccess(normalize(data))))
      .catch(err => { console.error("getMyRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getOnePricingRequest = async (id: string) => {
    dispatch(getOnePricingRequestPending());
    await api.get(`/pricingrequests/${id}`)
      .then(res => dispatch(getOnePricingRequestSuccess(res.data)))
      .catch(err => { console.error("getOnePricingRequest", err.response?.data); dispatch(getOnePricingRequestError()); });
  };

  const assignRequest = async (id: string, assignedToId: string) => {
    await api.post(`/pricingrequests/${id}/assign`, { assignedToId })
      .then(() => getOnePricingRequest(id))
      .catch(err => console.error("assignRequest", err.response?.data));
  };

  const pricingActions = useMemo(
    () => ({ getPricingRequests, getPendingRequests, getMyRequests, getOnePricingRequest, assignRequest }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <PricingRequestStateContext.Provider value={state}>
      <PricingRequestActionsContext.Provider value={pricingActions}>
        {children}
      </PricingRequestActionsContext.Provider>
    </PricingRequestStateContext.Provider>
  );
};

export const usePricingRequestState  = () => useContext(PricingRequestStateContext);
export const usePricingRequestAction = () => useContext(PricingRequestActionsContext);

/* ══════════════════════════════════════════════════════
   CONTRACT PROVIDER
══════════════════════════════════════════════════════ */
export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ContractReducer, INITIAL_CONTRACT_STATE);
  const { token } = useContext(UserStateContext);

  const getContracts = async (params?: object) => {
    dispatch(getContractsPending());
    await api.get("/contracts", { params })
      .then(({ data }) => dispatch(getContractsSuccess(normalize(data))))
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
      .then(({ data }) => dispatch(getContractsSuccess(normalize(data))))
      .catch(err => { console.error("getExpiringContracts", err.response?.data); dispatch(getContractsError()); });
  };

  const getContractsByClient = async (clientId: string) => {
    dispatch(getContractsPending());
    await api.get(`/contracts/client/${clientId}`)
      .then(({ data }) => dispatch(getContractsSuccess(normalize(data))))
      .catch(err => { console.error("getContractsByClient", err.response?.data); dispatch(getContractsError()); });
  };

  const activateContract = async (id: string) => {
    await api.put(`/contracts/${id}/activate`, {})
      .then(() => getOneContract(id))
      .catch(err => console.error("activateContract", err.response?.data));
  };

  const completeRenewal = async (renewalId: string) => {
    await api.put(`/contracts/renewals/${renewalId}/complete`, {})
      .catch(err => console.error("completeRenewal", err.response?.data));
  };

  const contractActions = useMemo(
    () => ({ getContracts, getOneContract, getExpiringContracts, getContractsByClient, activateContract, completeRenewal }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ContractStateContext.Provider value={state}>
      <ContractActionsContext.Provider value={contractActions}>
        {children}
      </ContractActionsContext.Provider>
    </ContractStateContext.Provider>
  );
};

export const useContractState  = () => useContext(ContractStateContext);
export const useContractAction = () => useContext(ContractActionsContext);

/* ══════════════════════════════════════════════════════
   ACTIVITY PROVIDER
══════════════════════════════════════════════════════ */
export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ActivityReducer, INITIAL_ACTIVITY_STATE);
  const { token } = useContext(UserStateContext);

  const getActivities = async (params?: object) => {
    dispatch(getActivitiesPending());
    await api.get("/activities", { params })
      .then(({ data }) => dispatch(getActivitiesSuccess(normalize(data))))
      .catch(err => { console.error("getActivities", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getMyActivities = async (params?: object) => {
    dispatch(getActivitiesPending());
    await api.get("/activities/my-activities", { params })
      .then(({ data }) => dispatch(getActivitiesSuccess(normalize(data))))
      .catch(err => { console.error("getMyActivities", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getUpcoming = async (daysAhead?: number) => {
    dispatch(getActivitiesPending());
    await api.get("/activities/upcoming", { params: { daysAhead } })
      .then(({ data }) => dispatch(getActivitiesSuccess(normalize(data))))
      .catch(err => { console.error("getUpcoming", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOverdue = async () => {
    dispatch(getActivitiesPending());
    await api.get("/activities/overdue")
      .then(({ data }) => dispatch(getActivitiesSuccess(normalize(data))))
      .catch(err => { console.error("getOverdue", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOneActivity = async (id: string) => {
    dispatch(getOneActivityPending());
    await api.get(`/activities/${id}`)
      .then(res => dispatch(getOneActivitySuccess(res.data)))
      .catch(err => { console.error("getOneActivity", err.response?.data); dispatch(getOneActivityError()); });
  };

  const updateActivity = async (id: string, payload: Partial<import('./context').IActivity>) => {
    dispatch(updateActivityPending());
    await api.put(`/activities/${id}`, payload)
      .then(res => { dispatch(updateActivitySuccess()); dispatch(getOneActivitySuccess(res.data)); })
      .catch(err => { console.error("updateActivity", err.response?.data); dispatch(updateActivityError()); });
  };

  const activityActions = useMemo(
    () => ({ getActivities, getMyActivities, getUpcoming, getOverdue, getOneActivity, updateActivity }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ActivityStateContext.Provider value={state}>
      <ActivityActionsContext.Provider value={activityActions}>
        {children}
      </ActivityActionsContext.Provider>
    </ActivityStateContext.Provider>
  );
};

export const useActivityState  = () => useContext(ActivityStateContext);
export const useActivityAction = () => useContext(ActivityActionsContext);

/* ══════════════════════════════════════════════════════
   NOTE PROVIDER
══════════════════════════════════════════════════════ */
export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(NoteReducer, INITIAL_NOTE_STATE);
  const { token } = useContext(UserStateContext);

  const getNotes = async (params?: object) => {
    dispatch(getNotesPending());
    await api.get("/notes", { params })
      .then(({ data }) => dispatch(getNotesSuccess(normalize(data))))
      .catch(err => { console.error("getNotes", err.response?.data); dispatch(getNotesError()); });
  };

  const getOneNote = async (id: string) => {
    dispatch(getOneNotePending());
    await api.get(`/notes/${id}`)
      .then(res => dispatch(getOneNoteSuccess(res.data)))
      .catch(err => { console.error("getOneNote", err.response?.data); dispatch(getOneNoteError()); });
  };

  const noteActions = useMemo(
    () => ({ getNotes, getOneNote }),
    [token] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <NoteStateContext.Provider value={state}>
      <NoteActionsContext.Provider value={noteActions}>
        {children}
      </NoteActionsContext.Provider>
    </NoteStateContext.Provider>
  );
};

export const useNoteState  = () => useContext(NoteStateContext);
export const useNoteAction = () => useContext(NoteActionsContext);