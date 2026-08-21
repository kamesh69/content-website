import Link from "next/link";

import type { BlogPost } from "@/lib/types";

import styles from "./blog-index.module.scss";

type BlogIndexProps = {
  posts: BlogPost[];
};

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <main className={styles.page}>
      <div className={`section-shell ${styles.inner}`}>
        <header className={styles.header}>
          <p className="eyebrow">From the desk</p>
          <h1>Writing & notes.</h1>
          <p>
            Essays, process notes, and practical thoughts on scripts, copy, and editing—pulled from
            WordPress posts in the <code>rati-writing</code> category.
          </p>
        </header>
        <div className={styles.grid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.card}>
              <p className={styles.meta}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <div className={styles.tags}>
                {post.categories.map((category) => (
                  <span key={category}>{category}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
