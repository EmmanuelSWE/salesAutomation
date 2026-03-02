"use client";

/**
 * NotificationBell — Client Component.
 *
 * Renders a fixed-position bell icon with an unread badge.
 * Opens a right-side Drawer with live data from five endpoints:
 *   - GET /activities/overdue
 *   - GET /pricingrequests/my-requests
 *   - GET /contracts/expiring?days=30
 *   - GET /proposals?status=Submitted   (Admin / SalesManager only)
 *   - GET /dashboard/activities-summary
 *
 * Must be rendered inside <UserProvider> so it can read user.roles.
 */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Drawer,
  Empty,
  List,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { UserStateContext } from "../lib/providers/context";
import api from "../lib/utils/axiosInstance";

const { Text, Title } = Typography;

/* ══════════════════════════════════════════════════════════════
   INLINE TYPES — matching documented API response shapes exactly
══════════════════════════════════════════════════════════════ */

/** GET /dashboard/activities-summary → object */
type ActivitiesSummary = {
  totalCount:          number;
  upcomingCount:       number;
  overdueCount:        number;
  completedTodayCount: number;
  byType?: Array<{ type: string; count: number }>;
};

/** GET /contracts/expiring?days=30 → array */
type ContractExpiring = {
  id:               string;
  title:            string;
  clientId?:        string;
  clientName?:      string;
  endDate?:         string;
  daysUntilExpiry?: number;
  isExpiringSoon?:  boolean;
  createdAt?:       string;
};

/** GET /pricingrequests/my-requests → array */
type PricingRequest = {
  id:               string;
  title:            string;
  statusName?:      string;
  priority?:        number;
  requiredByDate?:  string;
  assignedToId?:    string;
  createdAt?:       string;
};

/** GET /activities/overdue → array */
type Activity = {
  id:              string;
  subject?:        string;
  dueDate?:        string;
  relatedToType?:  number;
  relatedToId?:    string;
  createdAt?:      string;
};

/** Generic paged wrapper */
type Paged<T> = { items: T[]; pageNumber: number; pageSize: number; totalCount: number };

/** GET /proposals?status=Submitted → paged (use data.items) */
type Proposal = {
  id:             string;
  title:          string;
  statusName?:    string;
  clientId?:      string;
  opportunityId?: string;
  createdAt?:     string;
};

/* ══════════════════════════════════════════════════════════════
   GENERIC FETCH HOOK
══════════════════════════════════════════════════════════════ */
function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // `mounted` guard: ignores setState after unmount, preventing race
  // conditions when the Drawer is closed while a request is in flight.
  const refresh = useCallback(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d)          => { if (mounted) setData(d); })
      .catch((e: unknown) => { if (mounted) setError((e as { message?: string }).message ?? "Request failed"); })
      .finally(()        => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [fetcher]);

  return { data, loading, error, refresh };
}

/* ══════════════════════════════════════════════════════════════
   PER-ENDPOINT HOOKS
══════════════════════════════════════════════════════════════ */

/** GET /activities/overdue → array of overdue activities */
function useOverdueActivities() {
  const fetcher = useCallback(
    () => api.get<Activity[]>("/activities/overdue").then((r) => r.data),
    [],
  );
  return useFetch(fetcher);
}

/** GET /pricingrequests/my-requests → array of requests assigned to current user */
function useMyPricingRequests() {
  const fetcher = useCallback(
    () => api.get<PricingRequest[]>("/pricingrequests/my-requests").then((r) => r.data),
    [],
  );
  return useFetch(fetcher);
}

/** GET /contracts/expiring?days=30 → array of expiring contracts */
function useContractsExpiring() {
  const fetcher = useCallback(
    () => api.get<ContractExpiring[]>("/contracts/expiring", { params: { days: 30 } }).then((r) => r.data),
    [],
  );
  return useFetch(fetcher);
}

/** GET /proposals?status=Submitted → paged; consume data.items */
function useProposalsSubmitted() {
  const fetcher = useCallback(
    () =>
      api
        .get<Paged<Proposal>>("/proposals", { params: { status: "Submitted", pageNumber: 1, pageSize: 50 } })
        .then((r) => r.data.items),
    [],
  );
  return useFetch<Proposal[]>(fetcher);
}

/** GET /dashboard/activities-summary → summary object */
function useActivitiesSummary() {
  const fetcher = useCallback(
    () => api.get<ActivitiesSummary>("/dashboard/activities-summary").then((r) => r.data),
    [],
  );
  return useFetch(fetcher);
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const LAST_VIEWED_KEY  = "notifications:lastViewedAt";
const POLL_INTERVAL_MS = 60_000;

/** Read the stored last-viewed timestamp (ms); returns 0 if absent. */
function getLastViewedMs(): number {
  try {
    const raw = localStorage.getItem(LAST_VIEWED_KEY);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Count items that have a timestamp (createdAt ?? dueDate) newer than
 * lastViewedMs. Items with no timestamp are treated as new.
 */
function countNew<T extends { createdAt?: string; dueDate?: string }>(
  items: T[] | null | undefined,
  lastViewedMs: number,
): number {
  if (!items?.length) return 0;
  return items.filter((item) => {
    const ts = item.createdAt ?? item.dueDate;
    return ts ? new Date(ts).getTime() > lastViewedMs : true;
  }).length;
}

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function SectionSkeleton() {
  return <Skeleton active paragraph={{ rows: 2 }} style={{ padding: "8px 0" }} />;
}

function SectionError({ msg, onRetry }: Readonly<{ msg: string; onRetry: () => void }>) {
  return (
    <Alert
      type="error"
      message={msg}
      showIcon
      style={{ marginBottom: 8 }}
      action={
        <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
          Retry
        </Button>
      }
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION BELL
══════════════════════════════════════════════════════════════ */
export default function NotificationBell() {
  const { user } = useContext(UserStateContext);

  const isApprover =
    user?.roles?.some((r) => ["Admin", "SalesManager"].includes(r)) ?? false;

  const [open, setOpen]     = useState(false);
  const [unread, setUnread] = useState(0);

  // Refs for a11y focus restore and timer cleanup on unmount.
  const bellRef       = useRef<HTMLButtonElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the focus-restore timer if the component ever unmounts.
  useEffect(() => () => {
    if (focusTimerRef.current !== null) clearTimeout(focusTimerRef.current);
  }, []);

  const overdue   = useOverdueActivities();
  const pricing   = useMyPricingRequests();
  const contracts = useContractsExpiring();
  const proposals = useProposalsSubmitted();
  const summary   = useActivitiesSummary();

  // Extract stable `.refresh` references so `refreshAll`'s dep array is stable.
  // Each per-endpoint hook already memoises `.refresh` via useCallback.
  const overdueRefresh   = overdue.refresh;
  const pricingRefresh   = pricing.refresh;
  const contractsRefresh = contracts.refresh;
  const proposalsRefresh = proposals.refresh;
  const summaryRefresh   = summary.refresh;

  /** Triggers all panels. Deps: stable refresh fns + isApprover (primitive). */
  const refreshAll = useCallback(() => {
    overdueRefresh();
    pricingRefresh();
    contractsRefresh();
    if (isApprover) proposalsRefresh();
    summaryRefresh();
  }, [overdueRefresh, pricingRefresh, contractsRefresh, proposalsRefresh, summaryRefresh, isApprover]);

  // Fetch all panels when the Drawer opens. Deps: open + stable refreshAll.
  useEffect(() => {
    if (open) refreshAll();
  }, [open, refreshAll]);

  // Poll every 60 s while Drawer is open; cleaned up when it closes or unmounts.
  useEffect(() => {
    if (!open) return;
    const id = setInterval(refreshAll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [open, refreshAll]);

  // Recompute unread badge using localStorage timestamp comparison.
  useEffect(() => {
    const lastMs = getLastViewedMs();
    const total =
      countNew(overdue.data,   lastMs) +
      countNew(pricing.data,   lastMs) +
      countNew(contracts.data, lastMs) +
      (isApprover ? countNew(proposals.data, lastMs) : 0);
    setUnread(total);
  }, [overdue.data, pricing.data, contracts.data, proposals.data, isApprover]);

  // Stable event handlers — useCallback prevents unnecessary child re-renders.
  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Restore focus to the bell button after the Drawer finishes closing.
    // Store the timer ID so it can be cancelled on unmount.
    if (focusTimerRef.current !== null) clearTimeout(focusTimerRef.current);
    focusTimerRef.current = setTimeout(() => {
      bellRef.current?.focus();
      focusTimerRef.current = null;
    }, 50);
  }, []);

  const handleMarkAllViewed = useCallback(() => {
    try { localStorage.setItem(LAST_VIEWED_KEY, String(Date.now())); } catch { /* storage unavailable */ }
    setUnread(0);
  }, []);

  const anyLoading =
    overdue.loading || pricing.loading || contracts.loading ||
    (isApprover && proposals.loading) || summary.loading;

  return (
    <>
      {/* ── Bell trigger ── */}
      <div style={{ position: "fixed", top: 14, right: 18, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tooltip title="Notifications">
          <Badge count={unread} overflowCount={99} size="small">
            <button
              ref={bellRef}
              type="button"
              aria-label={`Notifications${unread ? ` — ${unread} new` : ""}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={handleOpen}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#f39c12"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#d0d0d0"; }}
              style={{
                background:     "transparent",
                border:         "none",
                cursor:         "pointer",
                color:          "#d0d0d0",
                fontSize:       20,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        6,
                borderRadius:   8,
                transition:     "color 0.2s",
              }}
            >
              <BellOutlined />
            </button>
          </Badge>
        </Tooltip>
      </div>

      {/* ── Notifications Drawer ── */}
      <Drawer
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Notifications</span>
            <Space>
              <Tooltip title="Refresh all">
                <Button
                  size="small"
                  icon={<ReloadOutlined spin={anyLoading} />}
                  onClick={refreshAll}
                  aria-label="Refresh notifications"
                />
              </Tooltip>
              <Button size="small" icon={<CheckCircleOutlined />} onClick={handleMarkAllViewed}>
                Mark all viewed
              </Button>
            </Space>
          </div>
        }
        placement="right"
        size="default"
        open={open}
        onClose={handleClose}
        styles={{ body: { padding: "12px 16px", background: "#1a1a1a" } }}
        style={{ background: "#1a1a1a" }}
        aria-label="Notifications panel"
      >

        {/* ── Today's Summary ── */}
        <section aria-labelledby="notif-summary-heading">
          <Title level={5} id="notif-summary-heading" style={{ color: "#f0f0f0", marginBottom: 8 }}>
            Today&rsquo;s Summary
          </Title>
          {summary.loading ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}><Spin size="small" /></div>
          ) : summary.error   ? <SectionError msg={summary.error} onRetry={summary.refresh} /> : (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
              {[
                { label: "Upcoming",   value: summary.data?.upcomingCount       ?? 0, color: "#2979ff" },
                { label: "Overdue",    value: summary.data?.overdueCount        ?? 0, color: "#ef5350" },
                { label: "Done Today", value: summary.data?.completedTodayCount ?? 0, color: "#4caf50" },
                { label: "Total",      value: summary.data?.totalCount          ?? 0, color: "#a0a0a0" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                  <Text style={{ fontSize: 11, color: "#888" }}>{label}</Text>
                </div>
              ))}
            </div>
          )}
        </section>

        <Divider style={{ borderColor: "#333", margin: "12px 0" }} />

        {/* ── Overdue Activities ── */}
        <section aria-labelledby="notif-overdue-heading">
          <Title level={5} id="notif-overdue-heading" style={{ color: "#ef5350", marginBottom: 6 }}>
            Overdue Activities
          </Title>
          {overdue.loading ? <SectionSkeleton /> :
           overdue.error   ? <SectionError msg={overdue.error} onRetry={overdue.refresh} /> :
           !overdue.data?.length
             ? <Empty description="No overdue activities" image={Empty.PRESENTED_IMAGE_SIMPLE} />
             : (
              <List<Activity>
                dataSource={overdue.data}
                size="small"
                renderItem={(item) => (
                  <List.Item key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a" }}>
                    <div style={{ flex: 1 }}>
                      <Text style={{ color: "#e0e0e0", fontSize: 13 }}>{item.subject ?? "Activity"}</Text>
                      <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
                        <Tag color="error" style={{ fontSize: 11 }}>Overdue</Tag>
                        <Text style={{ color: "#888", fontSize: 11 }}>{relativeTime(item.dueDate)}</Text>
                      </div>
                    </div>
                    {item.relatedToId && (
                      <Link href="/activities" style={{ fontSize: 12, color: "#f5a623" }}>Open</Link>
                    )}
                  </List.Item>
                )}
              />
            )}
        </section>

        <Divider style={{ borderColor: "#333", margin: "12px 0" }} />

        {/* ── My Pricing Requests ── */}
        <section aria-labelledby="notif-pricing-heading">
          <Title level={5} id="notif-pricing-heading" style={{ color: "#29b6f6", marginBottom: 6 }}>
            My Pricing Requests
          </Title>
          {pricing.loading ? <SectionSkeleton /> :
           pricing.error   ? <SectionError msg={pricing.error} onRetry={pricing.refresh} /> :
           !pricing.data?.length
             ? <Empty description="No pricing requests assigned" image={Empty.PRESENTED_IMAGE_SIMPLE} />
             : (
              <List<PricingRequest>
                dataSource={pricing.data}
                size="small"
                renderItem={(item) => (
                  <List.Item key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a" }}>
                    <div style={{ flex: 1 }}>
                      <Text style={{ color: "#e0e0e0", fontSize: 13 }}>{item.title}</Text>
                      <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
                        {item.statusName && <Tag style={{ fontSize: 11 }}>{item.statusName}</Tag>}
                        {item.priority != null && (
                          <Tag
                            color={item.priority <= 1 ? "error" : item.priority === 2 ? "warning" : "default"}
                            style={{ fontSize: 11 }}
                          >
                            P{item.priority}
                          </Tag>
                        )}
                        {item.requiredByDate && (
                          <Text style={{ color: "#888", fontSize: 11 }}>By {relativeTime(item.requiredByDate)}</Text>
                        )}
                      </div>
                    </div>
                    <Link href="/pricingRequests" style={{ fontSize: 12, color: "#f5a623" }}>Review</Link>
                  </List.Item>
                )}
              />
            )}
        </section>

        <Divider style={{ borderColor: "#333", margin: "12px 0" }} />

        {/* ── Expiring Contracts (30 days) ── */}
        <section aria-labelledby="notif-contracts-heading">
          <Title level={5} id="notif-contracts-heading" style={{ color: "#faad14", marginBottom: 6 }}>
            Expiring Soon (30 days)
          </Title>
          {contracts.loading ? <SectionSkeleton /> :
           contracts.error   ? <SectionError msg={contracts.error} onRetry={contracts.refresh} /> :
           !contracts.data?.length
             ? <Empty description="No contracts expiring soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
             : (
              <List<ContractExpiring>
                dataSource={contracts.data}
                size="small"
                renderItem={(item) => (
                  <List.Item key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a" }}>
                    <div style={{ flex: 1 }}>
                      <Text style={{ color: "#e0e0e0", fontSize: 13 }}>{item.title}</Text>
                      <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
                        {item.daysUntilExpiry != null && (
                          <Tag color={item.isExpiringSoon ? "orange" : "default"} style={{ fontSize: 11 }}>
                            {item.daysUntilExpiry}d left
                          </Tag>
                        )}
                        {item.clientName && (
                          <Text style={{ color: "#888", fontSize: 11 }}>{item.clientName}</Text>
                        )}
                      </div>
                    </div>
                    <Link href="/contracts" style={{ fontSize: 12, color: "#f5a623" }}>View</Link>
                  </List.Item>
                )}
              />
            )}
        </section>

        {/* ── Proposals Awaiting Approval (Admin / SalesManager only) ── */}
        {isApprover && (
          <>
            <Divider style={{ borderColor: "#333", margin: "12px 0" }} />
            <section aria-labelledby="notif-proposals-heading">
              <Title level={5} id="notif-proposals-heading" style={{ color: "#ab47bc", marginBottom: 6 }}>
                Proposals Awaiting Approval
              </Title>
              {proposals.loading ? <SectionSkeleton /> :
               proposals.error   ? <SectionError msg={proposals.error} onRetry={proposals.refresh} /> :
               !proposals.data?.length
                 ? <Empty description="No proposals pending approval" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                 : (
                  <List<Proposal>
                    dataSource={proposals.data}
                    size="small"
                    renderItem={(item) => (
                      <List.Item key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a" }}>
                        <div style={{ flex: 1 }}>
                          <Text style={{ color: "#e0e0e0", fontSize: 13 }}>{item.title}</Text>
                          {item.statusName && (
                            <Tag style={{ fontSize: 11, marginLeft: 4 }}>{item.statusName}</Tag>
                          )}
                        </div>
                        <Link
                          href={item.clientId ? `/Client/${item.clientId}/clientOverView` : "/opportunities"}
                          style={{ fontSize: 12, color: "#f5a623" }}
                        >
                          Open proposal
                        </Link>
                      </List.Item>
                    )}
                  />
                )}
            </section>
          </>
        )}

      </Drawer>
    </>
  );
}
