'use client';
import { handleActions } from "redux-actions";

import {
  IUserStateContext,
  IClientStateContext,
  IContactStateContext,
  IOpportunityStateContext,
  IProposalStateContext,
  IPricingRequestStateContext,
  IContractStateContext,
  IActivityStateContext,
  INoteStateContext,
} from "./context";

import { IUser, INITIAL_USER_STATE } from "./context";

import {
  UserActionEnums,
  ClientActionEnums,
  ContactActionEnums,
  OpportunityActionEnums,
  ProposalActionEnums,
  PricingRequestActionEnums,
  ContractActionEnums,
  ActivityActionEnums,
  NoteActionEnums,
} from "./actions";

import {
  INITIAL_CLIENT_STATE,
  INITIAL_CONTACT_STATE,
  INITIAL_OPPORTUNITY_STATE,
  INITIAL_PROPOSAL_STATE,
  INITIAL_PRICING_STATE,
  INITIAL_CONTRACT_STATE,
  INITIAL_ACTIVITY_STATE,
  INITIAL_NOTE_STATE,
} from "./context";
/* ══════════════════════════════════════════════════════
   USER REDUCER
══════════════════════════════════════════════════════ */
export const UserReducer = handleActions(
  {
    [UserActionEnums.loginPending]:  (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.loginSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.loginError]:    (state, action) => ({ ...state, ...action.payload }),

    [UserActionEnums.registerPending]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.registerSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.registerError]:   (state, action) => ({ ...state, ...action.payload }),

    [UserActionEnums.getUsersPending]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.getUsersSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.getUsersError]:   (state, action) => ({ ...state, ...action.payload }),

    [UserActionEnums.getOneUserPending]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.getOneUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.getOneUserError]:   (state, action) => ({ ...state, ...action.payload }),

    [UserActionEnums.updateUserPending]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.updateUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.updateUserError]:   (state, action) => ({ ...state, ...action.payload }),

    [UserActionEnums.deleteUserPending]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.deleteUserSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [UserActionEnums.deleteUserError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_USER_STATE
);

/* ══════════════════════════════════════════════════════
   CLIENT REDUCER
══════════════════════════════════════════════════════ */
export const ClientReducer = handleActions(
  {
    [ClientActionEnums.getClientsPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.getClientsSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.getClientsError]:     (state, action) => ({ ...state, ...action.payload }),

    [ClientActionEnums.getOneClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.getOneClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.getOneClientError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientActionEnums.createClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.createClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.createClientError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientActionEnums.updateClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.updateClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.updateClientError]:   (state, action) => ({ ...state, ...action.payload }),

    [ClientActionEnums.deleteClientPending]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.deleteClientSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ClientActionEnums.deleteClientError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_CLIENT_STATE
);

/* ══════════════════════════════════════════════════════
   CONTACT REDUCER
══════════════════════════════════════════════════════ */
export const ContactReducer = handleActions(
  {
    [ContactActionEnums.getContactsPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.getContactsSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.getContactsError]:     (state, action) => ({ ...state, ...action.payload }),

    [ContactActionEnums.getOneContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.getOneContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.getOneContactError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactActionEnums.createContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.createContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.createContactError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactActionEnums.updateContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.updateContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.updateContactError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContactActionEnums.deleteContactPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.deleteContactSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContactActionEnums.deleteContactError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_CONTACT_STATE
);

/* ══════════════════════════════════════════════════════
   OPPORTUNITY REDUCER
══════════════════════════════════════════════════════ */
export const OpportunityReducer = handleActions(
  {
    [OpportunityActionEnums.getOpportunitiesPending]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.getOpportunitiesSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.getOpportunitiesError]:     (state, action) => ({ ...state, ...action.payload }),

    [OpportunityActionEnums.getOneOpportunityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.getOneOpportunitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.getOneOpportunityError]:    (state, action) => ({ ...state, ...action.payload }),

    [OpportunityActionEnums.getStageHistoryPending]:    (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.getStageHistorySuccess]:    (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.getStageHistoryError]:      (state, action) => ({ ...state, ...action.payload }),

    [OpportunityActionEnums.createOpportunityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.createOpportunitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.createOpportunityError]:    (state, action) => ({ ...state, ...action.payload }),

    [OpportunityActionEnums.updateOpportunityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.updateOpportunitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.updateOpportunityError]:    (state, action) => ({ ...state, ...action.payload }),

    [OpportunityActionEnums.deleteOpportunityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.deleteOpportunitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [OpportunityActionEnums.deleteOpportunityError]:    (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_OPPORTUNITY_STATE
);

/* ══════════════════════════════════════════════════════
   PROPOSAL REDUCER
══════════════════════════════════════════════════════ */
export const ProposalReducer = handleActions(
  {
    [ProposalActionEnums.getProposalsPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.getProposalsSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.getProposalsError]:     (state, action) => ({ ...state, ...action.payload }),

    [ProposalActionEnums.getOneProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.getOneProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.getOneProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalActionEnums.createProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.createProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.createProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalActionEnums.updateProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.updateProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.updateProposalError]:   (state, action) => ({ ...state, ...action.payload }),

    [ProposalActionEnums.deleteProposalPending]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.deleteProposalSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ProposalActionEnums.deleteProposalError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_PROPOSAL_STATE
);

/* ══════════════════════════════════════════════════════
   PRICING REQUEST REDUCER
══════════════════════════════════════════════════════ */
export const PricingRequestReducer = handleActions<IPricingRequestStateContext>(
  {
    [PricingRequestActionEnums.getPricingRequestsPending]:   (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.getPricingRequestsSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.getPricingRequestsError]:     (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestActionEnums.getOnePricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.getOnePricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.getOnePricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestActionEnums.createPricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.createPricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.createPricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),

    [PricingRequestActionEnums.updatePricingRequestPending]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.updatePricingRequestSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [PricingRequestActionEnums.updatePricingRequestError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_PRICING_STATE
);

/* ══════════════════════════════════════════════════════
   CONTRACT REDUCER
══════════════════════════════════════════════════════ */
export const ContractReducer = handleActions(
  {
    [ContractActionEnums.getContractsPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.getContractsSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.getContractsError]:     (state, action) => ({ ...state, ...action.payload }),

    [ContractActionEnums.getOneContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.getOneContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.getOneContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractActionEnums.createContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.createContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.createContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractActionEnums.updateContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.updateContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.updateContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractActionEnums.deleteContractPending]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.deleteContractSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.deleteContractError]:   (state, action) => ({ ...state, ...action.payload }),

    [ContractActionEnums.createRenewalPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.createRenewalSuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ContractActionEnums.createRenewalError]:    (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_CONTRACT_STATE
);

/* ══════════════════════════════════════════════════════
   ACTIVITY REDUCER
══════════════════════════════════════════════════════ */
export const ActivityReducer = handleActions(
  {
    [ActivityActionEnums.getActivitiesPending]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.getActivitiesSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.getActivitiesError]:     (state, action) => ({ ...state, ...action.payload }),

    [ActivityActionEnums.getOneActivityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.getOneActivitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.getOneActivityError]:    (state, action) => ({ ...state, ...action.payload }),

    [ActivityActionEnums.createActivityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.createActivitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.createActivityError]:    (state, action) => ({ ...state, ...action.payload }),

    [ActivityActionEnums.updateActivityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.updateActivitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.updateActivityError]:    (state, action) => ({ ...state, ...action.payload }),

    [ActivityActionEnums.deleteActivityPending]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.deleteActivitySuccess]:  (state, action) => ({ ...state, ...action.payload }),
    [ActivityActionEnums.deleteActivityError]:    (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_ACTIVITY_STATE
);

/* ══════════════════════════════════════════════════════
   NOTE REDUCER
══════════════════════════════════════════════════════ */
export const NoteReducer = handleActions(
  {
    [NoteActionEnums.getNotesPending]:   (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.getNotesSuccess]:   (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.getNotesError]:     (state, action) => ({ ...state, ...action.payload }),

    [NoteActionEnums.getOneNotePending]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.getOneNoteSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.getOneNoteError]:   (state, action) => ({ ...state, ...action.payload }),

    [NoteActionEnums.createNotePending]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.createNoteSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.createNoteError]:   (state, action) => ({ ...state, ...action.payload }),

    [NoteActionEnums.updateNotePending]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.updateNoteSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.updateNoteError]:   (state, action) => ({ ...state, ...action.payload }),

    [NoteActionEnums.deleteNotePending]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.deleteNoteSuccess]: (state, action) => ({ ...state, ...action.payload }),
    [NoteActionEnums.deleteNoteError]:   (state, action) => ({ ...state, ...action.payload }),
  },
  INITIAL_NOTE_STATE
);