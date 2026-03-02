"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  UserAddOutlined,
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { usePricingRequestsStyles } from "./pricingRequests.module";
import { extractApiMessage } from "../../../lib/utils/apiMutations";
import {
  usePricingRequestState,
  usePricingRequestAction,
  useUserState,
  useUserAction,
} from "../../../lib/providers/provider";
import type { PricingRequestStatus, Priority } from "../../../lib/utils/apiEnums";

const PAGE_SIZE = 10;

type Tab = "all" | "pending" | "my";

const AVATAR_COLORS = [
  "#5c6bc0", "#26a69a", "#ef5350", "#f5a623",
  "#78909c", "#ab47bc", "#29b6f6", "#66bb6a",
];

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string }> = {
  Low:    { bg: "rgba(41,182,246,0.12)",  text: "#29b6f6" },
  Medium: { bg: "rgba(245,166,35,0.12)",  text: "#f5a623" },
  High:   { bg: "rgba(255,112,67,0.12)",  text: "#ff7043" },
  Urgent: { bg: "rgba(239,83,80,0.14)",   text: "#ef5350" },
};

const STATUS_STYLE: Record<PricingRequestStatus, { bg: string; text: string }> = {
  "Pending":     { bg: "rgba(120,120,120,0.15)", text: "#999" },
  "In Progress": { bg: "rgba(92,107,192,0.15)",  text: "#9aa0dc" },
  "Completed":   { bg: "rgba(38,166,154,0.15)",  text: "#26a69a" },
};

const getInitials = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

function isManager(role?: string, roles?: string[]): boolean {
  const check = (r: string) => r === "Admin" || r === "SalesManager";
  if (role && check(role)) return true;
  return roles?.some(check) ?? false;
}

const TAB_LABEL: Record<Tab, string> = {
  all:     "All Requests",
  pending: "Unassigned",
  my:      "My Requests",
};

export default function PricingRequestsList() {
  const { styles, cx } = usePricingRequestsStyles();
  const { pricingRequests, isPending, isError } = usePricingRequestState();
  const { getPricingRequests, getPendingRequests, getMyRequests, assignRequest } =
    usePricingRequestAction();
  const { user, users } = useUserState();
  const { getUsers }    = useUserAction();

  const [tab, setTab]         = useState<Tab>("all");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignee, setAssignee]       = useState("");
  const [busy, setBusy]               = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const canManage = isManager(user?.role, user?.roles);

  /* Load users for assign dropdown when admin/manager */
  useEffect(() => {
    if (canManage) getUsers({ isActive: true });
  }, [canManage]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Fetch data whenever tab or page changes */
  useEffect(() => {
    if (tab === "pending") {
      getPendingRequests();
    } else if (tab === "my") {
      getMyRequests();
    } else {
      getPricingRequests({ pageNumber: page, pageSize: PAGE_SIZE });
    }
  }, [tab, page]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Assign handler ── */
  async function handleAssign(id: string) {
    if (!id || !assignee) return;
    setBusy(id);
    setActionError(null);
    try {
      await assignRequest(id, assignee);
      setAssigningId(null);
      setAssignee("");
    } catch (err) {
      setActionError(extractApiMessage(err) || "Failed to assign pricing request.");
    } finally {
      setBusy(null);
    }
  }

  /* ── Skeleton ── */
  if (isPending) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Pricing Requests</h1>
        <div className={styles.listContainer}>
          <div className={styles.toolbar}>
            <div className={styles.skeletonSearch} />
            <div className={styles.skeletonBtn} />
            <div className={styles.skeletonBtn} />
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Required By</th>
                  <th>Assigned To</th>
                  {canManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {["a", "b", "c", "d", "e", "f"].map((k) => (
                  <tr key={k}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className={styles.skeletonAvatar} />
                        <div className={styles.skeletonBlock} style={{ width: 180 }} />
                      </div>
                    </td>
                    <td><div className={styles.skeletonBlock} style={{ width: 60, borderRadius: 20 }} /></td>
                    <td><div className={styles.skeletonBlock} style={{ width: 80, borderRadius: 20 }} /></td>
                    <td><div className={styles.skeletonBlock} style={{ width: 90 }} /></td>
                    <td><div className={styles.skeletonBlock} style={{ width: 110 }} /></td>
                    {canManage && <td><div className={styles.skeletonBlock} style={{ width: 120 }} /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Pricing Requests</h1>
        <p style={{ color: "#ef5350", marginTop: 40, textAlign: "center" }}>
          Failed to load pricing requests.
        </p>
      </div>
    );
  }

  const allRows = pricingRequests ?? [];

  const filtered = allRows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      (r.status ?? "").toLowerCase().includes(q) ||
      (r.priority ?? "").toLowerCase().includes(q)
    );
  });

  const rows       = search ? filtered : allRows;
  const totalPages = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Pricing Requests</h1>

      {/* ── Tabs ── */}
      <div className={styles.tabsBar}>
        {(["all", "my"] as Tab[]).concat(canManage ? ["pending" as Tab] : []).map((t) => (
          <button
            key={t}
            type="button"
            className={cx(styles.tab, tab === t && styles.tabActive)}
            onClick={() => { setTab(t); setPage(1); }}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      <div className={styles.listContainer}>
        {/* ── Action error banner ── */}
        {actionError && (
          <div style={{
            margin: "0 0 12px",
            padding: "10px 14px",
            background: "rgba(244,67,54,0.08)",
            border: "1px solid rgba(244,67,54,0.3)",
            borderRadius: 8,
            color: "#f44336",
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}>
            <span>{actionError}</span>
            <button
              type="button"
              onClick={() => setActionError(null)}
              style={{ background: "none", border: "none", color: "#f44336", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
            >×</button>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <SearchOutlined className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by title, priority or status…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className={styles.iconBtn} type="button" title="Filter">
            <FilterOutlined />
          </button>
          <Link href="/pricingRequests/create" className={styles.addBtn}>
            + New Request
          </Link>
        </div>

        {/* ── Table ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Required By</th>
                <th>Assigned To</th>
                {canManage && <th>Actions</th>}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 6 : 5} className={styles.emptyRow}>
                    No pricing requests found.
                  </td>
                </tr>
              ) : (
                rows.map((req, i) => {
                  const priorityStyle = PRIORITY_STYLE[req.priority] ??
                    { bg: "rgba(102,102,102,0.15)", text: "#666" };
                  const statusStyle   = STATUS_STYLE[req.status as PricingRequestStatus] ??
                    { bg: "rgba(102,102,102,0.15)", text: "#666" };
                  const isBusy        = busy === req.id;
                  const isAssigning   = assigningId === req.id;

                  return (
                    <tr key={req.id ?? i}>
                      {/* Title */}
                      <td>
                        <div className={styles.titleCell}>
                          <div
                            className={styles.avatar}
                            style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                          >
                            {getInitials(req.title)}
                          </div>
                          <span className={styles.titleName}>{req.title}</span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td>
                        <span
                          className={styles.badge}
                          style={{ background: priorityStyle.bg, color: priorityStyle.text }}
                        >
                          {req.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={styles.badge}
                          style={{ background: statusStyle.bg, color: statusStyle.text }}
                        >
                          {req.status ?? "Pending"}
                        </span>
                      </td>

                      {/* Required By */}
                      <td>
                        <div className={styles.dateCell}>
                          <CalendarOutlined />
                          {formatDate(req.requiredByDate)}
                        </div>
                      </td>

                      {/* Assigned To */}
                      <td style={{ color: req.assignedToId ? "#ccc" : "#555", fontSize: 12 }}>
                        {req.assignedToId ?? "—"}
                      </td>

                      {/* Actions (Admin / SalesManager only) */}
                      {canManage && (
                        <td>
                          {(() => {
                            if (isBusy) {
                              return <span style={{ fontSize: 11, color: "#888" }}>Working…</span>;
                            }
                            if (isAssigning) {
                              return (
                                <div className={styles.inlineAssign}>
                                  <select
                                    className={styles.inlineSelect}
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                  >
                                    <option value="">Select user…</option>
                                    {(users ?? []).map((u) => (
                                      <option key={u.id} value={u.id ?? ""}>
                                        {u.firstName} {u.lastName}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    className={cx(styles.actionBtn, styles.actionBtnGreen)}
                                    disabled={!assignee || !req.id}
                                    onClick={() => req.id && handleAssign(req.id)}
                                  >
                                    <CheckOutlined style={{ fontSize: 10 }} /> Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className={cx(styles.actionBtn, styles.actionBtnRed)}
                                    onClick={() => { setAssigningId(null); setAssignee(""); }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              );
                            }
                            return (
                              <div className={styles.actionCell}>
                                <button
                                  type="button"
                                  className={styles.actionBtn}
                                  onClick={() => { setAssigningId(req.id ?? null); setAssignee(""); }}
                                  title="Assign to user"
                                >
                                  <UserAddOutlined style={{ fontSize: 10 }} /> Assign
                                </button>
                              </div>
                            );
                          })()}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination (all tab only) ── */}
        {tab === "all" && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <LeftOutlined />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={cx(styles.pageBtn, page === n && styles.pageBtnActive)}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className={styles.pageBtn}
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
