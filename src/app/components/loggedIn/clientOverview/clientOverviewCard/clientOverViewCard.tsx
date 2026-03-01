"use client";

import { WarningOutlined } from "@ant-design/icons";
import { useCardStyles } from  "../card/card.module";
import { useClientOverviewCardStyles } from "./clientOverviewCard.module";

export interface ProposalStep {
  label: string;
  done:  boolean;
}

interface ClientOverviewCardProps {
  clientName:          string;
  steps:               ProposalStep[];
  proposalTitle?:      string;
  proposalIsPending?:  boolean;
  activeUntil:         string;  // e.g. "Dec 9, 2026" or ISO string
  subscriptionNote:    string;
  pricePerMonth:       string;
  onCancelProject?:    () => void;
  onRenewContract?:    () => void;
}

function isOverdue(activeUntil: string): boolean {
  const d = new Date(activeUntil);
  return !Number.isNaN(d.getTime()) && d < new Date();
}

export default function ClientOverviewCard({
  clientName,
  steps,
  proposalTitle,
  proposalIsPending = false,
  activeUntil,
  subscriptionNote,
  pricePerMonth,
  onCancelProject,
  onRenewContract,
}: Readonly<ClientOverviewCardProps>) {
  const { styles: card } = useCardStyles();
  const { styles }       = useClientOverviewCardStyles();

  const doneSteps    = steps.filter((s) => s.done);
  const pendingSteps = steps.filter((s) => !s.done);
  const overdue      = activeUntil ? isOverdue(activeUntil) : false;

  return (
    <div className={card.card}>
      {/* Header */}
      <div className={card.cardHeader}>
        <h2 className={card.cardTitle}>{clientName}</h2>
        <div className={styles.headerBtns}>
          <button className={styles.btnCancel} onClick={onCancelProject}>
            Cancel project
          </button>
          <button className={styles.btnRenew} onClick={onRenewContract}>
            Renew contract
          </button>
        </div>
      </div>

      <hr className={card.divider} />

      {/* Line-item progress */}
      <div className={styles.progressSection}>
        <div className={styles.progressMeta}>
          <div>
            <span className={styles.progressTitle}>Proposal line items</span>
            {proposalTitle && (
              <span className={styles.proposalTitle}>{proposalTitle}</span>
            )}
          </div>
          {steps.length > 0 && (
            <span className={styles.progressCount}>
              <span className={styles.countDone}>{doneSteps.length}</span>
              <span className={styles.countSep}>/</span>
              <span className={styles.countTotal}>{steps.length}</span>
              {" complete"}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {proposalIsPending && (
          <div className={styles.skeletonWrap}>
            {[1, 2, 3].map((k) => (
              <div key={k} className={styles.skeletonChip} style={{ width: `${55 + k * 15}%` }} />
            ))}
          </div>
        )}

        {/* Empty — no open proposals */}
        {!proposalIsPending && steps.length === 0 && (
          <div className={styles.noProposal}>
            No open proposals for this client.
          </div>
        )}

        {/* Completed chips — purple */}
        {!proposalIsPending && doneSteps.length > 0 && (
          <div className={styles.chipsGroup}>
            <span className={styles.chipsGroupLabel}>Completed</span>
            <div className={styles.chipRow}>
              {doneSteps.map((s) => (
                <span key={s.label} className={styles.chipDone}>{s.label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Pending chips — grey */}
        {!proposalIsPending && pendingSteps.length > 0 && (
          <div className={styles.chipsGroup}>
            <span className={styles.chipsGroupLabel}>Remaining</span>
            <div className={styles.chipRow}>
              {pendingSteps.map((s) => (
                <span key={s.label} className={styles.chipPending}>{s.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <hr className={card.divider} />

      {/* Active until */}
      <div className={styles.activeLine}>
        <span className={styles.activeLabel}>Active until</span>
        <span className={overdue ? styles.activeDateOverdue : styles.activeDate}>
          {activeUntil}
        </span>
      </div>
      <div className={card.infoSub}>{subscriptionNote}</div>

      <hr className={card.divider} />

      {/* Proposal total */}
      {pricePerMonth !== "—" && (
        <div className={card.infoBlock}>
          <div className={card.infoTitle}>{pricePerMonth} total</div>
          <span className={card.infoLink}>View line items</span>
        </div>
      )}

      {/* Overdue alert — only shown when past activeUntil */}
      {overdue && (
        <div className={styles.alertBox}>
          <WarningOutlined className={styles.alertIcon} />
          <div>
            <div className={styles.alertTitle}>We need your attention!</div>
            <div className={styles.alertSub}>
              This project is overdue — the active date has passed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}