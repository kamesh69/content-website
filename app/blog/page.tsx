import { BlogIndex } from "@/components/blog-index";
import { getAllPosts } from "@/lib/wordpress";

export const metadata = {
  title: "Writing",
  description: "Essays, process notes, and practical thoughts on scripts, copy, and editing.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return <BlogIndex posts={posts} />;
}
