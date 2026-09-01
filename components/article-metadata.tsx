import type { ArticleDetail } from "@/lib/types";

import styles from "./article-metadata.module.scss";

type ArticleMetadataProps = {
  article: Pick<ArticleDetail, "author" | "publishedAt" | "readingTime">;
};

export function ArticleMetadata({ article }: ArticleMetadataProps) {
  return (
    <p className={styles.meta}>
      <span>By {article.author}</span>
      <span aria-hidden="true" className={styles.dot}>
        •
      </span>
      <time dateTime={article.publishedAt}>{article.publishedAt}</time>
      <span aria-hidden="true" className={styles.dot}>
        •
      </span>
      <span>{article.readingTime}</span>
    </p>
  );
}
