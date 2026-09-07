"use client";

import { useId, useState } from "react";

import { Reveal } from "@/components/reveal";
import { faqItems as fallbackFaqItems } from "@/lib/content/faq";
import { faqIntro as fallbackFaqIntro } from "@/lib/content/site";
import type { FaqItem } from "@/lib/types";

import styles from "./faq-section.module.scss";

type FaqSectionProps = {
  faqItems?: FaqItem[];
  faqIntro?: typeof fallbackFaqIntro;
};

export function FaqSection({
  faqItems = fallbackFaqItems,
  faqIntro = fallbackFaqIntro,
}: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);
  const baseId = useId();

  return (
    <section className={styles.section} id="faq" aria-labelledby="faq-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.intro}>
          <h2 id="faq-heading">{faqIntro.heading}</h2>
        </Reveal>

        <div className={styles.list}>
          {faqItems.map((item, index) => {
            const open = openId === item.id;
            const panelId = `${baseId}-panel-${item.id}`;
            const buttonId = `${baseId}-button-${item.id}`;

            return (
              <Reveal key={item.id} className={styles.item} delay={index * 40}>
                <h3 className={styles.question}>
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    <span className={styles.icon} aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`${styles.answer} ${open ? styles.open : ""}`}
                  hidden={!open}
                >
                  <p>{item.answer}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
