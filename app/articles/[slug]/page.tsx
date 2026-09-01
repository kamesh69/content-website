import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticlePage } from "@/components/article-page";
import {
  getEditorialArticleBySlug,
  getEditorialArticleSlugs,
} from "@/lib/content/article-details";
import { site } from "@/lib/content/site";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getEditorialArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getEditorialArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const url = `/articles/${article.slug}`;
  const title = article.title.replace(/\s+/g, " ").trim();

  return {
    title,
    description: article.seoDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: article.seoDescription,
      url,
      type: "article",
      images: [
        {
          url: article.heroImage,
          alt: article.heroImageAlt,
        },
      ],
    },
  };
}

export default async function EditorialArticlePage({ params }: ArticleRouteProps) {
  const { slug } = await params;
  const article = getEditorialArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
