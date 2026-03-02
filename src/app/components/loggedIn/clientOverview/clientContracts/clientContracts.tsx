"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useCardStyles } from "../card/card.module";
import { useClientContractsStyles } from "./clientContracts.module";
import type { IContract } from "../../../../lib/providers/context";
import type { ContractStatus } from "../../../../lib/utils/apiEnums";
import { useContractAction, useUserState } from "../../../../lib/providers/provider";

interface ClientContractsProps {
  contracts:  IContract[];
  clientId:   string;
  isPending?: boolean;
  isError?:   boolean;
}

const STATUS_KEY: Record<ContractStatus, string> = {
  Draft:     "draft",
  Active:    "active",
  Expired:   "expired",
  Renewed:   "renewed",
  Cancelled: "cancelled",
};

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function fmtCurrency(value?: number, currency?: string) {
  if (value === undefined || value === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function isManager(role?: string, roles?: string[]): boolean {
  const check = (r: string) => r === "Admin" || r === "SalesManager";
  if (role && check(role)) return true;
  return roles?.some(check) ?? false;
}

function isAdmin(role?: string, roles?: string[]): boolean {
  const check = (r: string) => r === "Admin";
  if (role && check(role)) return true;
  return roles?.some(check) ?? false;
}

export default function ClientContracts({
  contracts,
  clientId,
  isPending,
  isError,
}: Readonly<ClientContractsProps>) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientContractsStyles();
  const { user }             = useUserState();
  const contractActions      = useContractAction();

  const canManage = isManager(user?.role, user?.roles);
  const canDelete = isAdmin(user?.role, user?.roles);

  const [actingId, setActingId]       = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleActivate(contractId: string) {
    setActingId(contractId);
    setActionError(null);
    try {
      await contractActions.activateContract(contractId);
      await contractActions.getContractsByClient(clientId);
    } catch {
      setActionError("Failed to activate contract.");
    } finally {
      setActingId(null);
    }
  }

  async function handleCancel(contractId: string) {
    setActingId(contractId);
    setActionError(null);
    try {
      await contractActions.cancelContract(contractId);
      await contractActions.getContractsByClient(clientId);
    } catch {
      setActionError("Failed to cancel contract.");
    } finally {
      setActingId(null);
    }
  }

  async function handleDelete(contractId: string) {
    if (!globalThis.confirm("Delete this contract? This cannot be undone.")) return;
    setActingId(contractId);
    setActionError(null);
    try {
      await contractActions.deleteContract(contractId);
      await contractActions.getContractsByClient(clientId);
    } catch {
      setActionError("Failed to delete contract.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className={card.card}>
      {/* Header */}
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Contracts</h3>
        {canManage && (
          <Link
            href={`/contracts/create?clientId=${clientId}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "4px 14px", borderRadius: 16, fontSize: 11, fontWeight: 600,
              background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.35)",
              color: "#f5a623", textDecoration: "none",
            }}
          >
            <PlusOutlined style={{ fontSize: 10 }} /> Contract
          </Link>
        )}
      </div>

      <hr className={card.divider} />

      {/* Action error */}
      {actionError && (
        <div style={{
          margin: "8px 0",
          padding: "8px 14px",
          background: "rgba(244,67,54,0.08)",
          border: "1px solid rgba(244,67,54,0.3)",
          borderRadius: 8,
          color: "#f44336",
          fontSize: 12,
        }}>
          {actionError}
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <div className={styles.skeletonWrap}>
          {[1, 2, 3].map((k) => (
            <div key={k} className={styles.skeletonRow}>
              <div className={styles.skeletonBlock} style={{ width: "35%", height: 13 }} />
              <div className={styles.skeletonBlock} style={{ width: "14%", height: 20, borderRadius: 20 }} />
              <div className={styles.skeletonBlock} style={{ width: "12%", height: 13 }} />
              <div className={styles.skeletonBlock} style={{ width: "12%", height: 13 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isPending && isError && (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>⚠</div>
          <p className={styles.emptyTitle}>Failed to load contracts</p>
          <p className={styles.emptySub}>Check your connection and try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && contracts.length === 0 && (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>No contracts yet</p>
          <p className={styles.emptySub}>
            Click <strong>+ Contract</strong> to create one from an approved proposal.
          </p>
        </div>
      )}

      {/* Table */}
      {!isPending && !isError && contracts.length > 0 && (
        <table className={card.table}>
          <thead>
            <tr>
              <th className={card.th}>Title</th>
              <th className={card.th}>Value</th>
              <th className={card.th}>Status</th>
              <th className={card.th}>Start Date</th>
              <th className={card.th}>End Date</th>
              {canManage && <th className={card.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => {
              const status   = c.status ?? "Draft";
              const key      = STATUS_KEY[status];
              const isActing = actingId === c.id;

              return (
                <tr key={c.id}>
                  <td className={cx(card.td, card.tdWhite)}>
                    {c.title || "Untitled"}
                  </td>

                  <td className={card.td}>
                    {fmtCurrency(c.contractValue, c.currency)}
                  </td>

                  <td className={card.td}>
                    <span className={cx(styles.badge, styles[key as keyof typeof styles])}>
                      {status}
                    </span>
                    {c.isExpiringSoon && (
                      <span className={styles.expiryPill}>⚠ Expiring Soon</span>
                    )}
                  </td>

                  <td className={card.td}>{fmt(c.startDate)}</td>
                  <td className={card.td}>{fmt(c.endDate)}</td>

                  {canManage && (
                    <td className={card.td}>
                      <ContractActions
                        contractId={c.id ?? ""}
                        clientId={clientId}
                        status={status}
                        isActing={isActing}
                        canDelete={canDelete}
                        onActivate={handleActivate}
                        onCancel={handleCancel}
                        onDelete={handleDelete}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Action buttons sub-component ─────────────────────────────── */

interface ContractActionsProps {
  contractId: string;
  clientId:   string;
  status:     ContractStatus;
  isActing:   boolean;
  canDelete:  boolean;
  onActivate: (id: string) => void;
  onCancel:   (id: string) => void;
  onDelete:   (id: string) => void;
}

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: 16,
  fontSize: 11,
  fontWeight: 600,
  border: "1px solid",
  cursor: "pointer",
  transition: "opacity 0.15s",
  background: "transparent",
};

function ContractActions({
  contractId,
  clientId,
  status,
  isActing,
  canDelete,
  onActivate,
  onCancel,
  onDelete,
}: Readonly<ContractActionsProps>) {
  if (isActing) {
    return <span style={{ fontSize: 11, color: "#888" }}>Updating…</span>;
  }

  if (status === "Draft") {
    return (
      <span style={{ display: "inline-flex", gap: 6 }}>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(76,175,80,0.1)", borderColor: "rgba(76,175,80,0.35)", color: "#4caf50" }}
          onClick={() => onActivate(contractId)}
          title="Activate contract"
        >
          <CheckOutlined style={{ fontSize: 10 }} /> Activate
        </button>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(244,67,54,0.08)", borderColor: "rgba(244,67,54,0.3)", color: "#f44336" }}
          onClick={() => onDelete(contractId)}
          title="Delete draft contract"
        >
          <DeleteOutlined style={{ fontSize: 10 }} />
        </button>
      </span>
    );
  }

  if (status === "Active") {
    return (
      <span style={{ display: "inline-flex", gap: 6 }}>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(244,67,54,0.08)", borderColor: "rgba(244,67,54,0.3)", color: "#f44336" }}
          onClick={() => onCancel(contractId)}
          title="Cancel contract"
        >
          <CloseOutlined style={{ fontSize: 10 }} /> Cancel
        </button>
        <Link
          href={`/contracts/${contractId}/createRenewal?clientId=${clientId}`}
          style={{
            ...btnBase,
            background: "rgba(92,107,192,0.08)",
            borderColor: "rgba(92,107,192,0.4)",
            color: "#9aa0dc",
            textDecoration: "none",
          }}
          title="Create renewal"
        >
          + Renewal
        </Link>
        {canDelete && (
          <button
            type="button"
            style={{ ...btnBase, background: "rgba(244,67,54,0.08)", borderColor: "rgba(244,67,54,0.3)", color: "#f44336" }}
            onClick={() => onDelete(contractId)}
            title="Delete contract"
          >
            <DeleteOutlined style={{ fontSize: 10 }} />
          </button>
        )}
      </span>
    );
  }

  /* Expired / Renewed / Cancelled — terminal states */
  return <span style={{ fontSize: 11, color: "#555" }}>—</span>;
}
