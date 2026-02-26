"use client";

import { InfoCircleOutlined, CheckOutlined } from "@ant-design/icons";
import { useCardStyles } from  "../card/card.module";   
import { useClientOverviewCardStyles } from "./clientOverviewCard.module";

export interface ProposalStep {
  label: string;
  done:  boolean;
}

interface ClientOverviewCardProps {
  clientName:        string;
  steps:             ProposalStep[];
  activeUntil:       string;
  subscriptionNote:  string;
  pricePerMonth:     string;
  onCancelProject?:  () => void;
  onRenewContract?:  () => void;
}

const SEGMENT_COUNT = 8;

export default function ClientOverviewCard({
  clientName,
  steps,
  activeUntil,
  subscriptionNote,
  pricePerMonth,
  onCancelProject,
  onRenewContract,
}: ClientOverviewCardProps) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientOverviewCardStyles();

  const doneCount  = steps.filter((s) => s.done).length;
  const filledSegs = Math.round((doneCount / steps.length) * SEGMENT_COUNT);

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
            renew contract
          </button>
        </div>
      </div>

      <hr className={card.divider} />

      {/* Progress + step list */}
      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>
          <strong>Project steps</strong> {doneCount} of {steps.length} steps completed
        </div>
        <div className={styles.progressTrack}>
          {Array.from({ length: SEGMENT_COUNT }).map((_, i) => (
            <div
              key={i}
              className={styles.progressSeg}
              style={{ background: i < filledSegs ? "#5c6bc0" : "#3a3a3a" }}
            />
          ))}
        </div>
        <div className={styles.progressNote}>
          {steps.length - doneCount} steps remaining until project is complete
        </div>

        <div className={styles.stepsList}>
          {steps.map((step, i) => (
            <div key={i} className={styles.stepItem}>
              <span
                className={cx(
                  styles.stepDot,
                  step.done ? styles.stepDotDone : styles.stepDotPending
                )}
              />
              <span className={cx(styles.stepText, step.done && styles.stepDone)}>
                {step.label}
              </span>
              {step.done && <CheckOutlined className={styles.checkIcon} />}
            </div>
          ))}
        </div>
      </div>

      <hr className={card.divider} />

      {/* Active until */}
      <div className={card.infoBlock}>
        <div className={card.infoTitle}>Active until {activeUntil}</div>
        <div className={card.infoSub}>{subscriptionNote}</div>
      </div>

      <hr className={card.divider} />

      {/* Pricing */}
      <div className={card.infoBlock}>
        <div className={card.infoTitle}>{pricePerMonth} Per Month</div>
        <span className={card.infoLink}>Pricing details</span>
      </div>

      {/* Alert */}
      <div className={styles.alertBox}>
        <InfoCircleOutlined style={{ color: "#888", marginTop: 1 }} />
        <div>
          <div className={styles.alertTitle}>We need your attention!</div>
          <div className={styles.alertSub}>Project time is late</div>
        </div>
      </div>
    </div>
  );
}