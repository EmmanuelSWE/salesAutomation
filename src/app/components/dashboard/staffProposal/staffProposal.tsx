"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { DashboardStaffPerformance, DashboardProposalOverview } from '../../../lib/placeholderdata'
import { useStaffProposalStyles } from "./staffProposal.module";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StaffProposalProps {
  staff: DashboardStaffPerformance;
  proposal: DashboardProposalOverview;
}

export default function StaffProposal({ staff, proposal }: StaffProposalProps) {
  const { styles } = useStaffProposalStyles();

  const staffChartData = {
    labels: staff.labels,
    datasets: [
      {
        data: staff.data,
        backgroundColor: staff.colors,
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const proposalChartData = {
    labels: proposal.labels,
    datasets: [
      {
        data: proposal.data,
        backgroundColor: proposal.colors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <section
      className={styles.grid}
      aria-label="Staff performance and proposal overview"
    >
      {/* ── Staff Performance ── */}
      <div className={styles.card}>
        <div className={styles.titleOrange}>Staff performance</div>
        <div className={styles.staffBody}>
          <div className={styles.staffChartWrap}>
            <Doughnut
              data={staffChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "62%",
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                },
              }}
            />
          </div>

          <div className={styles.staffLegend}>
            {staff.labels.map((label, i) => (
              <div key={label} className={styles.legendRow}>
                <span
                  className={styles.legendDot}
                  style={{ background: staff.colors[i] }}
                />
                <span className={styles.legendName}>{label}</span>
                <span className={styles.legendVal}>{staff.data[i]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Proposal Overview ── */}
      <div className={styles.card}>
        <div className={styles.titleBlue}>Proposal overview</div>
        <div className={styles.proposalBody}>
          <div className={styles.proposalChartWrap}>
            <Doughnut
              data={proposalChartData}
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
          {/* Overlaid centre label */}
          <div className={styles.proposalCenter}>
            <div className={styles.proposalCenterValue}>{proposal.center}</div>
            <div className={styles.proposalCenterLabel}>{proposal.centerLabel}</div>
          </div>
        </div>
      </div>
    </section>
  );
}