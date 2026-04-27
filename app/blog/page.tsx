import { BlogIndex } from "@/components/blog-index";
import { getAllPosts } from "@/lib/wordpress";

export const metadata = {
  title: "Blog",
  description: "Thoughts, process notes, and studio updates powered by headless WordPress.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return <BlogIndex posts={posts} />;
}
