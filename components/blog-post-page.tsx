import Link from "next/link";

import type { BlogPost } from "@/lib/types";

import styles from "./blog-post-page.module.scss";

type BlogPostPageProps = {
  post: BlogPost;
};

export function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <p className={styles.meta}>
          {post.author} ·{" "}
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />
        <Link href="/blog" className={styles.back}>
          ← Back to writing
        </Link>
      </article>
    </main>
  );
}
