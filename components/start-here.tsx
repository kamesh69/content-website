import { Reveal } from "@/components/reveal";
import { startHereItems } from "@/lib/content/articles";
import { startHere } from "@/lib/content/site";

import styles from "./start-here.module.scss";

export function StartHere() {
  return (
    <section className={styles.section} aria-labelledby="start-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal>
          <h2 id="start-heading" className={styles.heading}>
            {startHere.heading}
          </h2>
        </Reveal>

        <div className={styles.layout}>
          <div className={styles.cards}>
            {startHereItems.map((item, index) => (
              <Reveal key={item.id} as="article" className={styles.card} delay={index * 80}>
                <a href={item.href} className={styles.link}>
                  <p className={styles.category}>{item.category}</p>
                  <h3>{item.title}</h3>
                  <span>Read →</span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className={styles.aside} delay={120}>
            <p className={styles.asideEyebrow}>{startHere.aside.eyebrow}</p>
            <p className={styles.asideText}>{startHere.aside.text}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
