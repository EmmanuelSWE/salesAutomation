"use client";

import { useState, useRef } from "react";
import { useSubmitProposalStyles } from "../submitProposal/submitProposal.module";

interface ScopeItem { id: number; value: string; }

export function ScopeItems() {
  const { styles } = useSubmitProposalStyles();
  const [items, setItems] = useState<ScopeItem[]>([{ id: 1, value: "" }]);
  const nextId = useRef(2);

  function add() {
    setItems((prev) => [...prev, { id: nextId.current++, value: "" }]);
  }

  function update(id: number, value: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, value } : i)));
  }

  return (
    <>
      {items.map((item, index) => (
        <div key={item.id} className={styles.field}>
          <div className={styles.scopeItemLabel}>
            Item {index + 1}{item.value.trim() ? " (Added)" : ""}
          </div>
          <div className={styles.scopeItem}>
            <span className={styles.scopeDot} />
            <input
              className={styles.scopeInput}
              /* name is indexed so FormData collects all values */
              name={`scopeItem_${index}`}
              value={item.value}
              onChange={(e) => update(item.id, e.target.value)}
              placeholder="Describe scope item…"
            />
          </div>
        </div>
      ))}

      <button type="button" className={styles.addItemBtn} onClick={add}>
        + Add item
      </button>
    </>
  );
}