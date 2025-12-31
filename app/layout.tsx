import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "keytothe",
  description: "Projects by keytothe",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
t