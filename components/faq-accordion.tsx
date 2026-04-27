"use client";

import { useState } from "react";

import type { FaqItem } from "@/lib/types";

import styles from "./faq-accordion.module.scss";

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className={styles.section} id="faq">
      <div className={`section-shell ${styles.inner}`}>
        <div className={styles.heading}>
          <p className="eyebrow">FAQ</p>
          <h2>Questions that actually change the build.</h2>
        </div>
        <div className={styles.items}>
          {items.map((item, index) => {
            const open = index === openIndex;

            return (
              <div key={item.question} className={styles.item}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className={styles.meta}>{item.askedBy}</span>
                </button>
                {open ? <div className={styles.answer}>{item.answer}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
