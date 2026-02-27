/**
 * Quick diagnostic: fetch /clients using the axios instance.
 * Run from the browser console by importing, or as a Node script.
 *
 * In the browser console (while logged in):
 *   const { testGetClients } = await import('/src/app/lib/testClients.ts');
 *   testGetClients();
 */

import api, { getToken } from "./utils/axiosInstance";

export async function testGetClients(): Promise<unknown> {
  const token = getToken();
  console.log("🔑 Token in storage:", token ? `${token.slice(0, 20)}...` : "NONE — not logged in!");

  try {
    const res = await api.get("/clients");
    console.log("✅ Status:", res.status);
    console.log("📦 Raw response data:", res.data);
    if (Array.isArray(res.data) && res.data.length > 0) {
      console.log("🗂️ First client fields:");
      console.table(
        Object.fromEntries(
          Object.entries(res.data[0]).map(([k, v]) => [k, { value: v, type: typeof v }])
        )
      );
    }
    return { status: res.status, data: res.data };
  } catch (err: unknown) {
    const e = err as { response?: { status: number; data: unknown }; message: string };
    if (e.response) {
      console.error("❌ HTTP Error:", e.response.status, e.response.data);
      return { status: e.response.status, error: e.response.data };
    } else {
      console.error("❌ Network/other error:", e.message);
      return { error: e.message };
    }
  }
}
