import { Reveal } from "@/components/reveal";
import { editorialStatement } from "@/lib/content/site";

import styles from "./editorial-statement.module.scss";

export function EditorialStatement() {
  return (
    <section className={styles.section} aria-label="Editorial statement">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.left}>
          <h2 className={styles.heading}>
            <span>{editorialStatement.left.lineOne}</span>
            <span>{editorialStatement.left.lineTwo}</span>
            <em>{editorialStatement.left.accent}</em>
          </h2>
        </Reveal>
        <div className={styles.divider} aria-hidden="true" />
        <Reveal className={styles.right} delay={100}>
          <p>{editorialStatement.right}</p>
        </Reveal>
      </div>
    </section>
  );
}
