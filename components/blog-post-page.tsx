import Link from "next/link";

import type { BlogPost } from "@/lib/types";

import styles from "./blog-post-page.module.scss";

type BlogPostPageProps = {
  post: BlogPost;
};

export function BlogPostPage({ post }: BlogPostPageProps) {
  return (
    <main className={styles.page}>
      <article className={`section-shell ${styles.inner}`}>
        <Link href="/blog" className="text-link">
          Back to blog
        </Link>
        <header className={styles.header}>
          <p className="eyebrow">{post.author}</p>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>
        {post.coverImage ? <img src={post.coverImage} alt="" className={styles.cover} /> : null}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}
