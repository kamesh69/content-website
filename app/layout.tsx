import type { Metadata } from "next";

import { site } from "@/lib/content/site";
import { getSiteUrl, googleSiteVerification } from "@/lib/seo";

import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: googleSiteVerification,
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: site.ogImage
      ? [
          {
            url: site.ogImage,
            alt: site.title,
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: site.ogImage ? [site.ogImage] : undefined,
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
