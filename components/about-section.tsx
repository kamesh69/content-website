import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { about } from "@/lib/content/site";

import styles from "./about-section.module.scss";

export function AboutSection() {
  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.copy}>
          <h2 id="about-heading">
            {about.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={styles.lead}>{about.lead}</p>
          <p className={styles.body}>{about.body}</p>
          <a href={about.cta.href} className={styles.cta}>
            {about.cta.label} →
          </a>
        </Reveal>

        <Reveal className={styles.media} delay={100}>
          <div className={styles.accentFrame} aria-hidden="true" />
          <div className={styles.frame}>
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              sizes="(max-width: 960px) 100vw, 38vw"
              className={styles.image}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
