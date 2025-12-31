import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "keytothe",
  description: "Projects by keytothe",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
