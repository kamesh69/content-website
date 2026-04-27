import { GraphQLClient, gql } from "graphql-request";

import type { BlogPost } from "@/lib/types";

const fallbackPosts: BlogPost[] = [
  {
    id: "fallback-1",
    slug: "launching-a-motion-led-studio-site",
    title: "Launching a motion-led studio site on one VPS",
    excerpt:
      "A placeholder post showing how the blog UI behaves before the real WordPress connection is added.",
    content:
      "<p>This placeholder exists so the blog section works before WordPress is configured. Replace it by connecting <code>WORDPRESS_GRAPHQL_URL</code> to your live WPGraphQL endpoint.</p><p>The homepage stays fully custom, while the blog uses WordPress only for repeatable editorial content.</p>",
    publishedAt: "2026-04-24T10:00:00.000Z",
    author: "Studio Replica",
    categories: ["Setup", "Infrastructure"],
  },
  {
    id: "fallback-2",
    slug: "art-direction-without-a-page-builder",
    title: "Art direction without a page builder",
    excerpt:
      "Why this starter keeps the homepage in code and gives WordPress the blog instead.",
    content:
      "<p>Some pages are content management problems. Others are motion-design problems. This homepage is the second kind.</p>",
    publishedAt: "2026-04-22T10:00:00.000Z",
    author: "Studio Replica",
    categories: ["Design", "CMS"],
  },
];

type WpPostNode = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author?: {
    node?: {
      name?: string;
    };
  };
  categories?: {
    nodes?: Array<{ name?: string | null }>;
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
    };
  };
};

const allPostsQuery = gql`
  query GetAllPosts {
    posts(first: 20, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        excerpt
        content
        date
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

const postBySlugQuery = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      date
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

function getClient() {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;

  if (!endpoint) {
    return null;
  }

  return new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
    },
  });
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
    author: post.author?.node?.name ?? "Studio Replica",
    categories:
      post.categories?.nodes
        ?.map((category) => category.name)
        .filter((category): category is string => Boolean(category)) ?? [],
  };
}

function sanitizeExcerpt(excerpt: string) {
  return excerpt.replace(/<[^>]*>/g, "").trim();
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const client = getClient();

  if (!client) {
    return fallbackPosts;
  }

  try {
    const data = await client.request<{ posts: { nodes: WpPostNode[] } }>(allPostsQuery);

    const posts = data.posts.nodes.map(mapWpPostToUiPost);

    return posts.length > 0 ? posts : fallbackPosts;
  } catch (error) {
    console.error("Failed to fetch WordPress posts", error);
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const client = getClient();

  if (!client) {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }

  try {
    const data = await client.request<{ post: WpPostNode | null }>(postBySlugQuery, { slug });

    if (!data.post) {
      return null;
    }

    return mapWpPostToUiPost(data.post);
  } catch (error) {
    console.error(`Failed to fetch WordPress post for slug ${slug}`, error);
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
}
