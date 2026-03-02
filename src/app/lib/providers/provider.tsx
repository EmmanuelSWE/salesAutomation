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
  createPricingRequestPending, createPricingRequestSuccess, createPricingRequestError,

  getContractsPending, getContractsSuccess, getContractsError,
  getOneContractPending, getOneContractSuccess, getOneContractError,

  getActivitiesPending, getActivitiesSuccess, getActivitiesError,
  getOneActivityPending, getOneActivitySuccess, getOneActivityError,
  createActivityPending, createActivitySuccess, createActivityError,
  updateActivityPending, updateActivitySuccess, updateActivityError,
  deleteActivityPending, deleteActivitySuccess, deleteActivityError,

  getNotesPending, getNotesSuccess, getNotesError,
  getOneNotePending, getOneNoteSuccess, getOneNoteError,
} from "./actions";

import { ACTIVITY_TYPE_NUM, PRIORITY_NUM, RELATED_TO_TYPE_NUM, OPPORTUNITY_STAGE_NUM } from "../utils/apiEnums";

/** Extract items from a paged envelope `{ items: T[] }` or pass through a direct array. */
function items<T>(data: { items?: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data;
  return (data as { items?: T[] }).items ?? [];
}

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

  const createClient = async (payload: object): Promise<string | undefined> => {
    try {
      const res = await api.post<{ id: string }>("/clients", payload);
      await getClients();
      return res.data?.id;
    } catch (err) {
      console.error("createClient", (err as { response?: { data?: unknown } }).response?.data);
      return undefined;
    }
  };

  const clientActions = useMemo(
    () => ({ getClients, getOneClient, createClient }),
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
    // Paged: GET /contacts → { items, pageNumber, pageSize, totalCount }
    dispatch(getContactsPending());
    await api.get("/contacts", { params })
      .then(({ data }) => dispatch(getContactsSuccess(items(data))))
      .catch(err => { console.error("getContacts", err.response?.data); dispatch(getContactsError()); });
  };

  const getContactsByClient = async (clientId: string) => {
    // Direct array: GET /contacts/by-client/{id} → Contact[]
    dispatch(getContactsPending());
    await api.get(`/contacts/by-client/${clientId}`)
      .then(({ data }) => dispatch(getContactsSuccess(Array.isArray(data) ? data : [])))
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
    // Paged: GET /opportunities → { items, pageNumber, pageSize, totalCount }
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities", { params })
      .then(({ data }) => dispatch(getOpportunitiesSuccess(items(data))))
      .catch(err => { console.error("getOpportunities", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getMyOpportunities = async (params?: object) => {
    // Paged: GET /opportunities/my-opportunities → { items, ... }
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities/my-opportunities", { params })
      .then(({ data }) => dispatch(getOpportunitiesSuccess(items(data))))
      .catch(err => { console.error("getMyOpportunities", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getPipeline = async (ownerId?: string) => {
    // Object: GET /opportunities/pipeline → { stages, weightedPipelineValue, conversionRate }
    // TODO: add dedicated pipeline metrics to state; currently only the stages array is dispatched
    dispatch(getOpportunitiesPending());
    await api.get("/opportunities/pipeline", { params: ownerId ? { ownerId } : undefined })
      .then(({ data }) => dispatch(getOpportunitiesSuccess(
        Array.isArray(data?.stages) ? data.stages : []
      )))
      .catch(err => { console.error("getPipeline", err.response?.data); dispatch(getOpportunitiesError()); });
  };

  const getOneOpportunity = async (id: string) => {
    dispatch(getOneOpportunityPending());
    await api.get(`/opportunities/${id}`)
      .then(res => dispatch(getOneOpportunitySuccess(res.data)))
      .catch(err => { console.error("getOneOpportunity", err.response?.data); dispatch(getOneOpportunityError()); });
  };

  const getStageHistory = async (id: string) => {
    // Direct array: GET /opportunities/{id}/stage-history → StageHistory[]
    dispatch(getStageHistoryPending());
    await api.get(`/opportunities/${id}/stage-history`)
      .then(({ data }) => dispatch(getStageHistorySuccess(Array.isArray(data) ? data : [])))
      .catch(err => { console.error("getStageHistory", err.response?.data); dispatch(getStageHistoryError()); });
  };

  const advanceStage = async (id: string, stage: number, reason?: string) => {
    // Body contract: { stage: number, notes: string | null, lossReason: string | null }
    const item = await api.get(`/opportunities/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("advanceStage: item not found", id); return; }
    await api.put(`/opportunities/${confirmedId}/stage`, {
      stage,
      notes:      reason ?? null,
      lossReason: null,
    })
      .then(() => getOneOpportunity(confirmedId))
      .catch(err => console.error("advanceStage", err.response?.data));
  };

  const deleteOpportunity = async (id: string) => {
    const item = await api.get(`/opportunities/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("deleteOpportunity: item not found", id); return; }
    await api.delete(`/opportunities/${confirmedId}`)
      .catch(err => console.error("deleteOpportunity", err.response?.data));
  };

  const assignOpportunity = async (id: string, userId: string) => {
    await api.post(`/opportunities/${id}/assign`, { userId })
      .catch(err => console.error("assignOpportunity", err.response?.data));
  };

  const createOpportunity = async (payload: object): Promise<string | undefined> => {
    try {
      const raw = payload as Record<string, unknown>;
      const body = { ...raw };
      if (typeof body.stage === "string") body.stage = OPPORTUNITY_STAGE_NUM[body.stage] ?? body.stage;
      const res = await api.post<{ id: string }>("/opportunities", body);
      await getOpportunities();
      return res.data?.id;
    } catch (err) {
      console.error("createOpportunity", (err as { response?: { data?: unknown } }).response?.data);
      return undefined;
    }
  };

  const opportunityActions = useMemo(
    () => ({ getOpportunities, getMyOpportunities, getPipeline, getOneOpportunity, getStageHistory, advanceStage, deleteOpportunity, assignOpportunity, createOpportunity }),
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
    // Paged: GET /proposals → { items, pageNumber, pageSize, totalCount }
    dispatch(getProposalsPending());
    await api.get("/proposals", { params })
      .then(({ data }) => dispatch(getProposalsSuccess(items(data))))
      .catch(err => { console.error("getProposals", err.response?.data); dispatch(getProposalsError()); });
  };

  const getOneProposal = async (id: string) => {
    dispatch(getOneProposalPending());
    await api.get(`/proposals/${id}`)
      .then(res => dispatch(getOneProposalSuccess(res.data)))
      .catch(err => { console.error("getOneProposal", err.response?.data); dispatch(getOneProposalError()); });
  };

  const submitProposal = async (id: string) => {
    // Contract: PUT /proposals/{id}/submit — no body
    const item = await api.get(`/proposals/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("submitProposal: item not found", id); return; }
    await api.put(`/proposals/${confirmedId}/submit`)
      .then(() => getOneProposal(confirmedId))
      .catch(err => console.error("submitProposal", err.response?.data));
  };

  const approveProposal = async (id: string) => {
    // Contract: PUT /proposals/{id}/approve — no body
    const item = await api.get(`/proposals/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("approveProposal: item not found", id); return; }
    await api.put(`/proposals/${confirmedId}/approve`)
      .then(() => getOneProposal(confirmedId))
      .catch(err => console.error("approveProposal", err.response?.data));
  };

  const rejectProposal = async (id: string, reason?: string) => {
    // Contract: PUT /proposals/{id}/reject — no body
    // `reason` kept in signature for UI compatibility; not sent to API per contract
    const item = await api.get(`/proposals/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("rejectProposal: item not found", id); return; }
    void reason;
    await api.put(`/proposals/${confirmedId}/reject`)
      .then(() => getOneProposal(confirmedId))
      .catch(err => console.error("rejectProposal", err.response?.data));
  };

  const deleteProposal = async (id: string, clientId?: string) => {
    const item = await api.get(`/proposals/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("deleteProposal: item not found", id); return; }
    await api.delete(`/proposals/${confirmedId}`)
      .then(() => { if (clientId) getProposals({ clientId }); })
      .catch(err => console.error("deleteProposal", err.response?.data));
  };

  /** Convenience — picks the right endpoint then re-fetches the client's list */
  const updateStatus = async (id: string, status: import("../utils/apiEnums").ProposalStatus, clientId?: string, reason?: string) => {
    const item = await api.get(`/proposals/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("updateStatus: item not found", id); return; }
    let endpoint: string | null = null;
    if (status === "Submitted") endpoint = "submit";
    else if (status === "Approved") endpoint = "approve";
    else if (status === "Rejected") endpoint = "reject";
    if (!endpoint) return;
    // Contract: submit/approve/reject take no body; `reason` kept for UI compatibility
    void reason;
    function refresh() {
      if (clientId) return getProposals({ clientId });
      return getOneProposal(confirmedId!);
    }
    await api.put(`/proposals/${confirmedId}/${endpoint}`)
      .then(refresh)
      .catch(err => console.error(`updateStatus → ${endpoint}`, err.response?.data));
  };

  const proposalActions = useMemo(
    () => ({ getProposals, getOneProposal, submitProposal, approveProposal, rejectProposal, updateStatus, deleteProposal }),
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
    // Paged: GET /pricingrequests → { items, pageNumber, pageSize, totalCount }
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests", { params })
      .then(({ data }) => dispatch(getPricingRequestsSuccess(items(data))))
      .catch(err => { console.error("getPricingRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getPendingRequests = async () => {
    // Paged: GET /pricingrequests/pending → { items, ... }
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests/pending")
      .then(({ data }) => dispatch(getPricingRequestsSuccess(items(data))))
      .catch(err => { console.error("getPendingRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getMyRequests = async () => {
    // Paged: GET /pricingrequests/my-requests → { items, ... }
    dispatch(getPricingRequestsPending());
    await api.get("/pricingrequests/my-requests")
      .then(({ data }) => dispatch(getPricingRequestsSuccess(items(data))))
      .catch(err => { console.error("getMyRequests", err.response?.data); dispatch(getPricingRequestsError()); });
  };

  const getOnePricingRequest = async (id: string) => {
    dispatch(getOnePricingRequestPending());
    await api.get(`/pricingrequests/${id}`)
      .then(res => dispatch(getOnePricingRequestSuccess(res.data)))
      .catch(err => { console.error("getOnePricingRequest", err.response?.data); dispatch(getOnePricingRequestError()); });
  };

  const createPricingRequest = async (payload: object): Promise<string | undefined> => {
    dispatch(createPricingRequestPending());
    try {
      const raw  = payload as Record<string, unknown>;
      const body: Record<string, unknown> = { ...raw };
      if (typeof body.priority === "string") body.priority = PRIORITY_NUM[body.priority] ?? body.priority;
      const res = await api.post("/pricingrequests", body);
      dispatch(createPricingRequestSuccess());
      // Refresh the list so any mounted pricing-request UI picks up the new entry
      await api.get("/pricingrequests")
        .then(({ data }) => dispatch(getPricingRequestsSuccess(items(data))))
        .catch(() => { /* non-fatal */ });
      return res.data?.id as string | undefined;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      console.error("createPricingRequest", e.response?.data);
      dispatch(createPricingRequestError());
      return undefined;
    }
  };

  const assignRequest = async (id: string, userId: string) => {
    if (!id) return;
    await api.post(`/pricingrequests/${id}/assign`, { userId })
      .then(() => getPricingRequests())
      .catch(err => { console.error("assignRequest", err.response?.data); throw err; });
  };

  const completeRequest = async (id: string) => {
    if (!id) return;
    const item = await api.get(`/pricingrequests/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("completeRequest: item not found", id); return; }
    await api.put(`/pricingrequests/${confirmedId}/complete`)
      .then(() => getPricingRequests())
      .catch(err => { console.error("completeRequest", err.response?.data); throw err; });
  };

  const updatePricingRequest = async (id: string, payload: object) => {
    const item = await api.get(`/pricingrequests/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("updatePricingRequest: item not found", id); return; }
    await api.put(`/pricingrequests/${confirmedId}`, payload)
      .then(() => getPricingRequests())
      .catch(err => console.error("updatePricingRequest", err.response?.data));
  };

  const pricingActions = useMemo(
    () => ({ getPricingRequests, getPendingRequests, getMyRequests, getOnePricingRequest, createPricingRequest, assignRequest, completeRequest, updatePricingRequest }),
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
    // Paged: GET /contracts → { items, pageNumber, pageSize, totalCount }
    dispatch(getContractsPending());
    await api.get("/contracts", { params })
      .then(({ data }) => dispatch(getContractsSuccess(items(data))))
      .catch(err => { console.error("getContracts", err.response?.data); dispatch(getContractsError()); });
  };

  const getOneContract = async (id: string) => {
    dispatch(getOneContractPending());
    await api.get(`/contracts/${id}`)
      .then(res => dispatch(getOneContractSuccess(res.data)))
      .catch(err => { console.error("getOneContract", err.response?.data); dispatch(getOneContractError()); });
  };

  const getExpiringContracts = async (daysUntilExpiry?: number) => {
    // Returns a direct array per API contract
    dispatch(getContractsPending());
    await api.get("/contracts/expiring", { params: { daysUntilExpiry } })
      .then(({ data }) => dispatch(getContractsSuccess(Array.isArray(data) ? data : (data.items ?? []))))
      .catch(err => { console.error("getExpiringContracts", err.response?.data); dispatch(getContractsError()); });
  };

  const getContractsByClient = async (clientId: string) => {
    // Returns a direct array per API contract
    dispatch(getContractsPending());
    await api.get(`/contracts/client/${clientId}`)
      .then(({ data }) => dispatch(getContractsSuccess(Array.isArray(data) ? data : (data.items ?? []))))
      .catch(err => { console.error("getContractsByClient", err.response?.data); dispatch(getContractsError()); });
  };

  const activateContract = async (id: string) => {
    const item = await api.get(`/contracts/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("activateContract: item not found", id); return; }
    await api.put(`/contracts/${confirmedId}/activate`, {})
      .then(() => getOneContract(confirmedId))
      .catch(err => console.error("activateContract", err.response?.data));
  };

  const cancelContract = async (id: string) => {
    const item = await api.get(`/contracts/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("cancelContract: item not found", id); return; }
    await api.put(`/contracts/${confirmedId}/cancel`, {})
      .then(() => getOneContract(confirmedId))
      .catch(err => console.error("cancelContract", err.response?.data));
  };

  const deleteContract = async (id: string) => {
    const item = await api.get(`/contracts/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("deleteContract: item not found", id); return; }
    await api.delete(`/contracts/${confirmedId}`)
      .catch(err => console.error("deleteContract", err.response?.data));
  };

  const updateContract = async (id: string, payload: object) => {
    const item = await api.get(`/contracts/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("updateContract: item not found", id); return; }
    await api.put(`/contracts/${confirmedId}`, payload)
      .then(() => getOneContract(confirmedId))
      .catch(err => console.error("updateContract", err.response?.data));
  };

  const createRenewal = async (contractId: string, payload: { renewalOpportunityId?: string; notes?: string }) => {
    await api.post(`/contracts/${contractId}/renewals`, payload)
      .catch(err => console.error("createRenewal", err.response?.data));
  };

  const completeRenewal = async (renewalId: string, clientId?: string) => {
    const item = await api.get(`/contracts/renewals/${renewalId}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("completeRenewal: item not found", renewalId); return; }
    await api.put(`/contracts/renewals/${confirmedId}/complete`, {})
      .then(() => { if (clientId) getContractsByClient(clientId); })
      .catch(err => console.error("completeRenewal", err.response?.data));
  };

  const createContract = async (payload: object): Promise<string | undefined> => {
    try {
      const res = await api.post<{ id: string }>("/contracts", payload);
      await getContracts();
      return res.data?.id;
    } catch (err) {
      console.error("createContract", (err as { response?: { data?: unknown } }).response?.data);
      return undefined;
    }
  };

  const contractActions = useMemo(
    () => ({ getContracts, getOneContract, getExpiringContracts, getContractsByClient, updateContract, activateContract, cancelContract, deleteContract, createRenewal, completeRenewal, createContract }),
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
   ACTIVITY HELPER
   Converts string enum labels to the integers the API
   requires on every write operation (POST / PUT).
══════════════════════════════════════════════════════ */
function toActivityNums(p: Record<string, unknown>): Record<string, unknown> {
  const out = { ...p };
  if (typeof out.type          === "string") out.type          = ACTIVITY_TYPE_NUM[out.type]          ?? out.type;
  if (typeof out.priority      === "string") out.priority      = PRIORITY_NUM[out.priority]            ?? out.priority;
  if (typeof out.relatedToType === "string") out.relatedToType = RELATED_TO_TYPE_NUM[out.relatedToType] ?? out.relatedToType;
  if (typeof out.dueDate       === "string" && !out.dueDate.includes("T"))
    out.dueDate = `${out.dueDate}T00:00:00`;
  return out;
}

/* ══════════════════════════════════════════════════════
   ACTIVITY PROVIDER
══════════════════════════════════════════════════════ */
export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ActivityReducer, INITIAL_ACTIVITY_STATE);
  const { token } = useContext(UserStateContext);

  const getActivities = async (params?: object) => {
    // Paged: GET /activities → { items, pageNumber, pageSize, totalCount }
    dispatch(getActivitiesPending());
    await api.get("/activities", { params })
      .then(({ data }) => dispatch(getActivitiesSuccess(items(data))))
      .catch(err => { console.error("getActivities", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getMyActivities = async (params?: object) => {
    // Paged: GET /activities/my-activities → { items, ... }
    dispatch(getActivitiesPending());
    await api.get("/activities/my-activities", { params })
      .then(({ data }) => dispatch(getActivitiesSuccess(items(data))))
      .catch(err => { console.error("getMyActivities", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getUpcoming = async (daysAhead?: number) => {
    // Paged: GET /activities/upcoming → { items, ... }
    dispatch(getActivitiesPending());
    await api.get("/activities/upcoming", { params: { daysAhead } })
      .then(({ data }) => dispatch(getActivitiesSuccess(items(data))))
      .catch(err => { console.error("getUpcoming", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOverdue = async () => {
    // Returns a direct array per API contract
    dispatch(getActivitiesPending());
    await api.get("/activities/overdue")
      .then(({ data }) => dispatch(getActivitiesSuccess(Array.isArray(data) ? data : (data.items ?? []))))
      .catch(err => { console.error("getOverdue", err.response?.data); dispatch(getActivitiesError()); });
  };

  const getOneActivity = async (id: string) => {
    dispatch(getOneActivityPending());
    await api.get(`/activities/${id}`)
      .then(res => dispatch(getOneActivitySuccess(res.data)))
      .catch(err => { console.error("getOneActivity", err.response?.data); dispatch(getOneActivityError()); });
  };

  const createActivity = async (payload: object) => {
    dispatch(createActivityPending());
    await api.post("/activities", toActivityNums(payload as Record<string, unknown>))
      .then(() => dispatch(createActivitySuccess()))
      .catch(err => { console.error("createActivity", err.response?.data); dispatch(createActivityError()); });
  };

  const updateActivity = async (id: string, payload: Partial<import('./context').IActivity>) => {
    const item = await api.get(`/activities/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("updateActivity: item not found", id); return; }
    dispatch(updateActivityPending());
    await api.put(`/activities/${confirmedId}`, toActivityNums(payload as Record<string, unknown>))
      .then(res => { dispatch(updateActivitySuccess()); dispatch(getOneActivitySuccess(res.data)); })
      .catch(err => { console.error("updateActivity", err.response?.data); dispatch(updateActivityError()); throw err; });
  };

  const completeActivity = async (id: string, outcome: string) => {
    const item = await api.get(`/activities/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("completeActivity: item not found", id); return; }
    dispatch(updateActivityPending());
    await api.put(`/activities/${confirmedId}/complete`, { outcome })
      .then(res => { dispatch(updateActivitySuccess()); dispatch(getOneActivitySuccess(res.data)); })
      .catch(err => { console.error("completeActivity", err.response?.data); dispatch(updateActivityError()); });
  };

  const cancelActivity = async (id: string) => {
    const item = await api.get(`/activities/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("cancelActivity: item not found", id); return; }
    dispatch(updateActivityPending());
    await api.put(`/activities/${confirmedId}/cancel`, {})
      .then(res => { dispatch(updateActivitySuccess()); dispatch(getOneActivitySuccess(res.data)); })
      .catch(err => { console.error("cancelActivity", err.response?.data); dispatch(updateActivityError()); });
  };

  const deleteActivity = async (id: string) => {
    const item = await api.get(`/activities/${id}`).then(r => r.data).catch(() => null);
    const confirmedId: string | undefined = item?.id;
    if (!confirmedId) { console.error("deleteActivity: item not found", id); return; }
    dispatch(deleteActivityPending());
    await api.delete(`/activities/${confirmedId}`)
      .then(() => dispatch(deleteActivitySuccess()))
      .catch(err => { console.error("deleteActivity", err.response?.data); dispatch(deleteActivityError()); });
  };

  const activityActions = useMemo(
    () => ({ getActivities, getMyActivities, getUpcoming, getOverdue, getOneActivity, createActivity, updateActivity, completeActivity, cancelActivity, deleteActivity }),
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
    // Paged: GET /notes → { items, pageNumber, pageSize, totalCount }
    dispatch(getNotesPending());
    await api.get("/notes", { params })
      .then(({ data }) => dispatch(getNotesSuccess(items(data))))
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