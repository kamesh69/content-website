import type { Metadata } from "next";

import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Studio Replica",
    template: "%s | Studio Replica",
  },
  description:
    "A cinematic portfolio experience with editorial storytelling, motion-forward sections, and headless WordPress blog integration.",
  openGraph: {
    title: "Studio Replica",
    description:
      "A cinematic portfolio experience with editorial storytelling, motion-forward sections, and headless WordPress blog integration.",
    url: "/",
    siteName: "Studio Replica",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
