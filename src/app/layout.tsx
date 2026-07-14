import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "fiber-dev-kit — Local development tools for CKB Fiber Network",
  description: "Start local Fiber nodes, send typed payments, inspect channels, and diagnose payment failures with Fiber Dev Kit.",
  openGraph: {
    title: "fiber-dev-kit",
    description: "CLI, TypeScript RPC helpers, integration tests, and a local inspector for CKB Fiber Network development.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Nav />{children}</body>
    </html>
  );
}
