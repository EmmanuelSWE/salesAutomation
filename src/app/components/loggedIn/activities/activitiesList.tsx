"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SearchOutlined,
  SwapOutlined,
  FilterOutlined,
  PlusOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useActivitiesStyles } from "./activities.module";
import { useActivityState, useActivityAction, useUserState, useUserAction } from "../../../lib/providers/provider";
import type { IActivity, IUser } from "../../../lib/providers/context";

type Tab = "all" | "my";

const TAB_LABEL: Record<Tab, string> = {
  all: "All Activities",
  my:  "My Activities",
};

const PAGE_SIZE = 5;
const AVATAR_COLORS = ["#5c6bc0","#26a69a","#ef5350","#f5a623","#78909c","#ab47bc","#29b6f6","#66bb6a","#ff7043","#8d6e63"];

const PRIORITY_BADGE: Record<string, string> = {
  High:   "badgeRejected",
  Medium: "badgePending",
  Low:    "badgeApproved",
};

const ACTIVITY_TYPES = [["1","Meeting"],["2","Call"],["3","Email"],["4","Task"],["5","Presentation"],["6","Other"]];
const PRIORITY_OPTS  = [["1","Low"],["2","Medium"],["3","High"],["4","Urgent"]];

const getAvatarInitials = (subject: string) => {
  const words = subject.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const typeLabel = (t?: string) => ACTIVITY_TYPES.find(([,l]) => l === t)?.[0] ?? "";
const priLabel  = (p?: string) => p ?? "Medium";

/* ── Inline edit drawer ── */
function EditDrawer({
  activity,
  users,
  onClose,
  onSave,
  onComplete,
  onCancel,
  onDelete,
  saving,
  acting,
}: Readonly<{
  activity: IActivity;
  users?: IUser[];
  onClose: () => void;
  onSave: (patch: Partial<IActivity>) => void;
  onComplete: (outcome: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  saving: boolean;
  acting: boolean;
}>) {
  const [subject,      setSubject]      = useState(activity.subject ?? "");
  const [type,         setType]         = useState(activity.type ?? "");
  const [description,  setDescription]  = useState(activity.description ?? "");
  const [priority,     setPriority]     = useState(String(activity.priority ?? "Medium"));
  const [dueDate,      setDueDate]      = useState(activity.dueDate ? activity.dueDate.slice(0, 10) : "");
  const [assignedToId, setAssignedToId] = useState(activity.assignedToId ?? "");
  const [outcome,      setOutcome]      = useState("");
  const [showComplete, setShowComplete] = useState(false);

  const isClosed = activity.status === "Completed" || activity.status === "Cancelled";

  function handleSave() {
    onSave({
      ...activity,
      subject,
      type: type as IActivity["type"],
      description,
      priority: priority as IActivity["priority"],
      dueDate,
      assignedToId: assignedToId || undefined,
    });
  }

  return (
    <>
      {/* backdrop */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100 }}
      />
      {/* panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400,
        background: "#252525", zIndex: 101, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.4)", overflowY: "auto",
      }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #333" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <EditOutlined style={{ color: "#f5a623", fontSize: 16 }} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Edit Activity</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18 }}>
            <CloseOutlined />
          </button>
        </div>

        {/* fields */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {([ 
            { label: "Subject", node: (
              <input value={subject} onChange={e => setSubject(e.target.value)}
                style={{ width: "100%", background: "#333", border: "1px solid #444", borderRadius: 8,
                  padding: "9px 12px", color: "#fff", fontSize: 13, boxSizing: "border-box" as const }} />
            )},
            { label: "Type", node: (
              <select value={type} onChange={e => setType(e.target.value as IActivity["type"])}
                style={{ width: "100%", background: "#333", border: "1px solid #444", borderRadius: 8,
                  padding: "9px 12px", color: "#fff", fontSize: 13 }}>
                <option value="">Select type…</option>
                {ACTIVITY_TYPES.map(([,l]) => <option key={l} value={l}>{l}</option>)}
              </select>
            )},
            { label: "Priority", node: (
              <select value={priority} onChange={e => setPriority(e.target.value)}
                style={{ width: "100%", background: "#333", border: "1px solid #444", borderRadius: 8,
                  padding: "9px 12px", color: "#fff", fontSize: 13 }}>
                {PRIORITY_OPTS.map(([,l]) => <option key={l} value={l}>{l}</option>)}
              </select>
            )},
            { label: "Due Date", node: (
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                style={{ width: "100%", background: "#333", border: "1px solid #444", borderRadius: 8,
                  padding: "9px 12px", color: "#fff", fontSize: 13 }} />
            )},
            { label: "Assigned To", node: (
              <select value={assignedToId} onChange={e => setAssignedToId(e.target.value)}
                style={{ width: "100%", background: "#333", border: "1px solid #444", borderRadius: 8,
                  padding: "9px 12px", color: "#fff", fontSize: 13 }}>
                <option value="">— Unassigned —</option>
                {(users ?? []).map((u) => (
                  <option key={u.id} value={u.id ?? ""}>
                    {`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()} {u.role ? `(${u.role})` : ""}
                  </option>
                ))}
              </select>
            )},
            { label: "Description", node: (
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                style={{ width: "100%", background: "#333", border: "1px solid #444", borderRadius: 8,
                  padding: "9px 12px", color: "#fff", fontSize: 13, resize: "vertical", boxSizing: "border-box" as const }} />
            )},
          ] as { label: string; node: React.ReactNode }[]).map(({ label, node }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</label>
              {node}
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #333", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Save / Close row */}
          {!isClosed && (
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose}
                style={{ flex: 1, padding: 11, background: "#333", border: "none", borderRadius: 8, color: "#aaa", cursor: "pointer", fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 1, padding: 11, background: "#f5a623", border: "none", borderRadius: 8,
                  color: "#1a1000", fontWeight: 700, cursor: "pointer", fontSize: 13, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          )}

          {/* Complete inline form */}
          {showComplete && !isClosed && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="outcomeInput" style={{ fontSize: 11, color: "#888" }}>Outcome note (required)</label>
              <textarea
                id="outcomeInput"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={2}
                placeholder="Describe the result of this activity…"
                style={{ background: "#333", border: "1px solid #444", borderRadius: 6,
                  padding: "8px 10px", color: "#fff", fontSize: 13, resize: "vertical",
                  width: "100%", boxSizing: "border-box" as const }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => onComplete(outcome)}
                  disabled={acting || !outcome.trim()}
                  style={{ flex: 1, padding: 10, background: "#4caf50", border: "none", borderRadius: 8,
                    color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13, opacity: acting ? 0.6 : 1 }}>
                  {acting ? "Marking…" : "Confirm Complete"}
                </button>
                <button
                  onClick={() => { setShowComplete(false); setOutcome(""); }}
                  style={{ padding: 10, background: "#333", border: "none", borderRadius: 8,
                    color: "#aaa", cursor: "pointer", fontSize: 13 }}>
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Activity actions row (Complete / Cancel / Delete) */}
          {!isClosed && !showComplete && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setShowComplete(true)}
                disabled={acting}
                style={{ flex: 1, padding: 9, background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)",
                  borderRadius: 8, color: "#4caf50", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                ✓ Mark Complete
              </button>
              <button
                onClick={onCancel}
                disabled={acting}
                style={{ flex: 1, padding: 9, background: "rgba(33,150,243,0.1)", border: "1px solid rgba(33,150,243,0.3)",
                  borderRadius: 8, color: "#2196f3", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                ✕ Cancel Activity
              </button>
              <button
                onClick={onDelete}
                disabled={acting}
                style={{ padding: 9, background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.3)",
                  borderRadius: 8, color: "#ef5350", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                Delete
              </button>
            </div>
          )}

          {isClosed && (
            <button onClick={onClose}
              style={{ width: "100%", padding: 11, background: "#333", border: "none", borderRadius: 8,
                color: "#aaa", cursor: "pointer", fontSize: 13 }}>
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function ActivitiesList() {
  const { styles, cx } = useActivitiesStyles();
  const { activities, isPending, isError } = useActivityState();
  const { getActivities, getMyActivities, updateActivity, completeActivity, cancelActivity, deleteActivity } = useActivityAction();
  const { users } = useUserState();
  const { getUsers } = useUserAction();
  const [tab,     setTab]     = useState<Tab>("all");
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);
  const [editing, setEditing] = useState<IActivity | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [acting,  setActing]  = useState(false);

  function fetchForTab(t: Tab) {
    if (t === "my") getMyActivities({ pageNumber: page, pageSize: PAGE_SIZE });
    else            getActivities({ pageNumber: page, pageSize: PAGE_SIZE });
  }

  useEffect(() => {
    fetchForTab(tab);
    if (!users?.length) getUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchForTab(tab);
    setPage(1);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities</h1>
      <div className={styles.listContainer}>
        <div className={styles.toolbar}>
          <div className={styles.skeletonSearch} />
          <div className={styles.skeletonBtn} />
          <div className={styles.skeletonBtn} />
          <div className={styles.skeletonBtn} />
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Subject</th>
                <th>Type</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th style={{ width: 48 }} />
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {["a","b","c","d","e","f","g"].map((k) => (
                <tr key={k}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className={styles.skeletonAvatar} />
                      <div className={styles.skeletonBlock} style={{ width: 140 }} />
                    </div>
                  </td>
                  <td><div className={styles.skeletonBlock} style={{ width: 80 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 90 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 64, borderRadius: 20 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 24, height: 24, borderRadius: 6 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (isError) return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities</h1>
      <p style={{ color: "#ef5350", marginTop: 40, textAlign: "center" }}>Failed to load activities.</p>
    </div>
  );

  const list = (activities ?? []).map((a, index) => ({
    id:             a.id ?? `activity-${index}`,
    raw:            a,
    subject:        a.subject,
    type:           a.type,
    priority:       priLabel(a.priority),
    dueDate:        a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-",
    avatarInitials: getAvatarInitials(a.subject),
    avatarColor:    AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));

  const filtered = list.filter(
    (a) =>
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleSave(patch: Partial<IActivity>) {
    if (!editing?.id) return;
    setSaving(true);
    try {
      await updateActivity(editing.id, { ...editing, ...patch });
      setSaving(false);
      setEditing(null);
      fetchForTab(tab);
    } catch {
      setSaving(false);
    }
  }

  async function handleComplete(outcome: string) {
    if (!editing?.id) return;
    setActing(true);
    await completeActivity(editing.id, outcome);
    setActing(false);
    setEditing(null);
    fetchForTab(tab);
  }

  async function handleCancel() {
    if (!editing?.id) return;
    setActing(true);
    await cancelActivity(editing.id);
    setActing(false);
    setEditing(null);
    fetchForTab(tab);
  }

  async function handleDelete() {
    if (!editing?.id) return;
    setActing(true);
    await deleteActivity(editing.id);
    setActing(false);
    setEditing(null);
    fetchForTab(tab);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities</h1>

      {/* ── Tabs ── */}
      <div className={styles.tabsBar}>
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={cx(styles.tab, tab === t && styles.tabActive)}
            onClick={() => setTab(t)}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.listContainer}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchOutlined className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button className={styles.iconBtn} title="Sort"><SwapOutlined rotate={90} /></button>
        <button className={styles.iconBtn} title="Filter"><FilterOutlined /></button>
        <Link href="/activities/create">
          <button className={styles.addBtn} title="New activity"><PlusOutlined /></button>
        </Link>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Subject</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((activity) => (
              <tr key={activity.id} onClick={() => setEditing(activity.raw)}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.avatar} style={{ background: activity.avatarColor }}>
                      {activity.avatarInitials}
                    </div>
                    <span className={styles.clientName}>{activity.subject}</span>
                  </div>
                </td>
                <td>{activity.type}</td>
                <td>
                  <div className={styles.dateCell}>
                    <CalendarOutlined />
                    {activity.dueDate}
                  </div>
                </td>
                <td>
                  <span className={cx(styles.badge, styles[PRIORITY_BADGE[activity.priority] as keyof typeof styles])}>
                    {activity.priority}
                  </span>
                </td>
                <td onClick={(e) => { e.stopPropagation(); setEditing(activity.raw); }}
                  style={{ color: "#f5a623", cursor: "pointer", textAlign: "center" }}>
                  <EditOutlined />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <button className={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <LeftOutlined />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} className={cx(styles.pageBtn, page === n && styles.pageBtnActive)} onClick={() => setPage(n)}>
            {n}
          </button>
        ))}
        <button className={styles.pageBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <RightOutlined />
        </button>
      </div>
      </div>{/* end listContainer */}

      {/* ── Edit drawer ── */}
      {editing && (
        <EditDrawer
          activity={editing}
          users={users}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onDelete={handleDelete}
          saving={saving}
          acting={acting}
        />
      )}
    </div>
  );
}
