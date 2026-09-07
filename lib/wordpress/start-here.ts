import { gql } from "graphql-request";

import { startHereItems as fallbackStartHereItems } from "@/lib/content/articles";
import type { StartHereItem } from "@/lib/types";

import { getWordpressClient } from "./client";

type WpStartHereNode = {
  id: string;
  slug: string;
  title: string;
  linkCategory?: string | null;
  linkHref?: string | null;
  sortOrder?: number | null;
};

const startHereQuery = gql`
  query GetRatiStartHere {
    ratiStartHeres(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
        linkCategory
        linkHref
        sortOrder
      }
    }
  }
`;

function mapStartHere(node: WpStartHereNode): StartHereItem {
  return {
    id: node.slug,
    category: node.linkCategory ?? "Guide",
    title: node.title,
    href: node.linkHref ?? "/blog",
  };
}

export async function getStartHereItems(): Promise<StartHereItem[]> {
  const client = getWordpressClient();

  if (!client) {
    return fallbackStartHereItems;
  }

  try {
    const data = await client.request<{ ratiStartHeres: { nodes: WpStartHereNode[] } }>(
      startHereQuery,
    );
    const items = data.ratiStartHeres.nodes
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapStartHere);

    return items.length > 0 ? items : fallbackStartHereItems;
  } catch (error) {
    console.error("Failed to fetch Start Here links from WordPress", error);
    return fallbackStartHereItems;
  }
}
