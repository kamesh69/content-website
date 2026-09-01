import { BlogIndex } from "@/components/blog-index";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  articleDetailToBlogPost,
  getEditorialArticles,
} from "@/lib/content/article-details";
import { getAllPosts } from "@/lib/wordpress";

export const revalidate = 60;

export const metadata = {
  title: "Writing",
  description: "Essays, process notes, and practical thoughts on scripts, copy, and editing.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  const editorial = getEditorialArticles().map(articleDetailToBlogPost);
  const editorialSlugs = new Set(editorial.map((post) => post.slug));
  const merged = [...editorial, ...posts.filter((post) => !editorialSlugs.has(post.slug))];

  return (
    <>
      <SiteHeader variant="editorial" contactHref="/#contact" />
      <BlogIndex posts={merged} />
      <SiteFooter variant="editorial" />
    </>
  );
}
