import { gql } from "graphql-request";

import { projects as fallbackProjects } from "@/lib/content/projects";
import type { Project } from "@/lib/types";

import { getWordpressClient } from "./client";

type WpProjectNode = {
  id: string;
  slug: string;
  title: string;
  projectCategory?: string | null;
  projectType?: string | null;
  projectDescription?: string | null;
  projectHref?: string | null;
  projectFeatured?: boolean | null;
  sortOrder?: number | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    };
  };
};

const projectsQuery = gql`
  query GetRatiProjects {
    ratiProjects(first: 30, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        slug
        title
        projectCategory
        projectType
        projectDescription
        projectHref
        projectFeatured
        sortOrder
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

function mapProject(node: WpProjectNode): Project {
  const resolvedHref =
    node.projectHref && node.projectHref !== "#work" ? node.projectHref : `/blog/${node.slug}`;

  return {
    id: node.slug,
    title: node.title,
    category: node.projectCategory ?? "Article",
    type: node.projectType ?? "",
    description: node.projectDescription ?? undefined,
    image: node.featuredImage?.node?.sourceUrl ?? "/images/work/campaign.jpg",
    href: resolvedHref,
    featured: Boolean(node.projectFeatured),
  };
}

export async function getProjects(): Promise<Project[]> {
  const client = getWordpressClient();

  if (!client) {
    return fallbackProjects;
  }

  try {
    const data = await client.request<{ ratiProjects: { nodes: WpProjectNode[] } }>(projectsQuery);
    const projects = data.ratiProjects.nodes
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapProject);

    return projects.length > 0 ? projects : fallbackProjects;
  } catch (error) {
    console.error("Failed to fetch projects from WordPress", error);
    return fallbackProjects;
  }
}
