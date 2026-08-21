import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { hero } from "@/lib/content/site";

import styles from "./hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.copy}>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-heading" className={styles.heading}>
            {hero.headingLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.description}>{hero.description}</p>
          <div className={styles.actions}>
            <a href={hero.primaryCta.href} className={styles.primary}>
              {hero.primaryCta.label}
            </a>
            <a href={hero.secondaryCta.href} className={styles.secondary}>
              {hero.secondaryCta.label} →
            </a>
          </div>
          <div className={styles.tags}>
            {hero.tags.map((tag, index) => (
              <span key={tag.label} className={styles.tagGroup}>
                {index > 0 ? <span className={styles.dot} aria-hidden="true">·</span> : null}
                <a href={tag.href}>{tag.label}</a>
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal className={styles.media} delay={120}>
          <div className={styles.blob} aria-hidden="true" />
          <div className={styles.frame}>
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 44vw"
              className={styles.image}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
