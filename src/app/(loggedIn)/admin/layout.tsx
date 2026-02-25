"use client";

import React from "react";
import { Layout } from "antd";
import { useDashboardStyles } from "../../components/dashboard/dashboard.module";
import Sidebar from "@/app/components/loggedIn/sideBar";
import TopBar  from "@/app/components/dashboard/topBar/topBar";

const { Sider, Header, Content, Footer } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { styles } = useDashboardStyles();

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
            <div className={styles.footerAvatar} />
            <span className={styles.footerLink}>About</span>
            <span className={styles.footerLink}>Support</span>
            <span className={styles.footerLink}>Contact Us</span>
          </Footer>

        </Layout>
      </Layout>
    </div>
  );
}