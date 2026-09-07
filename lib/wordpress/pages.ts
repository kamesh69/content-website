import { gql } from "graphql-request";

import { getWordpressClient } from "./client";

export type LegalPage = {
  slug: string;
  title: string;
  content: string;
};

const pageBySlugQuery = gql`
  query GetRatiPageBySlug($slug: String!) {
    ratiPageBySlug(slug: $slug) {
      slug
      title
      content
    }
  }
`;

const fallbackPages: Record<string, LegalPage> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    content: `<p>Replace this placeholder with your production privacy notice covering analytics, newsletter subscriptions, and any WordPress editorial workflows.</p><p>Make sure this page reflects your real data processors, retention policy, cookie behavior, and contact information for privacy requests.</p>`,
  },
  imprint: {
    slug: "imprint",
    title: "Imprint",
    content: `<p>Replace this page with your legal entity details, registered address, and jurisdictional requirements before launch.</p><p>Suggested fields: business name, owner, address, contact email, registration number, VAT details, and responsible party for editorial content.</p>`,
  },
};

export async function getPageBySlug(slug: string, preview = false): Promise<LegalPage | null> {
  const client = getWordpressClient(preview);

  if (!client) {
    return fallbackPages[slug] ?? null;
  }

  try {
    const data = await client.request<{ ratiPageBySlug: LegalPage | null }>(pageBySlugQuery, {
      slug,
    });

    if (!data.ratiPageBySlug) {
      return fallbackPages[slug] ?? null;
    }

    return data.ratiPageBySlug;
  } catch (error) {
    console.error(`Failed to fetch page ${slug} from WordPress`, error);
    return fallbackPages[slug] ?? null;
  }
}
