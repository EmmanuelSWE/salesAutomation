"use client";

import { useEffect, useState } from "react";
import {
  SearchOutlined,
  SwapOutlined,
  FilterOutlined,
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useStaffStyles } from "./staff.module";
import { useUserState, useUserAction } from "../../../lib/providers/provider";

const PAGE_SIZE = 5;
const AVATAR_COLORS = ["#5c6bc0","#26a69a","#ef5350","#f5a623","#78909c","#ab47bc","#29b6f6","#66bb6a","#ff7043","#8d6e63"];

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "--";

export default function StaffList() {
  const { styles, cx } = useStaffStyles();
  const { users, isPending, isError } = useUserState();
  const { getUsers } = useUserAction();
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  useEffect(() => {
    getUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) return <p>Loading staff...</p>;
  if (isError)   return <p>Failed to load staff.</p>;

  const list = (users ?? []).map((user, index) => ({
    id:             user.id ?? `user-${index}`,
    name:           `${user.firstName} ${user.lastName}`,
    role:           user.role ?? "Staff",
    avatarInitials: getInitials(user.firstName, user.lastName),
    avatarColor:    AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));

  const filtered = list.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <button className={styles.addBtn} title="Add staff"><PlusOutlined /></button>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((staff) => (
              <tr key={staff.id}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.avatar} style={{ background: staff.avatarColor }}>
                      {staff.avatarInitials}
                    </div>
                    <span className={styles.clientName}>{staff.name}</span>
                  </div>
                </td>
                <td>{staff.role}</td>
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
    </div>
  );
}