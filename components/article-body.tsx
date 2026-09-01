import type { ArticleDetail } from "@/lib/types";

import { ArticleSection } from "@/components/article-section";

import styles from "./article-body.module.scss";

type ArticleBodyProps = {
  article: Pick<ArticleDetail, "sections" | "closing" | "htmlContent">;
};

export function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <div className={styles.body}>
      {article.sections.map((section) => (
        <ArticleSection key={section.id} section={section} />
      ))}

      {article.closing ? <p className={styles.closing}>{article.closing}</p> : null}

      {article.htmlContent ? (
        <div className={styles.html} dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
      ) : null}
    </div>
  );
}
