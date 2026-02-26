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
import { useActivitiesStyles } from "./activities.module";

interface Activity {
  id: string;
  subject: string;
  type: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  avatarInitials: string;
  avatarColor: string;
}

// Placeholder  replace with fetch to GET /api/activities
const DUMMY: Activity[] = [
  { id: "a1", subject: "Follow up with Acme Corp", type: "Call", priority: "High", dueDate: "Today", avatarInitials: "FU", avatarColor: "#5c6bc0" },
  { id: "b2", subject: "Review proposal for Beta LLC", type: "Email", priority: "Medium", dueDate: "Tomorrow", avatarInitials: "RP", avatarColor: "#26a69a" },
  { id: "c3", subject: "Schedule meeting with Gamma", type: "Meeting", priority: "High", dueDate: "Tomorrow", avatarInitials: "SM", avatarColor: "#ef5350" },
  { id: "d4", subject: "Send contract to Delta Corp", type: "Email", priority: "Medium", dueDate: "In 2 days", avatarInitials: "SC", avatarColor: "#f5a623" },
  { id: "e5", subject: "Update client info in CRM", type: "Task", priority: "Low", dueDate: "In 3 days", avatarInitials: "UC", avatarColor: "#78909c" },
  { id: "f6", subject: "Prepare quarterly report", type: "Task", priority: "Medium", dueDate: "In 5 days", avatarInitials: "PQ", avatarColor: "#ab47bc" },
  { id: "g7", subject: "Call to confirm renewal", type: "Call", priority: "High", dueDate: "Today", avatarInitials: "CC", avatarColor: "#29b6f6" },
  { id: "h8", subject: "Review competitor analysis", type: "Review", priority: "Low", dueDate: "In 1 week", avatarInitials: "RC", avatarColor: "#66bb6a" },
  { id: "i9", subject: "Send pricing quote", type: "Email", priority: "High", dueDate: "Today", avatarInitials: "SP", avatarColor: "#ff7043" },
  { id: "j10", subject: "Update opportunity stage", type: "Task", priority: "Medium", dueDate: "Tomorrow", avatarInitials: "UO", avatarColor: "#8d6e63" },
];

const PAGE_SIZE = 5;

// map priority to badge style
const PRIORITY_BADGE: Record<Activity["priority"], string> = {
  High: "badgeRejected",
  Medium: "badgePending",
  Low: "badgeApproved",
};

export default function ActivitiesList() {
  const { styles, cx } = useActivitiesStyles();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = DUMMY.filter(
    (a) =>
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities List</h1>

      {/*  Toolbar  */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchOutlined className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <button className={styles.iconBtn} title="Sort">
          <SwapOutlined rotate={90} />
        </button>
        <button className={styles.iconBtn} title="Filter">
          <FilterOutlined />
        </button>
        <Link href="/activities/create">
          <button className={styles.addBtn} title="Add activity">
            <PlusOutlined />
          </button>
        </Link>
      </div>

      {/*  Table  */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Subject</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((activity) => (
              <tr key={activity.id}>
                <td>
                  <div className={styles.clientCell}>
                    <div
                      className={styles.avatar}
                      style={{ background: activity.avatarColor }}
                    >
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
                  <span
                    className={cx(
                      styles.badge,
                      styles[PRIORITY_BADGE[activity.priority] as keyof typeof styles]
                    )}
                  >
                    {activity.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  Pagination  */}
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
