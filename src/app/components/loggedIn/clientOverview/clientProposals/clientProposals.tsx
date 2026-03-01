"use client";

import Link from "next/link";
import { useCardStyles } from "../card/card.module";
import { useClientProposalsStyles } from "./clientProposals.module";
import type { IProposal } from "../../../../lib/providers/context";
import type { ProposalStatus } from "../../../../lib/utils/apiEnums";

interface ClientProposalsProps {
  proposals:    IProposal[];
  isPending:    boolean;
  isError:      boolean;
  clientId:     string;
  createHref:   string;
}

const STATUS_KEY: Record<ProposalStatus, string> = {
  Draft:     "draft",
  Submitted: "submitted",
  Approved:  "approved",
  Rejected:  "rejected",
};

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function isExpired(iso?: string) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

export default function ClientProposals({
  proposals,
  isPending,
  isError,
  createHref,
}: Readonly<ClientProposalsProps>) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientProposalsStyles();

  return (
    <div className={card.card}>
      {/* Header */}
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Proposal History</h3>
        <Link href={createHref} className={styles.createBtn}>
          + New Proposal
        </Link>
      </div>

      <hr className={card.divider} />

      {/* Loading */}
      {isPending && (
        <div className={styles.skeletonWrap}>
          {[1, 2, 3].map((k) => (
            <div key={k} className={styles.skeletonRow}>
              <div className={styles.skeletonBlock} style={{ width: "40%", height: 13 }} />
              <div className={styles.skeletonBlock} style={{ width: "14%", height: 20, borderRadius: 20 }} />
              <div className={styles.skeletonBlock} style={{ width: "12%", height: 13 }} />
              <div className={styles.skeletonBlock} style={{ width: "14%", height: 13 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isPending && isError && (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>⚠</div>
          <p className={styles.emptyTitle}>Failed to load proposals</p>
          <p className={styles.emptySub}>Check your connection and try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && proposals.length === 0 && (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>📄</div>
          <p className={styles.emptyTitle}>No proposals yet</p>
          <p className={styles.emptySub}>
            There are no proposals for this client. Create one to get started.
          </p>
          <Link href={createHref} className={styles.emptyBtn}>
            Create First Proposal
          </Link>
        </div>
      )}

      {/* Table */}
      {!isPending && !isError && proposals.length > 0 && (
        <table className={card.table}>
          <thead>
            <tr>
              <th className={card.th}>Title</th>
              <th className={card.th}>Status</th>
              <th className={card.th}>Line Items</th>
              <th className={card.th}>Valid Until</th>
              <th className={card.th}>Currency</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((p) => {
              const expired  = isExpired(p.validUntil);
              const status   = p.status ?? "Draft";
              const key      = STATUS_KEY[status];
              const itemCount = p.lineItems?.length ?? 0;

              return (
                <tr key={p.id}>
                  <td className={cx(card.td, card.tdWhite)}>
                    {p.title || "Untitled"}
                  </td>

                  <td className={card.td}>
                    <span className={cx(styles.badge, styles[key as keyof typeof styles])}>
                      {status}
                    </span>
                  </td>

                  <td className={card.td}>
                    {itemCount > 0
                      ? <span className={styles.lineCount}>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                      : <span className={styles.lineCountNone}>None</span>
                    }
                  </td>

                  <td className={card.td}>
                    <span className={expired ? styles.dateExpired : styles.dateValid}>
                      {fmt(p.validUntil)}
                    </span>
                  </td>

                  <td className={card.td}>{p.currency}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
