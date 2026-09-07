import { GraphQLClient } from "graphql-request";

export const RATI_CATEGORY_SLUG = "rati-writing";

export function getGraphqlEndpoint() {
  return process.env.WORDPRESS_GRAPHQL_URL ?? null;
}

export function getWordpressClient(preview = false) {
  const endpoint = getGraphqlEndpoint();

  if (!endpoint) {
    return null;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (preview && process.env.WORDPRESS_PREVIEW_AUTH) {
    headers.Authorization = `Basic ${process.env.WORDPRESS_PREVIEW_AUTH}`;
  }

  return new GraphQLClient(endpoint, { headers });
}

export function parseJsonField<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function sanitizeExcerpt(excerpt: string) {
  return excerpt.replace(/<[^>]*>/g, "").trim();
}
