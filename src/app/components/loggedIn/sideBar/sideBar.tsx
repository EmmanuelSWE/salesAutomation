'use client';

import {
  HomeOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSidebarStyles } from "./sideBar.module";
import Link from "next/link";
import { useUserState } from "../../../lib/providers/index";

const NAV_ITEMS = [
  { icon: <HomeOutlined />, label: "Overview",     href: "/admin/dashboard" },
  { icon: <ShoppingCartOutlined />, label: "Clients",     href: "/clients" },
  { icon: <TeamOutlined />,     label: "Staff",       href: "/staff" },
  { icon: <UserOutlined />,    label: "Account Info", href: "#" },
] as const;

export default function Sidebar() {
  const { styles } = useSidebarStyles();
  const userState = useUserState();
  
  const userName = userState?.user?.firstName || "User";

  return (
    <aside className={styles.sidebar}>
      {/* ── Top: logo + nav ── */}
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>❄️</span>
          <span>snowui</span>
        </Link>

        {NAV_ITEMS.map(({ icon, label, href }) => (
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
        <span>{userName}</span>
      </div>
    </aside>
  );
}