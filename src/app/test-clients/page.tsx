"use client";
import { useEffect, useState } from "react";
import api from "@/app/lib/utils/axiosInstance";
import type { IClientPage } from "@/app/lib/providers/context";

export default function TestClientsPage() {
  const [result, setResult] = useState<string>("Running…");

  useEffect(() => {
    api.get<IClientPage>("/clients", { params: { pageNumber: 1, pageSize: 10 } })
      .then(({ data }) => setResult(JSON.stringify(data, null, 2)))
      .catch((err) => setResult(`ERROR ${err.response?.status ?? ""}: ${JSON.stringify(err.response?.data ?? err.message)}`));
  }, []);

  return (
    <main style={{ padding: 32, fontFamily: "monospace", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ color: "#f39c12", marginBottom: 16 }}>GET /clients — axios test</h1>
      <pre
        style={{
          background: "#1a1a1a",
          color: "#0f0",
          padding: 20,
          borderRadius: 10,
          overflow: "auto",
          maxHeight: "80vh",
          whiteSpace: "pre-wrap",
          fontSize: 13,
        }}
      >
        {result}
      </pre>
    </main>
  );
}
