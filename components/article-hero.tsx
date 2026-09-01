import Image from "next/image";

import type { ArticleDetail } from "@/lib/types";

import styles from "./article-hero.module.scss";

type ArticleHeroProps = {
  article: Pick<ArticleDetail, "category" | "title" | "heroImage" | "heroImageAlt">;
};

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <header className={styles.hero}>
      <p className={styles.category}>{article.category}</p>
      <div className={styles.media}>
        <Image
          src={article.heroImage}
          alt={article.heroImageAlt}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1120px"
          className={styles.image}
        />
      </div>
      <div className={styles.titlePanel}>
        <h1 className={styles.title}>{article.title}</h1>
      </div>
    </header>
  );
}
