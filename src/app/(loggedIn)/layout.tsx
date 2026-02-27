"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "antd";
import { useDashboardStyles } from "../components/dashboard/dashboard.module";
import Sidebar from "@/app/components/loggedIn/sideBar/sideBar";
import TopBar  from "@/app/components/loggedIn/topBar/topBar";
import { useUserState } from "@/app/lib/providers/provider";

const { Sider, Header, Content, Footer } = Layout;

const VALID_ROLES = ["salesrep", "businessdevelopmentmanager", "salesmanager", "admin"];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { styles } = useDashboardStyles();
  const router = useRouter();
  const { isInitialized, token, user } = useUserState();

  useEffect(() => {
    if (!isInitialized) return; // wait for provider to finish its one-time localStorage check
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user?.role && !VALID_ROLES.includes(user.role.toLowerCase())) {
      router.replace("/login");
    }
  }, [isInitialized, token, user?.role, router]);

  // Only block render during the initial auth check — not during subsequent data fetches
  if (!isInitialized) return null;

  return (
    <div className={styles.page}>
      <Layout className={styles.wrapper}>

        {/* ── Left: Sidebar ── */}
        <Sider className={styles.sider} width={220}>
          <Sidebar />
        </Sider>

        {/* ── Right: Header + Content + Footer ── */}
        <Layout className={styles.rightLayout}>

          <Header className={styles.header}>
            <TopBar crumbs={["Dashboards", "Overview"]} />
          </Header>

          <Content className={styles.content}>
            {children}
          </Content>

          <Footer className={styles.footer}>
            <span className={styles.footerLink}>About</span>
            <span className={styles.footerLink}>Support</span>
            <span className={styles.footerLink}>Contact Us</span>
          </Footer>

        </Layout>
      </Layout>
    </div>
  );
}