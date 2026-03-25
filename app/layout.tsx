import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easter Bunny Corp. — Official Registry",
  description:
    "Official visitor registration and administrative portal for Easter Bunny Corporation. Established 4 B.C.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
