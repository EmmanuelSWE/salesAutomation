/**
 * Sidebar — intentionally a Server Component (no "use client").
 * Static nav: no state, no events, zero JS bundle cost.
 * The CSS module uses createStyles which is client-safe to import from RSC.
 */

import {
  HomeOutlined,
  ShoppingCartOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useSidebarStyles } from "./sideBar.module";

const NAV_ITEMS = [
  { icon: <HomeOutlined />,         label: "Overview",     active: true  },
  { icon: <ShoppingCartOutlined />, label: "eCommerce",    active: false },
  { icon: <FolderOpenOutlined />,   label: "Projects",     active: false },
  { icon: <PictureOutlined />,      label: "User Profile", active: false },
  { icon: <AppstoreOutlined />,     label: "Account",      active: false },
  { icon: <TeamOutlined />,         label: "Corporate",    active: false },
  { icon: <FileTextOutlined />,     label: "Blog",         active: false },
  { icon: <MessageOutlined />,      label: "Social",       active: false },
] as const;

export default function Sidebar() {
  const { styles, cx } = useSidebarStyles();

  return (
    <aside className={styles.sidebar}>
      {/* ── Top: logo + nav ── */}
      <div className={styles.sidebarTop}>
        <a href="/" className={styles.logo}>
          <span className={styles.logoIcon}>❄️</span>
          <span>snowui</span>
        </a>

        {NAV_ITEMS.map(({ icon, label, active }) => (
          <a
            key={label}
            href="#"
            className={cx(styles.navItem, active && styles.navItemActive)}
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </a>
        ))}
      </div>

      {/* ── Bottom: user ── */}
      <div className={styles.footer}>
        <div className={styles.avatar}>👤</div>
        <span>ByeWind</span>
      </div>
    </aside>
  );
}