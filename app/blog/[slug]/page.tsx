import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ArticlePage } from "@/components/article-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { mapBlogPostToArticleDetail } from "@/lib/content/article-details";
import { getAllPosts, getPostBySlug, getSiteSettings } from "@/lib/wordpress";

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
  const { isEnabled } = await draftMode();
  const post = await getPostBySlug(slug, isEnabled);
  const settings = await getSiteSettings();

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
      title: `${post.title} | ${settings.site.name}`,
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
  const { isEnabled } = await draftMode();
  const [post, settings] = await Promise.all([
    getPostBySlug(slug, isEnabled),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <SiteHeader
        variant="editorial"
        contactHref="/#contact"
        site={settings.site}
        editorialNavigation={settings.editorialNavigation}
      />
      <ArticlePage article={mapBlogPostToArticleDetail(post)} />
      <SiteFooter variant="editorial" site={settings.site} socialLinks={settings.socialLinks} />
    </>
  );
}
