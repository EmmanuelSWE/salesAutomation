"use client";

import { useEffect, useState } from "react";
import {
  SearchOutlined,
  SwapOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
  DownOutlined,
  RightOutlined as ChevronRight,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useStaffStyles } from "./staff.module";
import { useUserState, useUserAction, useActivityState, useActivityAction } from "../../../lib/providers/provider";
import type { IActivity } from "../../../lib/providers/context";

const PAGE_SIZE = 5;
const AVATAR_COLORS = ["#5c6bc0","#26a69a","#ef5350","#f5a623","#78909c","#ab47bc","#29b6f6","#66bb6a","#ff7043","#8d6e63"];

const PRIORITY_BADGE_COLOR: Record<string, string> = {
  High: "#ef5350", Medium: "#f5a623", Low: "#4caf50", Urgent: "#ab47bc",
};

const ACTIVITY_TYPES = [["1","Meeting"],["2","Call"],["3","Email"],["4","Task"],["5","Presentation"],["6","Other"]];
const PRIORITY_OPTS  = [["1","Low"],["2","Medium"],["3","High"],["4","Urgent"]];

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "--";

/* ── Inline activity edit drawer ── */
function ActivityEditDrawer({
  activity,
  onClose,
  onSave,
  saving,
}: Readonly<{
  activity: IActivity;
  onClose: () => void;
  onSave: (patch: Partial<IActivity>) => void;
  saving: boolean;
}>) {
  const [subject,     setSubject]     = useState(activity.subject ?? "");
  const [type,        setType]        = useState(activity.type ?? "");
  const [description, setDescription] = useState(activity.description ?? "");
  const [priority,    setPriority]    = useState(String(activity.priority ?? "Medium"));
  const [dueDate,     setDueDate]     = useState(activity.dueDate ? activity.dueDate.slice(0, 10) : "");

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, cursor: "pointer", border: "none", padding: 0 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400,
        background: "#252525", zIndex: 201, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.4)", overflowY: "auto",
      }}>
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

        <div style={{ padding: "16px 24px", borderTop: "1px solid #333", display: "flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: 11, background: "#333", border: "none", borderRadius: 8, color: "#aaa", cursor: "pointer", fontSize: 13 }}>
            Cancel
          </button>
          <button onClick={() => onSave({ subject, type, description, priority: priority as IActivity["priority"], dueDate })}
            disabled={saving}
            style={{ flex: 1, padding: 11, background: "#f5a623", border: "none", borderRadius: 8,
              color: "#1a1000", fontWeight: 700, cursor: "pointer", fontSize: 13, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ── Expanded row: shows a staff member's activities ── */
function StaffActivities({ userId }: Readonly<{ userId: string }>) {
  const { activities, isPending } = useActivityState();
  const { getActivities, updateActivity } = useActivityAction();
  const [editing, setEditing] = useState<IActivity | null>(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    getActivities({ assignedToId: userId });
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* close drawer after save */
  useEffect(() => {
    if (!isPending && saving) { setSaving(false); setEditing(null); getActivities({ assignedToId: userId }); }
  }, [isPending]); // eslint-disable-line react-hooks/exhaustive-deps

  const myActivities = (activities ?? []).filter(a => a.assignedToId === userId || !a.assignedToId);

  if (isPending) return <td colSpan={3} style={{ padding: "12px 24px", color: "#555", fontSize: 13 }}>Loading…</td>;
  if (!myActivities.length) return <td colSpan={3} style={{ padding: "12px 24px", color: "#555", fontSize: 13, fontStyle: "italic" }}>No activities assigned</td>;

  return (
    <>
      {myActivities.map((a) => (
        <td key={a.id ?? a.subject} colSpan={3}
          style={{ padding: "0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 24px 10px 48px", borderBottom: "1px solid #2a2a2a", background: "#1e1e1e" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ color: "#fff", fontWeight: 500, fontSize: 13 }}>{a.subject}</span>
              <span style={{ color: "#666", fontSize: 11 }}>{a.type} · {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                background: `${PRIORITY_BADGE_COLOR[a.priority ?? "Medium"]}22`,
                color: PRIORITY_BADGE_COLOR[a.priority ?? "Medium"] }}>
                {a.priority ?? "Medium"}
              </span>
              <button onClick={() => setEditing(a)}
                style={{ background: "none", border: "none", color: "#f5a623", cursor: "pointer", fontSize: 14, padding: "2px 6px" }}>
                <EditOutlined />
              </button>
            </div>
          </div>
        </td>
      ))}
      {editing && (
        <ActivityEditDrawer
          activity={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => { if (editing.id) { setSaving(true); await updateActivity(editing.id, patch); } }}
          saving={saving}
        />
      )}
    </>
  );
}

export default function StaffList() {
  const { styles, cx } = useStaffStyles();
  const { users, isPending, isError } = useUserState();
  const { getUsers }   = useUserAction();
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getUsers({ isActive: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) return <p>Loading staff...</p>;
  if (isError)   return <p>Failed to load staff.</p>;

  const list = (users ?? []).map((user, index) => ({
    id:             user.id ?? `user-${index}`,
    name:           `${user.firstName} ${user.lastName}`,
    email:          user.email,
    role:           user.role ?? "Staff",
    avatarInitials: getInitials(user.firstName, user.lastName),
    avatarColor:    AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));

  const filtered = list.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Staff</h1>

      {/* ── Toolbar ── */}
      <div className={styles.listContainer}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchOutlined className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by name, role or email"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button className={styles.iconBtn} title="Sort"><SwapOutlined rotate={90} /></button>
        <button className={styles.iconBtn} title="Filter"><FilterOutlined /></button>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th style={{ width: 32 }} />
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((staff) => (
              <>
                <tr key={staff.id}
                  onClick={() => setExpanded(expanded === staff.id ? null : staff.id)}
                  style={{ cursor: "pointer" }}>
                  <td style={{ color: "#555", fontSize: 12, textAlign: "center" }}>
                    {expanded === staff.id ? <DownOutlined /> : <ChevronRight />}
                  </td>
                  <td>
                    <div className={styles.clientCell}>
                      <div className={styles.avatar} style={{ background: staff.avatarColor }}>
                        {staff.avatarInitials}
                      </div>
                      <span className={styles.clientName}>{staff.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                      background: staff.role === "Admin" ? "rgba(245,166,35,0.15)" : "rgba(33,150,243,0.1)",
                      color: staff.role === "Admin" ? "#f5a623" : "#64b5f6" }}>
                      {staff.role}
                    </span>
                  </td>
                  <td style={{ color: "#888", fontSize: 12 }}>{staff.email}</td>
                </tr>

                {/* ── Activities expansion ── */}
                {expanded === staff.id && (
                  <tr key={`${staff.id}-activities`}>
                    <td colSpan={4} style={{ padding: 0, background: "#1e1e1e" }}>
                      <div style={{ borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #333" }}>
                        <div style={{ padding: "8px 24px 6px 48px", fontSize: 11, fontWeight: 600,
                          color: "#555", textTransform: "uppercase", letterSpacing: "0.6px",
                          borderBottom: "1px solid #2a2a2a", background: "#222" }}>
                          Activities
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <tbody>
                            <tr>
                              <StaffActivities userId={staff.id} />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
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
    </div>
  );
}