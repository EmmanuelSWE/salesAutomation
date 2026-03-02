/**
 * Root layout — App Router.
 *
 * NOTE: "use client" is required here to power the NotificationBell hooks.
 * As a consequence, Next.js will NOT serve the `metadata` export below at
 * runtime (client components cannot export metadata in App Router).
 * To restore server-side metadata, extract NotificationBell to its own file
 * and remove "use client" from this module.
 */
"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Script from "next/script";
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
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { BellOutlined, ReloadOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import {
  UserProvider,
  ClientProvider,
  ContactProvider,
  OpportunityProvider,
  ProposalProvider,
  PricingRequestProvider,
  ContractProvider,
  ActivityProvider,
  NoteProvider,
} from "./lib/providers/provider";
import { UserStateContext } from "./lib/providers/context";
import api from "./lib/utils/axiosInstance";

const { Text, Title } = Typography;

/* ══════════════════════════════════════════════════════════════
   FONTS
══════════════════════════════════════════════════════════════ */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/* ══════════════════════════════════════════════════════════════
   SEO METADATA
   Declared here for completeness; move this file back to a Server
   Component (remove "use client") to have Next.js serve these tags.
══════════════════════════════════════════════════════════════ */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for when file is reverted to SC
export const metadata = {
  title: {
    default: "TransformSales — CRM & Pipeline Management",
    template: "%s | TransformSales",
  },
  description:
    "TransformSales gives your sales team a single place to manage clients, opportunities, proposals, contracts, and activities — from first contact to closed deal.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://transformsales.app" },
  openGraph: {
    type:        "website",
    siteName:    "TransformSales",
    title:       "TransformSales — CRM & Pipeline Management",
    description: "Manage your full sales cycle: clients, pipeline, proposals, and contracts in one place.",
    url:         "https://transformsales.app",
    images: [{ url: "https://transformsales.app/og-image.png", width: 1200, height: 630, alt: "TransformSales dashboard" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "TransformSales — CRM & Pipeline Management",
    description: "Manage your full sales cycle in one place.",
    images:      ["https://transformsales.app/og-image.png"],
  },
};

/* ══════════════════════════════════════════════════════════════
   JSON-LD  (WebSite schema)
══════════════════════════════════════════════════════════════ */
const JSON_LD_WEBSITE = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TransformSales",
  "url": "https://transformsales.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://transformsales.app/clients?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
});

/* ══════════════════════════════════════════════════════════════
   INLINE TYPES — matching documented API response shapes exactly
══════════════════════════════════════════════════════════════ */

/** GET /dashboard/activities-summary → object */
type ActivitiesSummary = {
  totalCount: number;
  upcomingCount: number;
  overdueCount: number;
  completedTodayCount: number;
  byType?: Array<{ type: string; count: number }>;
};

/** GET /contracts/expiring?days=30 → array */
type ContractExpiring = {
  id: string;
  title: string;
  clientId?: string;
  clientName?: string;
  endDate?: string;
  daysUntilExpiry?: number;
  isExpiringSoon?: boolean;
};

/** GET /pricingrequests/my-requests → array */
type PricingRequest = {
  id: string;
  title: string;
  statusName?: string;
  priority?: number;
  requiredByDate?: string;
  assignedToId?: string;
};

/** GET /activities/overdue → array */
type Activity = {
  id: string;
  subject?: string;
  dueDate?: string;
  relatedToType?: number;
  relatedToId?: string;
};

/** Paged wrapper */
type Paged<T> = { items: T[]; pageNumber: number; pageSize: number; totalCount: number };

/** GET /proposals?status=Submitted → paged (use data.items) */
type Proposal = {
  id: string;
  title: string;
  statusName?: string;
  clientId?: string;
  opportunityId?: string;
};

/* ══════════════════════════════════════════════════════════════
   GENERIC FETCH HOOK
══════════════════════════════════════════════════════════════ */
function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then(setData)
      .catch((e: unknown) =>
        setError((e as { message?: string }).message ?? "Request failed"),
      )
      .finally(() => setLoading(false));
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
function useContractsExpiring(days = 30) {
  const fetcher = useCallback(
    () => api.get<ContractExpiring[]>("/contracts/expiring", { params: { days } }).then((r) => r.data),
    [days],
  );
  return useFetch(fetcher);
}

/** GET /proposals?status=Submitted → paged; use data.items */
function useProposalsSubmittedForApproval() {
  const fetcher = useCallback(
    () =>
      api
        .get<Paged<Proposal>>("/proposals", { params: { status: "Submitted" } })
        .then((r) => r.data.items),
    [],
  );
  return useFetch(fetcher);
}

/** GET /dashboard/activities-summary → object with counts */
function useActivitiesSummary() {
  const fetcher = useCallback(
    () =>
      api.get<ActivitiesSummary>("/dashboard/activities-summary").then((r) => r.data),
    [],
  );
  return useFetch(fetcher);
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
const LAST_VIEWED_KEY = "notifications_lastViewedAt";
const POLL_INTERVAL_MS = 60_000;

function relativeTime(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
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
   NOTIFICATION BELL  (must be rendered inside UserProvider)
══════════════════════════════════════════════════════════════ */
function NotificationBell() {
  const { user } = useContext(UserStateContext);

  const isApprover =
    user?.roles?.some((r) => ["Admin", "SalesManager"].includes(r)) ?? false;

  const [open, setOpen]           = useState(false);
  const [lastViewed, setLastViewed] = useState<number>(() => {
    try { return Number(localStorage.getItem(LAST_VIEWED_KEY) ?? "0"); }
    catch { return 0; }
  });
  const [unread, setUnread]       = useState(0);
  const bellRef                   = useRef<HTMLButtonElement>(null);

  const overdue   = useOverdueActivities();
  const pricing   = useMyPricingRequests();
  const contracts = useContractsExpiring(30);
  const proposals = useProposalsSubmittedForApproval();
  const summary   = useActivitiesSummary();

  /** Fetch all panels */
  const refreshAll = useCallback(() => {
    overdue.refresh();
    pricing.refresh();
    contracts.refresh();
    if (isApprover) proposals.refresh();
    summary.refresh();
  }, [overdue, pricing, contracts, proposals, summary, isApprover]);

  /** Initial fetch when drawer opens */
  useEffect(() => {
    if (open) refreshAll();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Poll every 60 s while drawer is open */
  useEffect(() => {
    if (!open) return;
    const id = setInterval(refreshAll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [open, refreshAll]);

  /** Recompute unread badge from total item counts */
  useEffect(() => {
    const total =
      (overdue.data?.length   ?? 0) +
      (pricing.data?.length   ?? 0) +
      (contracts.data?.length ?? 0) +
      (isApprover ? (proposals.data?.length ?? 0) : 0);
    setUnread(total);
  }, [overdue.data, pricing.data, contracts.data, proposals.data, isApprover]);

  function handleMarkAllViewed() {
    const now = Date.now();
    try { localStorage.setItem(LAST_VIEWED_KEY, String(now)); } catch { /* ignore */ }
    setLastViewed(now);
    setUnread(0);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    // Restore focus to bell button
    setTimeout(() => bellRef.current?.focus(), 50);
  }

  const anyLoading =
    overdue.loading || pricing.loading || contracts.loading ||
    (isApprover && proposals.loading) || summary.loading;

  return (
    <>
      {/* ── Bell trigger ── */}
      <div
        style={{
          position: "fixed",
          top: 14,
          right: 18,
          zIndex: 1100,
        }}
      >
        <Tooltip title="Notifications">
          <Badge count={unread} overflowCount={99} size="small">
            <button
              ref={bellRef}
              type="button"
              aria-label="Notifications"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={handleOpen}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#d0d0d0",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                padding: 6,
                borderRadius: 8,
              }}
            >
              <BellOutlined />
            </button>
          </Badge>
        </Tooltip>
      </div>

      {/* ── Drawer ── */}
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
              <Button size="small" onClick={handleMarkAllViewed}>
                Mark all viewed
              </Button>
            </Space>
          </div>
        }
        placement="right"
        width={400}
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
          {summary.loading ? <SectionSkeleton /> :
           summary.error   ? <SectionError msg={summary.error} onRetry={summary.refresh} /> : (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
              {[
                { label: "Upcoming",       value: summary.data?.upcomingCount       ?? 0, color: "#2979ff" },
                { label: "Overdue",        value: summary.data?.overdueCount        ?? 0, color: "#ef5350" },
                { label: "Done Today",     value: summary.data?.completedTodayCount ?? 0, color: "#4caf50" },
                { label: "Total",          value: summary.data?.totalCount          ?? 0, color: "#a0a0a0" },
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
           !overdue.data?.length ? <Empty description="No overdue activities" image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
            <List<Activity>
              dataSource={overdue.data}
              size="small"
              renderItem={(item) => (
                <List.Item key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a" }}>
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: "#e0e0e0", fontSize: 13 }}>
                      {item.subject ?? "Activity"}
                    </Text>
                    <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
                      <Tag color="error" style={{ fontSize: 11 }}>Overdue</Tag>
                      <Text style={{ color: "#888", fontSize: 11 }}>{relativeTime(item.dueDate)}</Text>
                    </div>
                  </div>
                  {item.relatedToId && (
                    <Link href={`/activities`} style={{ fontSize: 12, color: "#f5a623" }}>
                      Open
                    </Link>
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
           !pricing.data?.length ? <Empty description="No pricing requests assigned" image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
            <List<PricingRequest>
              dataSource={pricing.data}
              size="small"
              renderItem={(item) => (
                <List.Item key={item.id} style={{ padding: "6px 0", borderBottom: "1px solid #2a2a2a" }}>
                  <div style={{ flex: 1 }}>
                    <Text style={{ color: "#e0e0e0", fontSize: 13 }}>{item.title}</Text>
                    <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
                      {item.statusName && <Tag style={{ fontSize: 11 }}>{item.statusName}</Tag>}
                      <Text style={{ color: "#888", fontSize: 11 }}>{relativeTime(item.requiredByDate)}</Text>
                    </div>
                  </div>
                  <Link href="/pricingRequests" style={{ fontSize: 12, color: "#f5a623" }}>
                    Review
                  </Link>
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
           !contracts.data?.length ? <Empty description="No contracts expiring soon" image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
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
                  <Link href="/contracts" style={{ fontSize: 12, color: "#f5a623" }}>
                    View
                  </Link>
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
               !proposals.data?.length ? <Empty description="No proposals pending approval" image={Empty.PRESENTED_IMAGE_SIMPLE} /> : (
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

/* ══════════════════════════════════════════════════════════════
   ROOT LAYOUT
══════════════════════════════════════════════════════════════ */
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body style={{ backgroundColor: "black" }}>
        {/* JSON-LD — WebSite schema */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON_LD_WEBSITE }}
          strategy="afterInteractive"
        />

        <ConfigProvider
          theme={{
            token: {
              colorPrimary:  "#f39c12",
              borderRadius:  8,
              fontFamily:    "var(--font-inter)",
            },
          }}
        >
          <UserProvider>
            <ClientProvider>
              <ContactProvider>
                <OpportunityProvider>
                  <ProposalProvider>
                    <PricingRequestProvider>
                      <ContractProvider>
                        <ActivityProvider>
                          <NoteProvider>
                            {/* Bell lives inside UserProvider so it can read user.roles */}
                            <NotificationBell />
                            {children}
                          </NoteProvider>
                        </ActivityProvider>
                      </ContractProvider>
                    </PricingRequestProvider>
                  </ProposalProvider>
                </OpportunityProvider>
              </ContactProvider>
            </ClientProvider>
          </UserProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
