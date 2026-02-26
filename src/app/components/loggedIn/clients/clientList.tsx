"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Table, Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useClientsStyles } from "./clients.module";

interface Client {
  id: string;
  name: string;
  industry: string;
  status: string;
}

// placeholder data; replace with fetch to real API later
const DUMMY: Client[] = [
  { id: "abc123", name: "Acme Corp", industry: "Technology", status: "In Progress" },
  { id: "def456", name: "Beta LLC", industry: "Finance", status: "Pending" },
  { id: "ghi789", name: "Gamma Inc", industry: "Healthcare", status: "Approved" },
];

export default function ClientList() {
  const { styles } = useClientsStyles();
  const [data, setData] = useState<Client[]>([]);

  useEffect(() => {
    // TODO: fetch clients from API
    setData(DUMMY);
  }, []);

  const columns: ColumnsType<Client> = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Industry", dataIndex: "industry", key: "industry" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <span className={`${styles.statusTag} ${s}`}>{s}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text, record) => (
        <Link href={`/Client/${record.id}/createOpportunity`}>
          <Button type="primary" size="small">
            New Opportunity
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.tableContainer}>
        <Table<Client> rowKey="id" columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
}
