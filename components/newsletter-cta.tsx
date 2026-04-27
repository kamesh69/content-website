import type { NewsletterLink } from "@/lib/types";

import styles from "./newsletter-cta.module.scss";

type NewsletterCtaProps = {
  newsletter: NewsletterLink;
};

export function NewsletterCta({ newsletter }: NewsletterCtaProps) {
  return (
    <section className={styles.section}>
      <div className={`section-shell ${styles.inner}`}>
        <div>
          <p className="eyebrow">{newsletter.eyebrow}</p>
          <h2>{newsletter.title}</h2>
        </div>
        <div className={styles.copy}>
          <p>{newsletter.description}</p>
          <a href={newsletter.href} target="_blank" rel="noreferrer" className={styles.cta}>
            {newsletter.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
