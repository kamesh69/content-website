import type { ArticleSection as ArticleSectionData } from "@/lib/types";

import styles from "./article-section.module.scss";

type ArticleSectionProps = {
  section: ArticleSectionData;
};

export function ArticleSection({ section }: ArticleSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={section.id}>
      <h2 id={section.id} className={styles.heading}>
        {section.heading}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </section>
  );
}
