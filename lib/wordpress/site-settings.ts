import { gql } from "graphql-request";

import {
  about,
  behindTheWords,
  editorialStatement,
  editorialNavigation,
  faqIntro,
  hero,
  navigation,
  newsletter,
  processIntro,
  servicesIntro,
  site,
  socialLinks,
  startHere,
  testimonial,
  workIntro,
  writingIntro,
} from "@/lib/content/site";
import type { NavItem, SocialLink } from "@/lib/types";

import { getWordpressClient, parseJsonField } from "./client";

export type SiteSettings = {
  site: typeof site;
  hero: typeof hero;
  editorialStatement: typeof editorialStatement;
  servicesIntro: typeof servicesIntro;
  workIntro: typeof workIntro;
  behindTheWords: typeof behindTheWords;
  writingIntro: typeof writingIntro;
  startHere: typeof startHere;
  about: typeof about;
  processIntro: typeof processIntro;
  testimonial: typeof testimonial;
  faqIntro: typeof faqIntro;
  newsletter: typeof newsletter;
  socialLinks: SocialLink[];
  navigation: NavItem[];
  editorialNavigation: NavItem[];
};

const fallbackSettings: SiteSettings = {
  site,
  hero,
  editorialStatement,
  servicesIntro,
  workIntro,
  behindTheWords,
  writingIntro,
  startHere,
  about,
  processIntro,
  testimonial,
  faqIntro,
  newsletter,
  socialLinks,
  navigation,
  editorialNavigation,
};

const siteSettingsQuery = gql`
  query GetRatiSiteSettings {
    ratiSiteSettings
  }
`;

function mergeSettings(partial: Partial<SiteSettings>): SiteSettings {
  return {
    site: { ...fallbackSettings.site, ...partial.site },
    hero: { ...fallbackSettings.hero, ...partial.hero },
    editorialStatement: {
      left: { ...fallbackSettings.editorialStatement.left, ...partial.editorialStatement?.left },
      right: partial.editorialStatement?.right ?? fallbackSettings.editorialStatement.right,
    },
    servicesIntro: { ...fallbackSettings.servicesIntro, ...partial.servicesIntro },
    workIntro: { ...fallbackSettings.workIntro, ...partial.workIntro },
    behindTheWords: { ...fallbackSettings.behindTheWords, ...partial.behindTheWords },
    writingIntro: { ...fallbackSettings.writingIntro, ...partial.writingIntro },
    startHere: {
      heading: partial.startHere?.heading ?? fallbackSettings.startHere.heading,
      aside: { ...fallbackSettings.startHere.aside, ...partial.startHere?.aside },
    },
    about: { ...fallbackSettings.about, ...partial.about },
    processIntro: { ...fallbackSettings.processIntro, ...partial.processIntro },
    testimonial: { ...fallbackSettings.testimonial, ...partial.testimonial },
    faqIntro: { ...fallbackSettings.faqIntro, ...partial.faqIntro },
    newsletter: { ...fallbackSettings.newsletter, ...partial.newsletter },
    socialLinks: partial.socialLinks?.length ? partial.socialLinks : fallbackSettings.socialLinks,
    navigation: partial.navigation?.length ? partial.navigation : fallbackSettings.navigation,
    editorialNavigation: partial.editorialNavigation?.length
      ? partial.editorialNavigation
      : fallbackSettings.editorialNavigation,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getWordpressClient();

  if (!client) {
    return fallbackSettings;
  }

  try {
    const data = await client.request<{ ratiSiteSettings: string | null }>(siteSettingsQuery);
    const parsed = parseJsonField<Partial<SiteSettings>>(data.ratiSiteSettings, {});
    return mergeSettings(parsed);
  } catch (error) {
    console.error("Failed to fetch site settings from WordPress", error);
    return fallbackSettings;
  }
}
