

import type { Metadata } from "next";

import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inject global theme CSS


  return (
    <html lang="en">
      <body style={{backgroundColor : 'black'}}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#f39c12",
              borderRadius: 8,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}