import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPageBySlug, getSiteSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Imprint",
  description: "Legal imprint and contact information for Rati Agrawal.",
  alternates: {
    canonical: "/imprint",
  },
};

export default async function ImprintPage() {
  const [page, settings] = await Promise.all([getPageBySlug("imprint"), getSiteSettings()]);

  if (!page) {
    return null;
  }

  return (
    <>
      <SiteHeader site={settings.site} navigation={settings.navigation} />
      <main className="legal-page">
        <div className="legal-page__inner">
          <p className="eyebrow">{settings.site.name}</p>
          <h1>{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </main>
      <SiteFooter
        site={settings.site}
        navigation={settings.navigation}
        socialLinks={settings.socialLinks}
      />
    </>
  );
}
