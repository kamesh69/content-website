import { gql } from "graphql-request";

import { services as fallbackServices } from "@/lib/content/services";
import type { Service } from "@/lib/types";

import { getWordpressClient } from "./client";

type WpServiceNode = {
  id: string;
  slug: string;
  title: string;
  content?: string | null;
  serviceNumber?: string | null;
  serviceItems?: string | null;
  serviceCta?: string | null;
  serviceHref?: string | null;
  sortOrder?: number | null;
};

const servicesQuery = gql`
  query GetRatiServices {
    ratiServices(first: 20, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
        content
        serviceNumber
        serviceItems
        serviceCta
        serviceHref
        sortOrder
      }
    }
  }
`;

function mapService(node: WpServiceNode): Service {
  let items: string[] = [];

  if (node.serviceItems) {
    try {
      const parsed = JSON.parse(node.serviceItems);
      items = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      items = node.serviceItems.split("\n").map((item) => item.trim()).filter(Boolean);
    }
  }

  return {
    id: node.slug,
    number: node.serviceNumber ?? "00",
    title: node.title,
    description: node.content?.replace(/<[^>]*>/g, "").trim() ?? "",
    items,
    cta: node.serviceCta ?? "Learn more",
    href: node.serviceHref ?? "#contact",
  };
}

export async function getServices(): Promise<Service[]> {
  const client = getWordpressClient();

  if (!client) {
    return fallbackServices;
  }

  try {
    const data = await client.request<{ ratiServices: { nodes: WpServiceNode[] } }>(servicesQuery);
    const services = data.ratiServices.nodes
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapService);

    return services.length > 0 ? services : fallbackServices;
  } catch (error) {
    console.error("Failed to fetch services from WordPress", error);
    return fallbackServices;
  }
}
