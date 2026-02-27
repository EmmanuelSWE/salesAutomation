'use client';

import {
  HomeOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  FundOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useSidebarStyles } from "./sideBar.module";
import Link from "next/link";
import { useUserState } from "../../../lib/providers/provider";

const BASE_NAV = [
  { icon: <HomeOutlined />,     label: "Overview",         href: "/admin/dashboard" },
  { icon: <TeamOutlined />,     label: "Clients",          href: "/clients" },
  { icon: <CalendarOutlined />, label: "Activities",       href: "/activities" },
  { icon: <FileTextOutlined />, label: "Pricing Requests", href: "/pricingRequests/create" },
  { icon: <UserOutlined />,     label: "Account",          href: "/account" },
] as const;

const OPPORTUNITY_NAV = { icon: <FundOutlined />,         label: "Opportunities", href: "/opportunities" };
const USERS_NAV       = { icon: <UsergroupAddOutlined />, label: "Users",         href: "/staff" };

const ROLE_LABELS: Record<string, string> = {
  salesrep:                    "Sales Rep",
  businessdevelopmentmanager:  "BDM",
  salesmanager:                "Sales Manager",
  admin:                       "Admin",
};

export default function Sidebar() {
  const { styles } = useSidebarStyles();
  const userState = useUserState();

  const firstName = userState?.user?.firstName || "User";
  const role = userState?.user?.role?.toLowerCase() ?? "";
  const roleLabel = ROLE_LABELS[role] ?? userState?.user?.role ?? "";

  const navItems = [
    ...BASE_NAV,
    ...(["businessdevelopmentmanager", "salesmanager", "admin"].includes(role) ? [OPPORTUNITY_NAV] : []),
    ...(role === "admin" ? [USERS_NAV] : []),
  ];

  return (
    <aside className={styles.sidebar}>
      {/* ── Top: logo + nav ── */}
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <span> TransformSales</span>
        </Link>

        {navItems.map(({ icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className={styles.navItem}
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* ── Bottom: user ── */}
      <div className={styles.footer}>
        <div className={styles.avatar}>👤</div>
        <span>
          {firstName}{roleLabel ? ` (${roleLabel})` : ""}
        </span>
      </div>
    </aside>
  );
}