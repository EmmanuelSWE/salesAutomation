"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useCardStyles } from "../card/card.module";    
import { useClientContactDetailsStyles } from "./clientContactDetails.module";

export interface ContactCard {
  id:      string;
  name:    string;
  value:   string;
  tag?:    "Recent" | "Most Used";
  onEdit?: () => void;
}

interface ClientContactDetailsProps {
  contacts:       ContactCard[];
  onAddContact?:  () => void;
}

export default function ClientContactDetails({
  contacts,
  onAddContact,
}: ClientContactDetailsProps) {
  const { styles: card } = useCardStyles();
  const { styles }       = useClientContactDetailsStyles();

  return (
    <div className={card.card}>
      <h3 className={card.cardTitle}>Client details</h3>

      <div className={styles.contactsRow}>
        {contacts.map((c) => (
          <div key={c.id} className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <div className={styles.contactNameRow}>
                <span className={styles.contactName}>{c.name}</span>
                {c.tag === "Recent"    && <span className={styles.tagRecent}>Recent</span>}
                {c.tag === "Most Used" && <span className={styles.tagMostUsed}>Most Used</span>}
              </div>
              <button className={styles.editBtn} onClick={c.onEdit}>Edit</button>
            </div>
            <div className={styles.contactValue}>{c.value}</div>
          </div>
        ))}
      </div>

      <button className={styles.addContactBtn} onClick={onAddContact}>
        <PlusOutlined /> Add contact
      </button>
    </div>
  );
}