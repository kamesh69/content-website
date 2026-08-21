import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { behindTheWords } from "@/lib/content/site";

import styles from "./behind-the-words.module.scss";

export function BehindTheWords() {
  return (
    <section className={styles.section} aria-labelledby="behind-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.media}>
          <Image
            src={behindTheWords.image}
            alt={behindTheWords.imageAlt}
            fill
            sizes="(max-width: 960px) 100vw, 48vw"
            className={styles.image}
          />
        </Reveal>

        <Reveal className={styles.copy} delay={100}>
          <p className="eyebrow">{behindTheWords.label}</p>
          <h2 id="behind-heading">
            {behindTheWords.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={styles.body}>{behindTheWords.body}</p>

          <div className={styles.steps} role="list">
            {behindTheWords.steps.map((step, index) => (
              <div key={step.number} className={styles.step} role="listitem">
                <span className={styles.stepNumber}>{step.number}</span>
                <span className={styles.stepTitle}>{step.title}</span>
                {index < behindTheWords.steps.length - 1 ? (
                  <span className={styles.connector} aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>

          <a href={behindTheWords.cta.href} className={styles.cta}>
            {behindTheWords.cta.label} →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
