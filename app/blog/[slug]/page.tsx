import { notFound } from "next/navigation";

import { BlogPostPage } from "@/components/blog-post-page";
import { getAllPosts, getPostBySlug } from "@/lib/wordpress";

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostPage post={post} />;
}
