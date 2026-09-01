import type { MetadataRoute } from "next";

import { getEditorialArticleSlugs } from "@/lib/content/article-details";
import { getSiteUrl } from "@/lib/seo";
import { getAllPosts } from "@/lib/wordpress";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/imprint`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const editorialSlugs = new Set(getEditorialArticleSlugs());
  const editorialRoutes: MetadataRoute.Sitemap = [...editorialSlugs].map((slug) => ({
    url: `${siteUrl}/articles/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const posts = await getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => !editorialSlugs.has(post.slug))
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...editorialRoutes, ...blogRoutes];
}
