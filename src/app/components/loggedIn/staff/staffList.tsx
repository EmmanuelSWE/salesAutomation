"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SearchOutlined,
  SwapOutlined,
  FilterOutlined,
  PlusOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useStaffStyles } from "./staff.module";

interface Staff {
  id: string;
  name: string;
  role: string;
  busy: boolean;
  avatarInitials: string;
  avatarColor: string;
}

// Placeholder — replace with fetch to GET /api/staff
const DUMMY: Staff[] = [
  { id: "a1", name: "Alice Johnson",   role: "Sales Manager", busy: false, avatarInitials: "AJ", avatarColor: "#5c6bc0" },
  { id: "b2", name: "Brian Lee",       role: "Sales Rep",     busy: true,  avatarInitials: "BL", avatarColor: "#26a69a" },
  { id: "c3", name: "Catherine Wu",    role: "Analyst",       busy: false, avatarInitials: "CW", avatarColor: "#ef5350" },
  { id: "d4", name: "Daniel Rossi",    role: "Support",       busy: true,  avatarInitials: "DR", avatarColor: "#f5a623" },
  { id: "e5", name: "Elena García",    role: "Engineer",      busy: false, avatarInitials: "EG", avatarColor: "#78909c" },
  { id: "f6", name: "Frank Müller",    role: "Designer",      busy: false, avatarInitials: "FM", avatarColor: "#ab47bc" },
  { id: "g7", name: "Grace Kim",       role: "QA",            busy: true,  avatarInitials: "GK", avatarColor: "#29b6f6" },
  { id: "h8", name: "Hiro Tanaka",     role: "DevOps",        busy: false, avatarInitials: "HT", avatarColor: "#66bb6a" },
  { id: "i9", name: "Isabel Smith",    role: "HR",            busy: true,  avatarInitials: "IS", avatarColor: "#ff7043" },
  { id: "j10",name: "Jamal Ibrahim",   role: "Marketing",     busy: false, avatarInitials: "JI", avatarColor: "#8d6e63" },
];

const PAGE_SIZE = 5;

// map busy flag to a badge style
const STATUS_BADGE: Record<"busy" | "available", string> = {
  busy: "badgeRejected",
  available: "badgeApproved",
};

export default function StaffList() {
  const { styles, cx } = useStaffStyles();
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const filtered = DUMMY.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Staff List</h1>

      {/* ── Toolbar ── */}
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
        <Link href="/admin/staff/create">
          <button className={styles.addBtn} title="Add staff"><PlusOutlined /></button>
        </Link>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((staff) => (
              <tr key={staff.id}>
                <td>
                  <div className={styles.clientCell}>
                    <div
                      className={styles.avatar}
                      style={{ background: staff.avatarColor }}
                    >
                      {staff.avatarInitials}
                    </div>
                    <span className={styles.clientName}>{staff.name}</span>
                  </div>
                </td>
                <td>{staff.role}</td>
                <td>
                  <span
                    className={cx(
                      styles.badge,
                      styles[
                        STATUS_BADGE[staff.busy ? "busy" : "available"] as keyof typeof styles
                      ]
                    )}
                  >
                    {staff.busy ? "Busy" : "Available"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <LeftOutlined />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={cx(styles.pageBtn, page === i + 1 && styles.pageBtnActive)}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
}