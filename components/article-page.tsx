import { ArticleBody } from "@/components/article-body";
import { ArticleHero } from "@/components/article-hero";
import { ArticleIntro } from "@/components/article-intro";
import { ArticleMetadata } from "@/components/article-metadata";
import { ContactCTA } from "@/components/contact-cta";
import { ContactForm } from "@/components/contact-form";
import { PullQuote } from "@/components/pull-quote";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ArticleDetail } from "@/lib/types";

import styles from "./article-page.module.scss";

type ArticlePageProps = {
  article: ArticleDetail;
};

export function ArticlePage({ article }: ArticlePageProps) {
  return (
    <div className={styles.shell}>
      <SiteHeader variant="editorial" contactHref="#contact" />
      <main>
        <article className={styles.article}>
          <div className={styles.wide}>
            <Reveal>
              <ArticleHero article={article} />
            </Reveal>
            <div className={styles.metaWrap}>
              <ArticleMetadata article={article} />
            </div>
          </div>

          <div className={styles.read}>
            <ArticleIntro text={article.introduction} />
            {article.quote ? (
              <Reveal>
                <PullQuote quote={article.quote} />
              </Reveal>
            ) : null}
            <ArticleBody article={article} />
          </div>
        </article>

        <section id="contact" className={styles.contact} aria-label="Contact">
          <div className={styles.read}>
            <Reveal>
              <ContactCTA />
            </Reveal>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter variant="editorial" />
    </div>
  );
}
