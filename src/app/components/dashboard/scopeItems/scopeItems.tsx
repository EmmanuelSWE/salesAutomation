"use client";

import { useState, useRef } from "react";
import { useSubmitProposalStyles } from "../../loggedIn/submitProposal/submitProposal.module";

interface LineItem {
  id:                 number;
  productServiceName: string;
  description:        string;
  quantity:           string;
  unitPrice:          string;
  discount:           string;
  taxRate:            string;
}

function emptyItem(id: number): LineItem {
  return { id, productServiceName: "", description: "", quantity: "1", unitPrice: "0", discount: "0", taxRate: "15" };
}

export function ScopeItems() {
  const { styles } = useSubmitProposalStyles();
  const [items, setItems] = useState<LineItem[]>([emptyItem(1)]);
  const nextId = useRef(2);

  function add() {
    setItems((prev) => [...prev, emptyItem(nextId.current++)]);
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function update<K extends keyof LineItem>(id: number, field: K, value: LineItem[K]) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  return (
    <>
      {items.map((item, index) => (
        <div key={item.id} className={styles.lineItemCard}>
          {/* ── header ── */}
          <div className={styles.lineItemHeader}>
            <span className={styles.scopeItemLabel}>Line item {index + 1}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeItemBtn} onClick={() => remove(item.id)}>
                ×
              </button>
            )}
          </div>

          {/* ── row 1: name + description ── */}
          <div className={styles.lineItemRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`scopeItem_${index}_productServiceName`}>Product / Service *</label>
              <input
                id={`scopeItem_${index}_productServiceName`}
                className={styles.scopeInput}
                name={`scopeItem_${index}_productServiceName`}
                value={item.productServiceName}
                onChange={(e) => update(item.id, "productServiceName", e.target.value)}
                placeholder="e.g. Implementation"
              />
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label} htmlFor={`scopeItem_${index}_description`}>Description</label>
              <input
                id={`scopeItem_${index}_description`}
                className={styles.scopeInput}
                name={`scopeItem_${index}_description`}
                value={item.description}
                onChange={(e) => update(item.id, "description", e.target.value)}
                placeholder="e.g. Phase 1 setup"
              />
            </div>
          </div>

          {/* ── row 2: qty | unitPrice | discount | taxRate ── */}
          <div className={styles.lineItemRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`scopeItem_${index}_quantity`}>Qty</label>
              <input
                id={`scopeItem_${index}_quantity`}
                className={styles.scopeInput}
                type="number"
                min="1"
                name={`scopeItem_${index}_quantity`}
                value={item.quantity}
                onChange={(e) => update(item.id, "quantity", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`scopeItem_${index}_unitPrice`}>Unit Price</label>
              <input
                id={`scopeItem_${index}_unitPrice`}
                className={styles.scopeInput}
                type="number"
                min="0"
                step="0.01"
                name={`scopeItem_${index}_unitPrice`}
                value={item.unitPrice}
                onChange={(e) => update(item.id, "unitPrice", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`scopeItem_${index}_discount`}>Discount %</label>
              <input
                id={`scopeItem_${index}_discount`}
                className={styles.scopeInput}
                type="number"
                min="0"
                max="100"
                step="0.1"
                name={`scopeItem_${index}_discount`}
                value={item.discount}
                onChange={(e) => update(item.id, "discount", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`scopeItem_${index}_taxRate`}>Tax Rate %</label>
              <input
                id={`scopeItem_${index}_taxRate`}
                className={styles.scopeInput}
                type="number"
                min="0"
                max="100"
                step="0.1"
                name={`scopeItem_${index}_taxRate`}
                value={item.taxRate}
                onChange={(e) => update(item.id, "taxRate", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button type="button" className={styles.addItemBtn} onClick={add}>
        + Add line item
      </button>
    </>
  );
}