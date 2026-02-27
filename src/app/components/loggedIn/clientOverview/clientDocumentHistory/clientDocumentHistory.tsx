"use client";

import { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { useCardStyles } from "../card/card.module";    
import { useClientDocumentHistoryStyles } from "./clientDocumentHistory.module";

export interface InvoiceRow {
  id:          string;
  date:        string;
  description: string;
  amount:      string;
  pdfUrl?:     string;
}

type Period = "Month" | "Year" | "All Time";

interface ClientDocumentHistoryProps {
  invoices:       InvoiceRow[];
  defaultPeriod?: Period;
}

export default function ClientDocumentHistory({
  invoices,
  defaultPeriod = "Month",
}: Readonly<ClientDocumentHistoryProps>) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientDocumentHistoryStyles();
  const [period, setPeriod]  = useState<Period>(defaultPeriod);

  return (
    <div className={card.card}>
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Document History</h3>
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

      <hr className={card.divider} />

      <table className={card.table}>
        <thead>
          <tr>
            <th className={card.th}>Date</th>
            <th className={card.th}>Description</th>
            <th className={card.th}>Amount</th>
            <th className={card.th}>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((row) => (
            <tr key={row.id}>
              <td className={card.td}>{row.date}</td>
              <td className={cx(card.td, card.tdWhite)}>{row.description}</td>
              <td className={cx(card.td, card.tdWhite)}>{row.amount}</td>
              <td className={card.td}>
                <button
                  className={styles.pdfBtn}
                  onClick={() => row.pdfUrl && window.open(row.pdfUrl, "_blank")}
                >
                  <DownloadOutlined /> PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}