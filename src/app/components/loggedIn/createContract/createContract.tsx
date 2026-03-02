"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "antd";
import { createContract, extractApiMessage, type FormState } from "../../../lib/utils/apiMutations";
import { SubmitButton } from "../form/submitButton";
import { useFormStyles } from "../form/form.module";
import { useUserState, useUserAction } from "../../../lib/providers/provider";
import api from "../../../lib/utils/axiosInstance";

/* ── Constants ──────────────────────────────────────────────── */
const CURRENCIES    = ["ZAR", "USD", "EUR", "GBP"] as const;
const PICKER_SIZE   = 20; // items per page for ID pickers

/** Serialize a date-input value (YYYY-MM-DD) to ISO start-of-day UTC. */
function toIsoDay(d: string): string {
  return d ? `${d}T00:00:00Z` : "";
}

/* ── Generic paged-SELECT hook ──────────────────────────────── */
interface PagedOption { id: string; label: string; }

function usePagedPicker(
  endpoint: string,
  extraParams: Record<string, string>,
  enabled: boolean,
) {
  const [options,  setOptions]  = useState<PagedOption[]>([]);
  const [page,     setPage]     = useState(1);
  const [hasMore,  setHasMore]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  // Stable string key — re-fetch only when param values or enabled flag change
  const paramKey = enabled
    ? Object.entries(extraParams)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("&")
    : "__disabled__";

  useEffect(() => {
    if (!enabled) { setOptions([]); setHasMore(false); return; }
    setLoading(true);
    setPage(1);
    api.get(endpoint, { params: { pageNumber: 1, pageSize: PICKER_SIZE, ...extraParams } })
      .then(({ data }) => {
        const fetched: PagedOption[] = (data.items ?? []).map(
          (item: { id: string; name?: string; title?: string }) => ({
            id:    item.id,
            label: item.name ?? item.title ?? item.id,
          }),
        );
        setOptions(fetched);
        setHasMore(fetched.length === PICKER_SIZE);
      })
      .catch(() => { /* non-fatal */ })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramKey, enabled]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    setLoading(true);
    api.get(endpoint, { params: { pageNumber: next, pageSize: PICKER_SIZE, ...extraParams } })
      .then(({ data }) => {
        const fetched: PagedOption[] = (data.items ?? []).map(
          (item: { id: string; name?: string; title?: string }) => ({
            id:    item.id,
            label: item.name ?? item.title ?? item.id,
          }),
        );
        setOptions(prev => [...prev, ...fetched]);
        setHasMore(fetched.length === PICKER_SIZE);
      })
      .catch(() => { /* non-fatal */ })
      .finally(() => setLoading(false));
  };

  return { options, hasMore, loading, loadMore };
}

/* ── Reusable picker footer ─────────────────────────────────── */
function LoadMoreFooter({ hasMore, onLoadMore }: Readonly<{ hasMore: boolean; onLoadMore: () => void }>) {
  if (!hasMore) return null;
  return (
    <div style={{ padding: "4px 8px" }}>
      <button
        type="button"
        onClick={onLoadMore}
        style={{ fontSize: 12, color: "#f5a623", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        Load more…
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function CreateContract() {
  const { styles }  = useFormStyles();
  const router      = useRouter();
  const searchParams = useSearchParams();

  const [formState,  setFormState]  = useState<FormState>({ status: "idle" });
  const [isPending,  setIsPending]  = useState(false);

  /* ── URL pre-fills ── */
  const urlClientId      = searchParams.get("clientId")      ?? "";
  const urlOpportunityId = searchParams.get("opportunityId") ?? "";
  const urlProposalId    = searchParams.get("proposalId")    ?? "";

  /* ── Controlled ID pickers ── */
  const [clientId,      setClientId]      = useState(urlClientId);
  const [opportunityId, setOpportunityId] = useState(urlOpportunityId);
  const [proposalId,    setProposalId]    = useState(urlProposalId);

  /* ── Contract detail fields ── */
  const [title,               setTitle]               = useState("");
  const [contractValue,       setContractValue]       = useState("");
  const [currency,            setCurrency]            = useState<string>("ZAR");
  const [startDate,           setStartDate]           = useState("");
  const [endDate,             setEndDate]             = useState("");
  const [ownerId,             setOwnerId]             = useState("");
  const [renewalNoticePeriod, setRenewalNoticePeriod] = useState("");
  const [autoRenew,           setAutoRenew]           = useState(false);
  const [terms,               setTerms]               = useState("");

  /* ── Users for owner dropdown ── */
  const { users, isPending: usersPending } = useUserState();
  const { getUsers }                       = useUserAction();
  useEffect(() => { getUsers({ isActive: true }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const activeUsers = users ?? [];

  /* ── Paged pickers (only active when not pre-filled via URL) ── */
  const clientPicker = usePagedPicker(
    "/clients",
    {},
    !urlClientId,
  );

  const opptyPicker = usePagedPicker(
    "/opportunities",
    clientId ? { clientId } : {},
    !urlOpportunityId && !!clientId,
  );

  const proposalPicker = usePagedPicker(
    "/proposals",
    opportunityId ? { opportunityId } : clientId ? { clientId } : {},
    !urlProposalId && (!!opportunityId || !!clientId),
  );

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) {
      setFormState({ status: "error", message: "Client is required." });
      return;
    }
    setIsPending(true);
    try {
      await createContract({
        clientId,
        opportunityId:       opportunityId       || undefined,
        proposalId:          proposalId          || undefined,
        title,
        contractValue:       Number(contractValue) || 0,
        currency,
        startDate:           toIsoDay(startDate),
        endDate:             toIsoDay(endDate),
        ownerId:             ownerId             || undefined,
        renewalNoticePeriod: renewalNoticePeriod ? Number(renewalNoticePeriod) : undefined,
        autoRenew,
        terms:               terms               || undefined,
      });
      setFormState({ status: "success", message: "Contract created." });
      router.back();
    } catch (err) {
      setFormState({ status: "error", message: extractApiMessage(err) });
    } finally {
      setIsPending(false);
    }
  }

  /* ── Render ── */
  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.formTitle}>Create Contract</h1>
        {formState.status === "success" && <div className={styles.successBanner}>{formState.message}</div>}
        {formState.status === "error"   && <div className={styles.errorBanner}>{formState.message}</div>}

        {/* ── References ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>References</h2>

          {/* Client */}
          <div className={styles.field}>
            <label className={styles.label}>Client *</label>
            {urlClientId ? (
              <input
                className={styles.input}
                value={urlClientId}
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            ) : (
              <Select
                style={{ width: "100%" }}
                placeholder="Search and select a client…"
                loading={clientPicker.loading}
                value={clientId || undefined}
                onChange={(v: string) => {
                  setClientId(v);
                  setOpportunityId("");
                  setProposalId("");
                }}
                showSearch
                allowClear
                filterOption={(input, opt) =>
                  (opt?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={clientPicker.options.map((c) => ({ value: c.id, label: c.label }))}
                dropdownRender={(menu) => (
                  <>{menu}<LoadMoreFooter hasMore={clientPicker.hasMore} onLoadMore={clientPicker.loadMore} /></>
                )}
              />
            )}
          </div>

          {/* Opportunity (optional) */}
          <div className={styles.field}>
            <label className={styles.label}>Opportunity (optional)</label>
            {urlOpportunityId ? (
              <input
                className={styles.input}
                value={urlOpportunityId}
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            ) : (
              <Select
                style={{ width: "100%" }}
                placeholder={clientId ? "Search and select an opportunity…" : "Select a client first"}
                loading={opptyPicker.loading}
                disabled={!clientId}
                value={opportunityId || undefined}
                onChange={(v: string) => { setOpportunityId(v); setProposalId(""); }}
                showSearch
                allowClear
                filterOption={(input, opt) =>
                  (opt?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={opptyPicker.options.map((o) => ({ value: o.id, label: o.label }))}
                dropdownRender={(menu) => (
                  <>{menu}<LoadMoreFooter hasMore={opptyPicker.hasMore} onLoadMore={opptyPicker.loadMore} /></>
                )}
              />
            )}
          </div>

          {/* Proposal (optional) */}
          <div className={styles.field}>
            <label className={styles.label}>Proposal (optional)</label>
            {urlProposalId ? (
              <input
                className={styles.input}
                value={urlProposalId}
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            ) : (
              <Select
                style={{ width: "100%" }}
                placeholder={
                  opportunityId || clientId
                    ? "Search and select a proposal…"
                    : "Select a client or opportunity first"
                }
                loading={proposalPicker.loading}
                disabled={!clientId && !opportunityId}
                value={proposalId || undefined}
                onChange={(v: string) => setProposalId(v)}
                showSearch
                allowClear
                filterOption={(input, opt) =>
                  (opt?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={proposalPicker.options.map((p) => ({ value: p.id, label: p.label }))}
                dropdownRender={(menu) => (
                  <>{menu}<LoadMoreFooter hasMore={proposalPicker.hasMore} onLoadMore={proposalPicker.loadMore} /></>
                )}
              />
            )}
          </div>
        </section>

        {/* ── Contract Details ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contract Details</h2>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">Title *</label>
            <input
              id="title"
              required
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Service Agreement FY2026"
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contractValue">Contract Value *</label>
              <input
                id="contractValue"
                type="number"
                min="0"
                required
                className={styles.input}
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                placeholder="100000"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="currency">Currency</label>
              <select
                id="currency"
                className={styles.select}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                required
                className={styles.input}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                required
                className={styles.input}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="ownerId">Contract Owner</label>
              <select
                id="ownerId"
                className={styles.select}
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                disabled={usersPending}
              >
                <option value="">— Unassigned —</option>
                {activeUsers.map((u) => (
                  <option key={u.id} value={u.id ?? ""}>
                    {u.firstName} {u.lastName}{u.role ? ` (${u.role})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="renewalNoticePeriod">Renewal Notice (days)</label>
              <input
                id="renewalNoticePeriod"
                type="number"
                min="0"
                className={styles.input}
                value={renewalNoticePeriod}
                onChange={(e) => setRenewalNoticePeriod(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="terms">Terms</label>
            <textarea
              id="terms"
              className={styles.textarea}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>

          <label className={styles.toggle}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
            />
            {" "}Auto renew
          </label>
        </section>

        <div className={styles.submitRow}>
          <SubmitButton label="Create Contract" pendingLabel="Creating…" isPending={isPending} />
        </div>
      </form>
    </div>
  );
}
