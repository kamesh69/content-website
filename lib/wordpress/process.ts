import { gql } from "graphql-request";

import { processSteps as fallbackProcessSteps } from "@/lib/content/process";
import type { ProcessStep } from "@/lib/types";

import { getWordpressClient } from "./client";

type WpProcessNode = {
  id: string;
  title: string;
  content?: string | null;
  stepNumber?: string | null;
  sortOrder?: number | null;
};

const processQuery = gql`
  query GetRatiProcessSteps {
    ratiProcessSteps(first: 10, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes {
        id
        title
        content
        stepNumber
        sortOrder
      }
    }
  }
`;

function mapProcessStep(node: WpProcessNode): ProcessStep {
  return {
    number: node.stepNumber ?? "00",
    title: node.title,
    body: node.content?.replace(/<[^>]*>/g, "").trim() ?? "",
  };
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  const client = getWordpressClient();

  if (!client) {
    return fallbackProcessSteps;
  }

  try {
    const data = await client.request<{ ratiProcessSteps: { nodes: WpProcessNode[] } }>(
      processQuery,
    );
    const steps = data.ratiProcessSteps.nodes
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(mapProcessStep);

    return steps.length > 0 ? steps : fallbackProcessSteps;
  } catch (error) {
    console.error("Failed to fetch process steps from WordPress", error);
    return fallbackProcessSteps;
  }
}
