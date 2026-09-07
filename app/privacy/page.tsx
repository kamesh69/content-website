import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPageBySlug, getSiteSettings } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Rati Agrawal's website.",
  alternates: {
    canonical: "/privacy",
  },
};

export default async function PrivacyPage() {
  const [page, settings] = await Promise.all([getPageBySlug("privacy"), getSiteSettings()]);

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
