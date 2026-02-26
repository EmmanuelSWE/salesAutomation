"use client";

import { useState } from "react";
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
  opportunities:  OpportunityRow[];
  defaultPeriod?: Period;
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
}: ClientOpportunitiesProps) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientOpportunitiesStyles();
  const [period, setPeriod]  = useState<Period>(defaultPeriod);

  return (
    <div className={card.card}>
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Opportunities</h3>
        <div className={card.periodTabs}>
          {(["Month", "Year", "All Time"] as Period[]).map((p) => (
            <span
              key={p}
              className={cx(card.periodTab, period === p && card.periodTabActive)}
              onClick={() => setPeriod(p)}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <hr className={card.divider} />

      <table className={card.table}>
        <thead>
          <tr>
            <th className={card.th}>Title</th>
            <th className={card.th}>Stage</th>
            <th className={card.th}>Value</th>
            <th className={card.th}>Close Date</th>
          </tr>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}