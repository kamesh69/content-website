import { gql } from "graphql-request";

import type { Article, BlogPost } from "@/lib/types";
import { articles as fallbackArticles } from "@/lib/content/articles";
import {
  articleDetailToBlogPost,
  getEditorialArticleBySlug,
  getEditorialArticles,
  mapBlogPostToArticleDetail,
} from "@/lib/content/article-details";

import {
  getWordpressClient,
  parseJsonField,
  RATI_CATEGORY_SLUG,
  sanitizeExcerpt,
} from "./client";

/** Only posts in this WP category appear on the Rati portfolio. */
export { RATI_CATEGORY_SLUG };

const fallbackPosts: BlogPost[] = [
  {
    id: "fallback-1",
    slug: "why-story-is-the-only-advantage-ai-cant-copy",
    title: "Why Story Is the Only Advantage AI Can’t Copy",
    excerpt:
      "A placeholder note shown before WordPress posts in the rati-writing category are connected.",
    content:
      "<p>Publish a WordPress <strong>Post</strong> (not a sports Article) in the <code>rati-writing</code> category on <code>cms.thesportsrivalry.com</code> to replace this fallback.</p>",
    publishedAt: "2026-04-24T10:00:00.000Z",
    coverImage: "/images/writing/story.jpg",
    author: "Rati Agrawal",
    categories: ["Craft"],
  },
  {
    id: "fallback-2",
    slug: "how-i-outline-scripts-that-dont-bore-me",
    title: "How I Outline Scripts That Don’t Bore Me",
    excerpt: "Fallback content used when the GraphQL endpoint is unreachable.",
    content:
      "<p>See <code>docs/wordpress-headless-cms.md</code> for the shared-CMS setup steps.</p>",
    publishedAt: "2026-04-22T10:00:00.000Z",
    coverImage: "/images/writing/outline.jpg",
    author: "Rati Agrawal",
    categories: ["Process"],
  },
];

type WpPostNode = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  status?: string;
  author?: {
    node?: {
      name?: string;
    };
  };
  categories?: {
    nodes?: Array<{ name?: string | null; slug?: string | null }>;
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    };
  };
  ratiQuote?: string | null;
  ratiClosing?: string | null;
  ratiReadingTime?: string | null;
  ratiSections?: string | null;
  ratiHeroImageAlt?: string | null;
};

const allPostsQuery = gql`
  query GetRatiPosts($category: String!, $first: Int!) {
    posts(
      first: $first
      where: { status: PUBLISH, categoryName: $category, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        title
        excerpt
        content
        date
        status
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        ratiQuote
        ratiClosing
        ratiReadingTime
        ratiSections
        ratiHeroImageAlt
      }
    }
  }
`;

const postBySlugQuery = gql`
  query GetRatiPostBySlug($slug: ID!, $asPreview: Boolean = false) {
    post(id: $slug, idType: SLUG, asPreview: $asPreview) {
      id
      slug
      title
      excerpt
      content
      date
      status
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      ratiQuote
      ratiClosing
      ratiReadingTime
      ratiSections
      ratiHeroImageAlt
    }
  }
`;

function hasRatiCategory(post: WpPostNode) {
  return (
    post.categories?.nodes?.some((category) => category.slug === RATI_CATEGORY_SLUG) ?? false
  );
}

export function mapWpPostToUiPost(post: WpPostNode): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: sanitizeExcerpt(post.excerpt),
    content: post.content,
    publishedAt: post.date,
    coverImage: post.featuredImage?.node?.sourceUrl ?? undefined,
    author: post.author?.node?.name ?? "Rati Agrawal",
    categories:
      post.categories?.nodes
        ?.map((category) => category.name)
        .filter((category): category is string => Boolean(category)) ?? [],
    quote: post.ratiQuote ?? undefined,
    closing: post.ratiClosing ?? undefined,
    readingTime: post.ratiReadingTime ?? undefined,
    sections: parseJsonField(post.ratiSections, []),
    heroImageAlt: post.ratiHeroImageAlt ?? undefined,
  };
}

export function mapBlogPostToArticle(post: BlogPost): Article {
  return {
    id: post.id,
    title: post.title,
    category: post.categories[0] ?? "Writing",
    image: post.coverImage ?? "/images/writing/story.jpg",
    href: `/blog/${post.slug}`,
    excerpt: post.excerpt,
  };
}

function featuredEditorialArticles(): Article[] {
  return getEditorialArticles().map((article) => ({
    id: article.slug,
    title: article.title.replace(/\s+/g, " ").trim(),
    category: "Writing",
    image: article.heroImage,
    href: `/blog/${article.slug}`,
    excerpt: article.introduction,
  }));
}

function withFeaturedEditorial(articles: Article[], limit: number) {
  const featured = featuredEditorialArticles();
  const featuredHrefs = new Set(featured.map((article) => article.href));
  return [...featured, ...articles.filter((article) => !featuredHrefs.has(article.href))].slice(
    0,
    limit,
  );
}

export async function getAllPosts(preview = false): Promise<BlogPost[]> {
  const client = getWordpressClient(preview);

  if (!client) {
    return fallbackPosts;
  }

  try {
    const data = await client.request<{ posts: { nodes: WpPostNode[] } }>(allPostsQuery, {
      category: RATI_CATEGORY_SLUG,
      first: 50,
    });

    const posts = data.posts.nodes.filter(hasRatiCategory).map(mapWpPostToUiPost);

    return posts.length > 0 ? posts : fallbackPosts;
  } catch (error) {
    console.error("Failed to fetch WordPress posts", error);
    return fallbackPosts;
  }
}

export async function getLatestPosts(limit = 5, preview = false): Promise<BlogPost[]> {
  const posts = await getAllPosts(preview);
  return posts.slice(0, limit);
}

export async function getLatestArticles(limit = 5, preview = false): Promise<Article[]> {
  const client = getWordpressClient(preview);

  if (!client) {
    return withFeaturedEditorial(fallbackArticles, limit);
  }

  try {
    const data = await client.request<{ posts: { nodes: WpPostNode[] } }>(allPostsQuery, {
      category: RATI_CATEGORY_SLUG,
      first: limit,
    });

    const posts = data.posts.nodes.filter(hasRatiCategory).map(mapWpPostToUiPost);

    if (posts.length === 0) {
      return withFeaturedEditorial(fallbackArticles, limit);
    }

    return withFeaturedEditorial(posts.map(mapBlogPostToArticle), limit);
  } catch (error) {
    console.error("Failed to fetch latest WordPress articles", error);
    return withFeaturedEditorial(fallbackArticles, limit);
  }
}

function getFallbackPost(slug: string): BlogPost | null {
  const foundPost = fallbackPosts.find((post) => post.slug === slug);
  if (foundPost) return foundPost;

  const foundArticle = getEditorialArticleBySlug(slug);
  if (foundArticle) return articleDetailToBlogPost(foundArticle);

  return null;
}

export async function getPostBySlug(slug: string, preview = false): Promise<BlogPost | null> {
  const client = getWordpressClient(preview);

  if (!client) {
    return getFallbackPost(slug);
  }

  try {
    const data = await client.request<{ post: WpPostNode | null }>(postBySlugQuery, {
      slug,
      asPreview: preview,
    });

    if (!data.post || (!preview && !hasRatiCategory(data.post))) {
      return getFallbackPost(slug);
    }

    return mapWpPostToUiPost(data.post);
  } catch (error) {
    console.error(`Failed to fetch WordPress post for slug ${slug}`, error);
    return getFallbackPost(slug);
  }
}

export { mapBlogPostToArticleDetail };
