"use client";

import { useDashboardStyles } from "../../../components/dashboard/dashboard.module";

import {
  HomeOutlined,
  ShoppingCartOutlined,
  FolderOpenOutlined,
  PictureOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  MessageOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  ReloadOutlined,
  MoreOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

/* ===== Static data (move to placeholderdata.ts if preferred) ===== */
const data = {
  kpis: {
    clients: 7265,
    clientsTrend: 11.01,
    staff: 3671,
    staffTrend: -0.03,
  },
  users: {
    total: 37235128,
    bars: [30, 45, 28, 55, 38, 65, 42, 70, 50, 58, 40, 62, 35, 80, 55, 90, 60, 75, 48, 68, 52, 78, 45, 85, 58, 72, 44, 66, 50, 88, 62, 92, 55, 76, 49, 82, 57, 70, 46, 78],
    oldPct: 52,
    newPct: 18,
    lowPct: 30,
    newProjectBar: 24, // index of the "new projects" highlighted bar
  },
  staffPerformance: {
    labels: ["United States", "Canada", "Mexico", "Other"],
    data: [53.5, 32.8, 9.2, 4.5],
    colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e"],
  },
  proposalOverview: {
    labels: ["Windows", "MacOS", "Other"],
    data: [17, 60, 23],
    colors: ["#9e9e9e", "#00c853", "#2979ff"],
    center: "17%",
    centerLabel: "Windows",
  },
  turnaround: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    snowui:    [18, 28, 35, 55, 48, 60],
    dashboard: [10, 22, 30, 40, 45, 55],
  },
  income: {
    labels: ["Jan", "", "", "", "", "", "", "Feb", "", "", "", "", "", "", "Mar", "", "", "", "", "", "", "Apr", "", "", "", "", "", "", "May", "", "", "", "", "", "", "Jun"],
    data:   [40, 55, 35, 60, 45, 70, 50, 40, 65, 42, 55, 38, 62, 48, 45, 70, 52, 42, 60, 50, 38, 243, 55, 42, 65, 48, 58, 45, 42, 68, 52, 60, 45, 70, 55, 42],
    highlightIndex: 21,
  },
};

export default function DashboardPage() {
  const { styles, cx } = useDashboardStyles();

  /* ===== Chart datasets ===== */

  // Users bar — gray base, blue highlight for new projects band
  const usersBarData = {
    labels: data.users.bars.map((_, i) => `${i}`),
    datasets: [
      {
        label: "Users",
        data: data.users.bars,
        backgroundColor: data.users.bars.map((_, i) =>
          i >= 20 && i <= 27 ? "#4d9fff" : "#3a3a3a"
        ),
        borderRadius: 2,
        barPercentage: 0.6,
      },
    ],
  };

  const staffDoughnutData = {
    labels: data.staffPerformance.labels,
    datasets: [
      {
        data: data.staffPerformance.data,
        backgroundColor: data.staffPerformance.colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const proposalGaugeData = {
    labels: data.proposalOverview.labels,
    datasets: [
      {
        data: data.proposalOverview.data,
        backgroundColor: data.proposalOverview.colors,
        borderWidth: 0,
      },
    ],
  };

  const turnaroundData = {
    labels: data.turnaround.labels,
    datasets: [
      {
        label: "SnowUI",
        data: data.turnaround.snowui,
        borderColor: "#ef5350",
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
      },
      {
        label: "Dashboard",
        data: data.turnaround.dashboard,
        borderColor: "#aaa",
        borderDash: [4, 4],
        backgroundColor: "transparent",
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  };

  const incomeBarData = {
    labels: data.income.labels,
    datasets: [
      {
        label: "Income",
        data: data.income.data,
        backgroundColor: data.income.data.map((_, i) =>
          i === data.income.highlightIndex ? "#7c85ff" : "#3f3f6e"
        ),
        borderRadius: 2,
        barPercentage: 0.55,
      },
    ],
  };

  const hiddenAxes = { x: { display: false }, y: { display: false } };

  const turnaroundScales = {
    x: {
      grid: { color: "#333", drawBorder: false },
      ticks: { color: "#666", font: { size: 11 } },
    },
    y: {
      display: false,
    },
  };

  const incomeScales = {
    x: {
      grid: { display: false },
      ticks: {
        color: "#666",
        font: { size: 11 },
        maxTicksLimit: 8,
      },
    },
    y: { display: false },
  };

  return (
    <div className={styles.page}>
      <main className={styles.wrapper}>

        {/* ====== SIDEBAR ====== */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            {/* Logo */}
            <div className={styles.sidebarLogo}>
              <span className={styles.sidebarLogoIcon}>❄️</span>
              <span>snowui</span>
            </div>

            {/* Nav items */}
            <a className={cx(styles.navItem, styles.navItemActive)}>
              <span className={styles.navIcon}><HomeOutlined /></span>
              Overview
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><ShoppingCartOutlined /></span>
              eCommerce
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><FolderOpenOutlined /></span>
              Projects
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><PictureOutlined /></span>
              User Profile
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><AppstoreOutlined /></span>
              Account
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><TeamOutlined /></span>
              Corporate
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><FileTextOutlined /></span>
              Blog
            </a>
            <a className={styles.navItem}>
              <span className={styles.navIcon}><MessageOutlined /></span>
              Social
            </a>
          </div>

          {/* Footer */}
          <div className={styles.sidebarFooter}>
            <div className={styles.avatar}>👤</div>
            <span>ByeWind</span>
          </div>
        </aside>

        {/* ====== CONTENT ====== */}
        <div className={styles.content}>

          {/* TOP BAR */}
          <header className={styles.topbar}>
            <div className={styles.breadcrumb}>
              <span>Dashboards</span>
              <span>/</span>
              <span className="active">Overview</span>
            </div>
            <div className={styles.topRight}>
              <div className={styles.searchBox}>
                <SearchOutlined style={{ fontSize: 13 }} />
                <span>Search</span>
              </div>
              <div className={styles.iconBtn}><SettingOutlined /></div>
              <div className={styles.iconBtn}><ReloadOutlined /></div>
              <div className={styles.iconBtn}><BellOutlined /></div>
            </div>
          </header>

          {/* KPI CARDS */}
          <section className={styles.row2} aria-label="KPIs">
            {/* Clients */}
            <div className={styles.kpiCard}>
              <span className={styles.kpiIcon}><RiseOutlined /></span>
              <div className={styles.kpiLabel}>Clients</div>
              <div className={styles.kpiValue}>{data.kpis.clients.toLocaleString()}</div>
              <div className={cx(styles.kpiTrend, styles.kpiTrendUp)}>
                +{data.kpis.clientsTrend.toFixed(2)}%
              </div>
            </div>

            {/* Staff */}
            <div className={cx(styles.kpiCard, styles.kpiGradient)}>
              <span className={styles.kpiIcon}><FallOutlined /></span>
              <div className={styles.kpiLabel}>Staff</div>
              <div className={styles.kpiValue}>{data.kpis.staff.toLocaleString()}</div>
              <div className={cx(styles.kpiTrend, styles.kpiTrendDown)}>
                {data.kpis.staffTrend.toFixed(2)}%
              </div>
            </div>
          </section>

          {/* NUMBER OF USERS */}
          <section className={styles.usersCard} aria-label="Number of users">
            <div className={styles.usersHeader}>
              <div className={styles.usersTabs}>
                <span>Projects</span>
                <span className="active">Project overview</span>
              </div>
              <div className={styles.usersControls}>
                <div className={styles.dropdown}>Week ▾</div>
                <div className={styles.dropdown}>% ▾</div>
                <div className={styles.iconBtn} style={{ width: 28, height: 28 }}><MoreOutlined /></div>
              </div>
            </div>

            <div className={styles.usersTotalRow}>
              <span className={styles.usersLabel}>Number of users</span>
              <span className={styles.usersTotal}>{data.users.total.toLocaleString()}</span>
            </div>

            <div className={styles.chips}>
              <div className={styles.chip}>
                <span className={styles.chipLabel}>Old projects</span>
                <span className={styles.chipValue}>{data.users.oldPct}%</span>
              </div>
              <div className={styles.chip}>
                <span className={styles.chipLabel}>New projects</span>
                <span className={styles.chipValueBlue}>{data.users.newPct}%</span>
              </div>
              <div className={styles.chip}>
                <span className={styles.chipLabel}>Low activity projects</span>
                <span className={styles.chipValue}>{data.users.lowPct}%</span>
              </div>
            </div>

            <div className={styles.chartSm}>
              <Bar
                data={usersBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: false } },
                  scales: hiddenAxes,
                }}
              />
            </div>
          </section>

          {/* STAFF PERFORMANCE + PROPOSAL OVERVIEW */}
          <section className={styles.row2} aria-label="Staff and Proposal">
            {/* Staff Performance */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Staff performance</div>
              <div className={styles.staffBody}>
                <div className={styles.staffChartWrap}>
                  <Doughnut
                    data={staffDoughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "62%",
                      plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    }}
                  />
                </div>
                <div className={styles.staffLegend}>
                  {data.staffPerformance.labels.map((label, i) => (
                    <div key={label} className={styles.legendRow}>
                      <span
                        className={styles.legendDot}
                        style={{ background: data.staffPerformance.colors[i] }}
                      />
                      <span className={styles.legendName}>{label}</span>
                      <span className={styles.legendVal}>{data.staffPerformance.data[i]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Proposal Overview */}
            <div className={styles.card}>
              <div className={styles.cardTitleBlue}>Proposal overview</div>
              <div className={styles.proposalBody}>
                <div className={styles.proposalChartWrap}>
                  <Doughnut
                    data={proposalGaugeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      circumference: 180,
                      rotation: -90,
                      cutout: "68%",
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: {
                            color: "#aaa",
                            font: { size: 11 },
                            boxWidth: 10,
                            padding: 14,
                          },
                        },
                        tooltip: { enabled: true },
                      },
                    }}
                  />
                </div>
                {/* Center label overlaid via absolute positioning trick */}
                <div style={{
                  marginTop: -60,
                  textAlign: "center",
                  pointerEvents: "none",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>
                    {data.proposalOverview.center}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    {data.proposalOverview.centerLabel}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* TURN AROUND RATE */}
          <section className={styles.card} aria-label="Turn around rate">
            <div className={styles.turnaroundHeader}>
              <div className={styles.cardTitle} style={{ color: "#ef5350" }}>Turn around rate</div>
              <div className={styles.turnaroundLegend}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className={styles.legendLine} style={{ background: "#ef5350" }} />
                  SnowUI
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className={styles.legendLine} style={{ background: "#aaa" }} />
                  Dashboard
                </span>
                <div className={styles.iconBtn} style={{ width: 26, height: 26, fontSize: 13 }}>
                  <MoreOutlined />
                </div>
              </div>
            </div>
            <div className={styles.chartLg}>
              <Line
                data={turnaroundData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                  scales: turnaroundScales,
                }}
              />
            </div>
          </section>

          {/* INCOME */}
          <section className={styles.card} aria-label="Income">
            <div className={styles.incomeHeader}>
              <div className={styles.cardTitleBlue} style={{ color: "#7c85ff" }}>Income</div>
              <div className={styles.iconBtn} style={{ width: 26, height: 26, fontSize: 13 }}>
                <MoreOutlined />
              </div>
            </div>
            <div className={styles.chartLg}>
              <Bar
                data={incomeBarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => ` ${ctx.raw}K`,
                      },
                    },
                  },
                  scales: incomeScales,
                }}
              />
            </div>
          </section>

          {/* BOTTOM FOOTER */}
          <footer className={styles.bottomPanel}>
            <div className={styles.bottomAvatar} />
            <span className={styles.bottomLink}>About</span>
            <span className={styles.bottomLink}>Support</span>
            <span className={styles.bottomLink}>Contact Us</span>
          </footer>

        </div>
      </main>
    </div>
  );
}