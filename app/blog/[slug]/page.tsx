import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

import { ArticlePage } from "@/components/article-page";
import {
  getEditorialArticleBySlug,
  mapBlogPostToArticleDetail,
} from "@/lib/content/article-details";
import { site } from "@/lib/content/site";
import { getAllPosts, getPostBySlug } from "@/lib/wordpress";

export const revalidate = 60;

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostRouteProps): Promise<Metadata> {
  const { slug } = await params;

  if (getEditorialArticleBySlug(slug)) {
    return {
      title: "Article",
    };
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const url = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | ${site.name}`,
      description: post.excerpt,
      url,
      type: "article",
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function BlogPost({ params }: BlogPostRouteProps) {
  const { slug } = await params;

  if (getEditorialArticleBySlug(slug)) {
    redirect(`/articles/${slug}`);
  }

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <ArticlePage article={mapBlogPostToArticleDetail(post)} />;
}
