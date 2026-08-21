import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { articles } from "@/lib/content/articles";
import { writingIntro } from "@/lib/content/site";

import styles from "./latest-writing.module.scss";

export function LatestWriting() {
  return (
    <section className={styles.section} id="writing" aria-labelledby="writing-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.intro}>
          <p className="eyebrow">{writingIntro.label}</p>
          <h2 id="writing-heading">{writingIntro.heading}</h2>
        </Reveal>

        <div className={styles.grid}>
          {articles.map((article, index) => (
            <Reveal key={article.id} as="article" className={styles.card} delay={(index % 5) * 60}>
              <a href={article.href} className={styles.link}>
                <div className={styles.media}>
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 20vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.copy}>
                  <p className={styles.category}>{article.category}</p>
                  <h3>{article.title}</h3>
                  <span className={styles.cta}>Read article →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
