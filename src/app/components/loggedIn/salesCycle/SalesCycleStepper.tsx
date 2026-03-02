"use client";

/**
 * SalesCycleStepper
 *
 * Renders a guarded, role-aware stepper for the full sales cycle:
 *   1. Create Client
 *   2. Add primary Contact
 *   3. Open Opportunity
 *   4. Create & Submit Proposal
 *   5. Approve Proposal  (Admin / SalesManager only)
 *   6. Create Contract   (only after Proposal is Approved)
 *
 * All API calls use the shared axios instance (baseURL already includes /api).
 * Contract rules are enforced in the guard layer before any mutation is fired.
 */

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Steps,
  Button,
  Tooltip,
  Modal,
  Input,
  Space,
  Typography,
  Badge,
} from "antd";
import {
  CheckCircleOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import api from "../../../lib/utils/axiosInstance";

const { Text } = Typography;

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

type ProposalStatus = "Draft" | "Submitted" | "Approved" | "Rejected";

/** Minimal facts the stepper needs to evaluate guards. */
export interface SalesCycleCtx {
  userRoles: string[];
  client?:         { id: string; name?: string } | null;
  contact?:        { id: string } | null;
  opportunity?:    { id: string; stage: number; title?: string } | null;
  proposal?:       { id: string; status: ProposalStatus; title?: string } | null;
  /** Extend as needed without breaking existing consumers. */
  pricingRequest?: { id: string; status: string } | null;
  contract?:       { id: string } | null;
}

/** Returned by every guard function. */
export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

/** Imperative controller exposed via ref. */
export interface SalesCycleController {
  /** Navigate to / open the relevant creation form (does NOT auto-submit). */
  startCreateClient():      void;
  startCreateContact():     void;
  startCreateOpportunity(): void;
  startCreateProposal():    void;
  /** Opens the approve-confirmation modal (fires API after user confirms). */
  startApproveProposal():   void;
  startCreateContract():    void;
}

export interface SalesCycleStepperProps {
  ctx:       SalesCycleCtx;
  onRefresh: () => void | Promise<void>;
  /**
   * Called when a "create" step should open its form.
   * Receives a relative path such as "/Client/createClient" or
   * "/Client/:clientId/createOpportunity".
   * If omitted the stepper falls back to console.warn.
   */
  onNavigate?: (path: string) => void;
}

/* ══════════════════════════════════════════════════════════════
   ROLE HELPERS
══════════════════════════════════════════════════════════════ */

function hasRole(roles: string[], ...allowed: string[]): boolean {
  return roles.some((r) => allowed.includes(r));
}

const MANAGER_ROLES = ["Admin", "SalesManager"] as const;

/* ══════════════════════════════════════════════════════════════
   GUARD LAYER
   Each guard returns { allowed, reason? }.
   Reason is shown in a disabled-button tooltip or inline text.
══════════════════════════════════════════════════════════════ */

/** Rule: Proposal must be in Draft status. */
export function guardSubmitProposal(ctx: SalesCycleCtx): GuardResult {
  if (!ctx.proposal) return { allowed: false, reason: "No proposal found." };
  if (ctx.proposal.status !== "Draft")
    return { allowed: false, reason: `Proposal is already ${ctx.proposal.status}.` };
  return { allowed: true };
}

/**
 * Rule: Proposal submitted + caller has Admin or SalesManager role.
 * (Contract rule #1 — Approve/Reject require Admin/SalesManager)
 */
export function guardApproveProposal(ctx: SalesCycleCtx): GuardResult {
  if (!ctx.proposal) return { allowed: false, reason: "No proposal found." };
  if (ctx.proposal.status !== "Submitted")
    return { allowed: false, reason: `Proposal must be Submitted first (current: ${ctx.proposal.status}).` };
  if (!hasRole(ctx.userRoles, ...MANAGER_ROLES))
    return { allowed: false, reason: "Only Admin or SalesManager can approve." };
  return { allowed: true };
}

/** Same prerequisites as approve. */
export function guardRejectProposal(ctx: SalesCycleCtx): GuardResult {
  if (!ctx.proposal) return { allowed: false, reason: "No proposal found." };
  if (ctx.proposal.status !== "Submitted")
    return { allowed: false, reason: `Proposal must be Submitted first (current: ${ctx.proposal.status}).` };
  if (!hasRole(ctx.userRoles, ...MANAGER_ROLES))
    return { allowed: false, reason: "Only Admin or SalesManager can reject." };
  return { allowed: true };
}

/**
 * Rule: Contract may only be created once the related Proposal is Approved.
 * (Contract rule #2)
 */
export function guardCreateContract(ctx: SalesCycleCtx): GuardResult {
  if (!ctx.proposal)
    return { allowed: false, reason: "Create and submit a proposal first." };
  if (ctx.proposal.status !== "Approved")
    return { allowed: false, reason: `Proposal must be Approved first (current: ${ctx.proposal.status}).` };
  return { allowed: true };
}

/**
 * Rule: Moving to stage 6 (Closed Lost) requires lossReason.
 * (Contract rule #3)
 */
export function guardAdvanceStage(
  ctx:         SalesCycleCtx,
  targetStage: number,
  lossReason?: string,
): GuardResult {
  if (!ctx.opportunity) return { allowed: false, reason: "No open opportunity." };
  if (targetStage === 6 && !lossReason?.trim())
    return { allowed: false, reason: "A loss reason is required when closing as Lost." };
  return { allowed: true };
}

/** Rule: Assign is Admin/SalesManager only, and request must not be Completed. */
export function guardAssignPricingRequest(ctx: SalesCycleCtx): GuardResult {
  if (!ctx.pricingRequest) return { allowed: false, reason: "No pricing request found." };
  if (ctx.pricingRequest.status === "Completed")
    return { allowed: false, reason: "Request is already Completed." };
  if (!hasRole(ctx.userRoles, ...MANAGER_ROLES))
    return { allowed: false, reason: "Only Admin or SalesManager can assign." };
  return { allowed: true };
}

/** Rule: Complete requires status InProgress. (Contract rule #4) */
export function guardCompletePricingRequest(ctx: SalesCycleCtx): GuardResult {
  if (!ctx.pricingRequest) return { allowed: false, reason: "No pricing request found." };
  if (ctx.pricingRequest.status !== "InProgress")
    return {
      allowed: false,
      reason: `Request must be InProgress to complete (current: ${ctx.pricingRequest.status}).`,
    };
  return { allowed: true };
}

/* ══════════════════════════════════════════════════════════════
   ACTION HANDLERS  (wired to exact contract endpoints)
══════════════════════════════════════════════════════════════ */

/** PUT /proposals/{id}/submit — NO body (contract rule #1) */
async function apiSubmitProposal(id: string): Promise<void> {
  await api.put(`/proposals/${id}/submit`);
}

/** PUT /proposals/{id}/approve — NO body (contract rule #1) */
async function apiApproveProposal(id: string): Promise<void> {
  await api.put(`/proposals/${id}/approve`);
}

/** PUT /proposals/{id}/reject — body { reason } (contract rule #1) */
async function apiRejectProposal(id: string, reason: string): Promise<void> {
  await api.put(`/proposals/${id}/reject`, { reason });
}

/**
 * PUT /opportunities/{id}/stage — body { stage, notes, lossReason }
 * lossReason required when stage = 6 (contract rule #3)
 */
async function apiAdvanceStage(
  id:         string,
  stage:      number,
  notes?:     string,
  lossReason?: string,
): Promise<void> {
  await api.put(`/opportunities/${id}/stage`, {
    stage,
    notes:      notes      ?? null,
    lossReason: lossReason ?? null,
  });
}

/** POST /pricingrequests/{id}/assign — body { userId } (contract rule #4) */
async function apiAssignPricingRequest(id: string, userId: string): Promise<void> {
  await api.post(`/pricingrequests/${id}/assign`, { userId });
}

/** PUT /pricingrequests/{id}/complete — NO body (contract rule #4) */
async function apiCompletePricingRequest(id: string): Promise<void> {
  await api.put(`/pricingrequests/${id}/complete`);
}

/* ══════════════════════════════════════════════════════════════
   STEP DEFINITIONS
══════════════════════════════════════════════════════════════ */

type StepKey =
  | "createClient"
  | "createContact"
  | "createOpportunity"
  | "createProposal"
  | "approveProposal"
  | "createContract";

interface StepDef {
  key:   StepKey;
  title: string;
  description: string;
  isDone:   (ctx: SalesCycleCtx) => boolean;
  guard:    (ctx: SalesCycleCtx) => GuardResult;
}

const STEPS: StepDef[] = [
  {
    key:         "createClient",
    title:       "Create Client",
    description: "Register the client in the system.",
    isDone:  (c) => !!c.client,
    guard:   ()  => ({ allowed: true }),
  },
  {
    key:         "createContact",
    title:       "Add Primary Contact",
    description: "Add at least one contact for the client.",
    isDone:  (c) => !!c.contact,
    guard:   (c) =>
      c.client
        ? { allowed: true }
        : { allowed: false, reason: "Create a client first." },
  },
  {
    key:         "createOpportunity",
    title:       "Open Opportunity",
    description: "Create an opportunity for this client.",
    isDone:  (c) => !!c.opportunity,
    guard:   (c) =>
      c.contact
        ? { allowed: true }
        : { allowed: false, reason: "Add a primary contact first." },
  },
  {
    key:         "createProposal",
    title:       "Create & Submit Proposal",
    description: "Draft and submit a proposal.",
    isDone:  (c) =>
      !!c.proposal &&
      (c.proposal.status === "Submitted" ||
       c.proposal.status === "Approved"),
    guard:   (c) =>
      c.opportunity
        ? { allowed: true }
        : { allowed: false, reason: "Open an opportunity first." },
  },
  {
    key:         "approveProposal",
    title:       "Approve Proposal",
    description: "Manager reviews and approves the proposal.",
    isDone:  (c) => c.proposal?.status === "Approved",
    guard:   (c) => guardApproveProposal(c),
  },
  {
    key:         "createContract",
    title:       "Create Contract",
    description: "Convert the approved proposal into a contract.",
    isDone:  (c) => !!c.contract,
    guard:   (c) => guardCreateContract(c),
  },
];

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */

function extractApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string; title?: string } }; message?: string };
  return (
    e?.response?.data?.message ??
    e?.response?.data?.title ??
    e?.message ??
    "An unexpected error occurred."
  );
}

/** Convert AntD Steps status */
function stepStatus(
  def:          StepDef,
  ctx:          SalesCycleCtx,
  isActiveStep: boolean,
): "finish" | "process" | "wait" | "error" {
  if (def.isDone(ctx))    return "finish";
  if (isActiveStep)       return "process";
  if (!def.guard(ctx).allowed) return "wait";
  return "wait";
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */

const SalesCycleStepper = forwardRef<SalesCycleController, SalesCycleStepperProps>(
  function SalesCycleStepper({ ctx, onRefresh, onNavigate }, ref) {
    const [busy,    setBusy]    = useState(false);
    const [error,   setError]   = useState<string | null>(null);

    /* ── Reject modal state ── */
    const [rejectVisible, setRejectVisible] = useState(false);
    const [rejectReason,  setRejectReason]  = useState("");
    const [rejectBusy,    setRejectBusy]    = useState(false);
    const [rejectError,   setRejectError]   = useState<string | null>(null);

    /* ── Approve confirmation state ── */
    const [approveVisible, setApproveVisible] = useState(false);
    const [approveBusy,    setApproveBusy]    = useState(false);

    /* Track which step is "active" (first unfinished, unblocked) */
    const activeIndex = STEPS.findIndex(
      (s) => !s.isDone(ctx) && s.guard(ctx).allowed,
    );

    /* ── Navigation helper ── */
    function navigate(path: string) {
      if (onNavigate) {
        onNavigate(path);
      } else {
        console.warn("[SalesCycleStepper] onNavigate not provided; wanted:", path);
      }
    }

    /* ── Action: Submit Proposal ── */
    async function handleSubmitProposal() {
      const g = guardSubmitProposal(ctx);
      if (!g.allowed || !ctx.proposal) return;
      setBusy(true);
      setError(null);
      try {
        await apiSubmitProposal(ctx.proposal.id);
        await onRefresh();
      } catch (err) {
        setError(extractApiError(err));
      } finally {
        setBusy(false);
      }
    }

    /* ── Action: Approve Proposal (fired from modal confirm) ── */
    async function handleApproveProposal() {
      const g = guardApproveProposal(ctx);
      if (!g.allowed || !ctx.proposal) return;
      setApproveBusy(true);
      try {
        await apiApproveProposal(ctx.proposal.id);
        await onRefresh();
        setApproveVisible(false);
      } catch (err) {
        setError(extractApiError(err));
      } finally {
        setApproveBusy(false);
      }
    }

    /* ── Action: Reject Proposal ── */
    async function handleRejectProposal() {
      if (!rejectReason.trim()) {
        setRejectError("A rejection reason is required.");
        return;
      }
      if (!ctx.proposal) return;
      setRejectBusy(true);
      setRejectError(null);
      try {
        await apiRejectProposal(ctx.proposal.id, rejectReason.trim());
        await onRefresh();
        setRejectVisible(false);
        setRejectReason("");
      } catch (err) {
        setRejectError(extractApiError(err));
      } finally {
        setRejectBusy(false);
      }
    }

    /* ── Imperative controller (callable by parent) ── */
    useImperativeHandle(ref, () => ({
      startCreateClient() {
        navigate("/Client/createClient");
      },
      startCreateContact() {
        if (!ctx.client) {
          console.warn("[SalesCycleStepper] No client yet.");
          return;
        }
        navigate(`/Client/${ctx.client.id}/createContact`);
      },
      startCreateOpportunity() {
        if (!ctx.client) {
          console.warn("[SalesCycleStepper] No client yet.");
          return;
        }
        navigate(`/Client/${ctx.client.id}/createOpportunity`);
      },
      startCreateProposal() {
        if (!ctx.opportunity) {
          console.warn("[SalesCycleStepper] No opportunity yet.");
          return;
        }
        navigate(`/opportunities/${ctx.opportunity.id}/createProposal`);
      },
      startApproveProposal() {
        const g = guardApproveProposal(ctx);
        if (!g.allowed) {
          console.warn("[SalesCycleStepper] Approve blocked:", g.reason);
          return;
        }
        setApproveVisible(true);
      },
      startCreateContract() {
        const g = guardCreateContract(ctx);
        if (!g.allowed) {
          console.warn("[SalesCycleStepper] Create contract blocked:", g.reason);
          return;
        }
        const params = new URLSearchParams();
        if (ctx.client?.id)      params.set("clientId",      ctx.client.id);
        if (ctx.opportunity?.id) params.set("opportunityId", ctx.opportunity.id);
        if (ctx.proposal?.id)    params.set("proposalId",    ctx.proposal.id);
        navigate(`/contracts/create?${params.toString()}`);
      },
    }), [ctx]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── Derive AntD Steps items ── */
    const stepItems = STEPS.map((def, i) => {
      const done     = def.isDone(ctx);
      const guard    = def.guard(ctx);
      const isActive = i === activeIndex;
      const status   = stepStatus(def, ctx, isActive);

      const icon = done
        ? <CheckCircleOutlined style={{ color: "#52c41a" }} />
        : !guard.allowed
          ? <LockOutlined style={{ color: "#888" }} />
          : undefined;

      return {
        key:         def.key,
        title:       def.title,
        description: guard.allowed || done ? def.description : (guard.reason ?? def.description),
        status,
        icon,
      };
    });

    /* ── Button bar — one button per step ── */
    const buttons = STEPS.map((def, i) => {
      const done     = def.isDone(ctx);
      const guard    = def.guard(ctx);
      const isActive = i === activeIndex;

      if (done) {
        return (
          <Badge key={def.key} status="success" text={`${def.title} ✓`} style={{ fontSize: 13 }} />
        );
      }

      const btnType = isActive ? "primary" : "default";
      const disabled = !guard.allowed || busy;

      /* Step-specific click handling */
      let onClick: (() => void) | undefined;

      switch (def.key) {
        case "createClient":
          onClick = () => navigate("/Client/createClient");
          break;
        case "createContact":
          onClick = () => ctx.client && navigate(`/Client/${ctx.client.id}/createContact`);
          break;
        case "createOpportunity":
          onClick = () => ctx.client && navigate(`/Client/${ctx.client.id}/createOpportunity`);
          break;
        case "createProposal": {
          /* Two sub-actions: proposal might exist as Draft (submit) or not yet (create) */
          const needsCreate  = !ctx.proposal;
          const needsSubmit  = ctx.proposal?.status === "Draft";
          if (needsCreate) {
            onClick = () =>
              ctx.opportunity &&
              navigate(`/opportunities/${ctx.opportunity.id}/createProposal`);
          } else if (needsSubmit) {
            onClick = handleSubmitProposal;
          }
          break;
        }
        case "approveProposal":
          onClick = () => setApproveVisible(true);
          break;
        case "createContract":
          onClick = () => {
            const params = new URLSearchParams();
            if (ctx.client?.id)      params.set("clientId",      ctx.client.id);
            if (ctx.opportunity?.id) params.set("opportunityId", ctx.opportunity.id);
            if (ctx.proposal?.id)    params.set("proposalId",    ctx.proposal.id);
            navigate(`/contracts/create?${params.toString()}`);
          };
          break;
      }

      /* Sub-label inside create-proposal step (Draft → submit vs create first) */
      const label =
        def.key === "createProposal" && ctx.proposal?.status === "Draft"
          ? "Submit Proposal"
          : def.title;

      const btn = (
        <Button
          key={def.key}
          type={btnType}
          disabled={disabled}
          loading={busy && isActive}
          onClick={disabled ? undefined : onClick}
          style={{ minWidth: 160 }}
        >
          {label}
        </Button>
      );

      return disabled ? (
        <Tooltip key={def.key} title={guard.reason ?? "Unavailable"}>
          <span>{btn}</span>
        </Tooltip>
      ) : btn;
    });

    /* ── Render ── */
    return (
      <div style={{ padding: "24px 0" }}>
        {/* Stepper overview */}
        <Steps
          current={activeIndex === -1 ? STEPS.length : activeIndex}
          items={stepItems}
          style={{ marginBottom: 32 }}
        />

        {/* Action buttons */}
        <Space wrap size="middle">
          {buttons}
        </Space>

        {/* Global error */}
        {error && (
          <div style={{ marginTop: 12, color: "#f44336", fontSize: 13 }}>
            <ExclamationCircleOutlined /> {error}
          </div>
        )}

        {/* ── Approve Confirmation Modal ── */}
        <Modal
          title="Approve Proposal"
          open={approveVisible}
          onOk={handleApproveProposal}
          onCancel={() => { setApproveVisible(false); setError(null); }}
          okText="Approve"
          okButtonProps={{ loading: approveBusy }}
          destroyOnClose
        >
          <Text>
            Are you sure you want to approve{" "}
            <strong>{ctx.proposal?.title ?? "this proposal"}</strong>?
            This action cannot be undone.
          </Text>
          {/* PUT /proposals/{id}/approve — NO body (contract rule #1) */}
        </Modal>

        {/* ── Reject Modal — captures reason ── */}
        <Modal
          title="Reject Proposal"
          open={rejectVisible}
          onOk={handleRejectProposal}
          onCancel={() => {
            setRejectVisible(false);
            setRejectReason("");
            setRejectError(null);
          }}
          okText="Reject"
          okType="danger"
          okButtonProps={{ loading: rejectBusy }}
          destroyOnClose
        >
          {/* PUT /proposals/{id}/reject — body { reason } (contract rule #1) */}
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text>Provide a reason for rejection (required):</Text>
            <Input.TextArea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Pricing is out of budget"
              status={rejectError ? "error" : undefined}
            />
            {rejectError && (
              <Text type="danger" style={{ fontSize: 12 }}>
                {rejectError}
              </Text>
            )}
          </Space>
        </Modal>
      </div>
    );
  },
);

SalesCycleStepper.displayName = "SalesCycleStepper";

export default SalesCycleStepper;

/* ══════════════════════════════════════════════════════════════
   CONVENIENCE RE-EXPORTS FOR CONSUMERS
══════════════════════════════════════════════════════════════ */
export {
  apiSubmitProposal,
  apiApproveProposal,
  apiRejectProposal,
  apiAdvanceStage,
  apiAssignPricingRequest,
  apiCompletePricingRequest,
};
