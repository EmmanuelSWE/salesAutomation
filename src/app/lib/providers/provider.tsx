'use client';

import { ReactNode, useContext, useReducer, useEffect, useMemo, useState } from "react";

/* ── axios instance ── */
import api from "../utils/axiosInstance";
import { handleProviderError } from "../api/strictApi";
import {
  zStageBody,
  zCreateActivity, zCompleteActivity,
} from "../api/contract";

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
    try {
      const data = await api.get("/users", { params }).then(r => r.data);
      dispatch(getUsersSuccess(Array.isArray(data) ? data : (data.items ?? [])));
    } catch (err) {
      handleProviderError("getUsers", err, getUsersError);
    }
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
    try {
      const data = await api.get("/clients", { params }).then(r => r.data);
      dispatch(getClientsSuccess(data));
    } catch (err) {
      handleProviderError("getClients", err, getClientsError);
    }
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
    try {
      const data = await api.get("/contacts", { params }).then(r => r.data);
      dispatch(getContactsSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getContacts", err, getContactsError);
    }
  };

  const getContactsByClient = async (clientId: string) => {
    // Direct array: GET /contacts/by-client/{id} → Contact[]
    dispatch(getContactsPending());
    try {
      const data = await api.get(`/contacts/by-client/${clientId}`).then(r => r.data);
      dispatch(getContactsSuccess(data));
    } catch (err) {
      handleProviderError("getContactsByClient", err, getContactsError);
    }
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
    try {
      const data = await api.get("/opportunities", { params }).then(r => r.data);
      dispatch(getOpportunitiesSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getOpportunities", err, getOpportunitiesError);
    }
  };

  const getMyOpportunities = async (params?: object) => {
    // Paged: GET /opportunities/my-opportunities → { items, ... }
    dispatch(getOpportunitiesPending());
    try {
      const data = await api.get("/opportunities/my-opportunities", { params }).then(r => r.data);
      dispatch(getOpportunitiesSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getMyOpportunities", err, getOpportunitiesError);
    }
  };

  const getPipeline = async (ownerId?: string) => {
    // Object: GET /opportunities/pipeline → { stages, weightedPipelineValue, conversionRate }
    dispatch(getOpportunitiesPending());
    try {
      const data = await api.get("/opportunities/pipeline", { params: ownerId ? { ownerId } : undefined }).then(r => r.data);
      dispatch(getOpportunitiesSuccess(data.stages ?? []));
    } catch (err) {
      handleProviderError("getPipeline", err, getOpportunitiesError);
    }
  };

  const getOneOpportunity = async (id: string) => {
    dispatch(getOneOpportunityPending());
    try {
      const data = await api.get(`/opportunities/${id}`).then(r => r.data);
      dispatch(getOneOpportunitySuccess(data));
    } catch (err) {
      handleProviderError("getOneOpportunity", err, getOneOpportunityError);
    }
  };

  const getStageHistory = async (id: string) => {
    // Direct array: GET /opportunities/{id}/stage-history → StageHistory[]
    dispatch(getStageHistoryPending());
    try {
      const data = await api.get(`/opportunities/${id}/stage-history`).then(r => r.data);
      dispatch(getStageHistorySuccess(data));
    } catch (err) {
      handleProviderError("getStageHistory", err, getStageHistoryError);
    }
  };

  const advanceStage = async (id: string, stage: number, reason?: string, lossReason?: string) => {
    // Body contract: { stage, notes: string|null, lossReason: required when stage===6 }
    const body = { stage, notes: reason ?? null, lossReason: stage === 6 ? (lossReason ?? null) : null };
    const parsed = zStageBody.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues.map(i => i.message).join("; ");
      console.error("advanceStage validation:", msg);
      return;
    }
    await api.put(`/opportunities/${id}/stage`, parsed.data)
      .then(() => getOneOpportunity(id))
      .catch(err => { handleProviderError("advanceStage", err); });
  };

  const deleteOpportunity = async (id: string) => {
    await api.delete(`/opportunities/${id}`)
      .catch(err => { handleProviderError("deleteOpportunity", err); });
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
    try {
      const data = await api.get("/proposals", { params }).then(r => r.data);
      dispatch(getProposalsSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getProposals", err, getProposalsError);
    }
  };

  const getOneProposal = async (id: string) => {
    dispatch(getOneProposalPending());
    try {
      const data = await api.get(`/proposals/${id}`).then(r => r.data);
      dispatch(getOneProposalSuccess(data));
    } catch (err) {
      handleProviderError("getOneProposal", err, getOneProposalError);
    }
  };

  const submitProposal = async (id: string) => {
    // Contract: PUT /proposals/{id}/submit — no body
    await api.put(`/proposals/${id}/submit`)
      .then(() => getOneProposal(id))
      .catch(err => { handleProviderError("submitProposal", err); });
  };

  const approveProposal = async (id: string) => {
    // Contract: PUT /proposals/{id}/approve — no body
    await api.put(`/proposals/${id}/approve`)
      .then(() => getOneProposal(id))
      .catch(err => { handleProviderError("approveProposal", err); });
  };

  const rejectProposal = async (id: string, reason?: string) => {
    // Contract: PUT /proposals/{id}/reject — no body
    // `reason` kept in signature for UI compatibility; not sent to API per contract
    void reason;
    await api.put(`/proposals/${id}/reject`)
      .then(() => getOneProposal(id))
      .catch(err => { handleProviderError("rejectProposal", err); });
  };

  const deleteProposal = async (id: string, clientId?: string) => {
    await api.delete(`/proposals/${id}`)
      .then(() => { if (clientId) getProposals({ clientId }); })
      .catch(err => { handleProviderError("deleteProposal", err); });
  };

  /** Convenience — picks the right endpoint then re-fetches the client's list */
  const updateStatus = async (id: string, status: import("../utils/apiEnums").ProposalStatus, clientId?: string, reason?: string) => {
    let endpoint: string | null = null;
    if (status === "Submitted") endpoint = "submit";
    else if (status === "Approved") endpoint = "approve";
    else if (status === "Rejected") endpoint = "reject";
    if (!endpoint) return;
    // Contract: submit/approve/reject take no body; `reason` kept for UI compatibility
    void reason;
    const refresh = () => clientId ? getProposals({ clientId }) : getOneProposal(id);
    await api.put(`/proposals/${id}/${endpoint}`)
      .then(refresh)
      .catch(err => { handleProviderError(`updateStatus → ${endpoint}`, err); });
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
    try {
      const data = await api.get("/pricingrequests", { params }).then(r => r.data);
      dispatch(getPricingRequestsSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getPricingRequests", err, getPricingRequestsError);
    }
  };

  const getPendingRequests = async () => {
    // Paged: GET /pricingrequests/pending → { items, ... }
    dispatch(getPricingRequestsPending());
    try {
      const data = await api.get("/pricingrequests/pending").then(r => r.data);
      dispatch(getPricingRequestsSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getPendingRequests", err, getPricingRequestsError);
    }
  };

  const getMyRequests = async () => {
    // Paged: GET /pricingrequests/my-requests → { items, ... }
    dispatch(getPricingRequestsPending());
    try {
      const data = await api.get("/pricingrequests/my-requests").then(r => r.data);
      dispatch(getPricingRequestsSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getMyRequests", err, getPricingRequestsError);
    }
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
      await api.get("/pricingrequests").then(r => r.data)
        .then(data => dispatch(getPricingRequestsSuccess(data.items ?? [])))
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
    // Contract: PUT /pricingrequests/{id}/complete — no body (§6.9)
    await api.put(`/pricingrequests/${id}/complete`)
      .then(() => getPricingRequests())
      .catch(err => { handleProviderError("completeRequest", err); throw err; });
  };

  const updatePricingRequest = async (id: string, payload: object) => {
    await api.put(`/pricingrequests/${id}`, payload)
      .then(() => getPricingRequests())
      .catch(err => { handleProviderError("updatePricingRequest", err); });
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
    try {
      const data = await api.get("/contracts", { params }).then(r => r.data);
      dispatch(getContractsSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getContracts", err, getContractsError);
    }
  };

  const getOneContract = async (id: string) => {
    dispatch(getOneContractPending());
    try {
      const data = await api.get(`/contracts/${id}`).then(r => r.data);
      dispatch(getOneContractSuccess(data));
    } catch (err) {
      handleProviderError("getOneContract", err, getOneContractError);
    }
  };

  const getExpiringContracts = async (daysUntilExpiry?: number) => {
    // Direct array: GET /contracts/expiring → Contract[]
    dispatch(getContractsPending());
    try {
      const data = await api.get("/contracts/expiring", { params: daysUntilExpiry !== undefined ? { daysUntilExpiry } : undefined }).then(r => r.data);
      dispatch(getContractsSuccess(data));
    } catch (err) {
      handleProviderError("getExpiringContracts", err, getContractsError);
    }
  };

  const getContractsByClient = async (clientId: string) => {
    // Direct array: GET /contracts/client/{id} → Contract[]
    dispatch(getContractsPending());
    try {
      const data = await api.get(`/contracts/client/${clientId}`).then(r => r.data);
      dispatch(getContractsSuccess(data));
    } catch (err) {
      handleProviderError("getContractsByClient", err, getContractsError);
    }
  };

  const activateContract = async (id: string) => {
    // Contract: PUT /contracts/{id}/activate — no body (§7.5)
    await api.put(`/contracts/${id}/activate`)
      .then(() => getOneContract(id))
      .catch(err => { handleProviderError("activateContract", err); });
  };

  const cancelContract = async (id: string) => {
    // Contract: PUT /contracts/{id}/cancel — no body (§7.6)
    await api.put(`/contracts/${id}/cancel`)
      .then(() => getOneContract(id))
      .catch(err => { handleProviderError("cancelContract", err); });
  };

  const deleteContract = async (id: string) => {
    await api.delete(`/contracts/${id}`)
      .catch(err => { handleProviderError("deleteContract", err); });
  };

  const updateContract = async (id: string, payload: object) => {
    await api.put(`/contracts/${id}`, payload)
      .then(() => getOneContract(id))
      .catch(err => { handleProviderError("updateContract", err); });
  };

  const createRenewal = async (contractId: string, payload: { renewalOpportunityId?: string; notes?: string }) => {
    await api.post(`/contracts/${contractId}/renewals`, payload)
      .catch(err => { handleProviderError("createRenewal", err); });
  };

  const completeRenewal = async (renewalId: string, clientId?: string) => {
    // Contract: PUT /contracts/renewals/{id}/complete — no body (§7.10)
    await api.put(`/contracts/renewals/${renewalId}/complete`)
      .then(() => { if (clientId) getContractsByClient(clientId); })
      .catch(err => { handleProviderError("completeRenewal", err); });
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
    try {
      const data = await api.get("/activities", { params }).then(r => r.data);
      dispatch(getActivitiesSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getActivities", err, getActivitiesError);
    }
  };

  const getMyActivities = async (params?: object) => {
    // Paged: GET /activities/my-activities → { items, ... }
    dispatch(getActivitiesPending());
    try {
      const data = await api.get("/activities/my-activities", { params }).then(r => r.data);
      dispatch(getActivitiesSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getMyActivities", err, getActivitiesError);
    }
  };

  const getUpcoming = async (daysAhead?: number) => {
    // Paged: GET /activities/upcoming → { items, ... }
    dispatch(getActivitiesPending());
    try {
      const data = await api.get("/activities/upcoming", { params: daysAhead !== undefined ? { daysAhead } : undefined }).then(r => r.data);
      dispatch(getActivitiesSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getUpcoming", err, getActivitiesError);
    }
  };

  const getOverdue = async () => {
    // Direct array: GET /activities/overdue → Activity[]
    dispatch(getActivitiesPending());
    try {
      const data = await api.get("/activities/overdue").then(r => r.data);
      dispatch(getActivitiesSuccess(data));
    } catch (err) {
      handleProviderError("getOverdue", err, getActivitiesError);
    }
  };

  const getOneActivity = async (id: string) => {
    dispatch(getOneActivityPending());
    try {
      const data = await api.get(`/activities/${id}`).then(r => r.data);
      dispatch(getOneActivitySuccess(data));
    } catch (err) {
      handleProviderError("getOneActivity", err, getOneActivityError);
    }
  };

  const createActivity = async (payload: object) => {
    dispatch(createActivityPending());
    const body = toActivityNums(payload as Record<string, unknown>);
    const parsed = zCreateActivity.safeParse(body);
    if (!parsed.success) {
      handleProviderError("createActivity", new (class extends Error { constructor() { super(); } })(), createActivityError);
      console.error("createActivity validation:", parsed.error.issues);
      dispatch(createActivityError());
      return;
    }
    try {
      await api.post("/activities", parsed.data);
      dispatch(createActivitySuccess());
    } catch (err) {
      handleProviderError("createActivity", err, createActivityError);
    }
  };

  const updateActivity = async (id: string, payload: Partial<import('./context').IActivity>) => {
    dispatch(updateActivityPending());
    try {
      const res = await api.put(`/activities/${id}`, toActivityNums(payload as Record<string, unknown>));
      dispatch(updateActivitySuccess());
      dispatch(getOneActivitySuccess(res.data));
    } catch (err) {
      handleProviderError("updateActivity", err, updateActivityError);
      throw err;
    }
  };

  const completeActivity = async (id: string, outcome: string) => {
    const parsed = zCompleteActivity.safeParse({ outcome });
    if (!parsed.success) {
      console.error("completeActivity validation:", parsed.error.issues);
      return;
    }
    dispatch(updateActivityPending());
    try {
      const res = await api.put(`/activities/${id}/complete`, parsed.data);
      dispatch(updateActivitySuccess());
      dispatch(getOneActivitySuccess(res.data));
    } catch (err) {
      handleProviderError("completeActivity", err, updateActivityError);
    }
  };

  const cancelActivity = async (id: string) => {
    // Contract: PUT /activities/{id}/cancel — no body (§8.9)
    dispatch(updateActivityPending());
    try {
      const res = await api.put(`/activities/${id}/cancel`);
      dispatch(updateActivitySuccess());
      dispatch(getOneActivitySuccess(res.data));
    } catch (err) {
      handleProviderError("cancelActivity", err, updateActivityError);
    }
  };

  const deleteActivity = async (id: string) => {
    dispatch(deleteActivityPending());
    try {
      await api.delete(`/activities/${id}`);
      dispatch(deleteActivitySuccess());
    } catch (err) {
      handleProviderError("deleteActivity", err, deleteActivityError);
    }
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
    try {
      const data = await api.get("/notes", { params }).then(r => r.data);
      dispatch(getNotesSuccess(data.items ?? []));
    } catch (err) {
      handleProviderError("getNotes", err, getNotesError);
    }
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