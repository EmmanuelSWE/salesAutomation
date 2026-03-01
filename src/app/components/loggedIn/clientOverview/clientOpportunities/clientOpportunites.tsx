"use client";

import { useState } from "react";
import Link from "next/link";
import { useCardStyles } from "../card/card.module";
import { useClientOpportunitiesStyles } from "./clientOpportunites.module";

export interface OpportunityRow {
  id:        string;
  title:     string;
  stage:     "Prospecting" | "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  value:     string;
  closeDate: string;
}

type Period = "Month" | "Year" | "All Time";

interface ClientOpportunitiesProps {
  opportunities:    OpportunityRow[];
  defaultPeriod?:   Period;
  createHref:       string;
  createProposalHref: (opportunityId: string) => string;
}

const STAGE_KEY: Record<OpportunityRow["stage"], string> = {
  "Prospecting":  "prospecting",
  "Qualification":"qualification",
  "Proposal":     "proposal",
  "Negotiation":  "negotiation",
  "Closed Won":   "closedWon",
  "Closed Lost":  "closedLost",
};

export default function ClientOpportunities({
  opportunities,
  defaultPeriod = "Month",
  createHref,
  createProposalHref,
}: Readonly<ClientOpportunitiesProps>) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientOpportunitiesStyles();
  const [period, setPeriod]  = useState<Period>(defaultPeriod);

  return (
    <div className={card.card}>
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Opportunities</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          href={createHref}
          style={{ fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 7,
            background: "#f5a623", color: "#1a1000", textDecoration: "none", whiteSpace: "nowrap" }}
        >
          + New Opportunity
        </Link>
        <div className={card.periodTabs}>
          {(["Month", "Year", "All Time"] as Period[]).map((p) => (
            <button
              key={p}
              type="button"
              className={cx(card.periodTab, period === p && card.periodTabActive)}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
        </div>
      </div>

      <hr className={card.divider} />

      <table className={card.table}>
        <thead>
          <tr>
            <th className={card.th}>Title</th>
            <th className={card.th}>Stage</th>
            <th className={card.th}>Value</th>
            <th className={card.th}>Close Date</th>              <th className={card.th} />          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td className={cx(card.td, card.tdWhite)}>{opp.title}</td>
              <td className={card.td}>
                <span
                  className={cx(
                    styles.badge,
                    styles[STAGE_KEY[opp.stage] as keyof typeof styles]
                  )}
                >
                  {opp.stage}
                </span>
              </td>
              <td className={cx(card.td, card.tdWhite)}>{opp.value}</td>
              <td className={card.td}>{opp.closeDate}</td>
              <td className={card.td}>
                <Link
                  href={createProposalHref(opp.id)}
                  style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
                    background: "rgba(76,175,80,0.15)", color: "#4caf50", textDecoration: "none",
                    whiteSpace: "nowrap" }}
                >
                  + Proposal
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}