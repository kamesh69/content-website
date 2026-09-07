import { gql } from "graphql-request";

import { faqItems as fallbackFaqItems } from "@/lib/content/faq";
import type { FaqItem } from "@/lib/types";

import { getWordpressClient } from "./client";

type WpFaqNode = {
  id: string;
  slug: string;
  title: string;
  content?: string | null;
  sortOrder?: number | null;
};

const faqQuery = gql`
  query GetRatiFaq {
    ratiFaqs(first: 30, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
        content
        sortOrder
      }
    }
  }
`;

function mapFaq(node: WpFaqNode): FaqItem {
  return {
    id: node.slug,
    question: node.title,
    answer: node.content?.replace(/<[^>]*>/g, "").trim() ?? "",
  };
}

export async function getFaqItems(): Promise<FaqItem[]> {
  const client = getWordpressClient();

  if (!client) {
    return fallbackFaqItems;
  }

  try {
    const data = await client.request<{ ratiFaqs: { nodes: WpFaqNode[] } }>(faqQuery);
    const items = data.ratiFaqs.nodes
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapFaq);

    return items.length > 0 ? items : fallbackFaqItems;
  } catch (error) {
    console.error("Failed to fetch FAQ from WordPress", error);
    return fallbackFaqItems;
  }
}
