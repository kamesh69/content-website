import { redirect } from "next/navigation";

type ArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditorialArticlePage({ params }: ArticleRouteProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
