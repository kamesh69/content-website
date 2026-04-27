"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ProcessStep } from "@/lib/types";

import styles from "./process-timeline.module.scss";

gsap.registerPlugin(ScrollTrigger);

type ProcessTimelineProps = {
  process: ProcessStep[];
};

export function ProcessTimeline({ process }: ProcessTimelineProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-process-card]");

      cards.forEach((card, index) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });

        gsap.from(card, {
          opacity: 0,
          y: 80,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const progressHeight = `${((activeIndex + 1) / process.length) * 100}%`;

  return (
    <section className={styles.section} id="process" ref={rootRef}>
      <div className={`section-shell ${styles.inner}`}>
        <aside className={styles.sidebar}>
          <p className="eyebrow">My Process</p>
          <h2>Six steps from first brief to VPS-ready launch.</h2>
          <div className={styles.progressRail} aria-hidden="true">
            <span className={styles.progressFill} style={{ height: progressHeight }} />
          </div>
          <div className={styles.activeMeta}>
            <p className={styles.activeNumber}>{process[activeIndex]?.number}</p>
            <h3>{process[activeIndex]?.title}</h3>
            <p>{process[activeIndex]?.body}</p>
          </div>
        </aside>

        <div className={styles.steps}>
          {process.map((step, index) => (
            <article
              key={step.number}
              className={`${styles.card} ${index === activeIndex ? styles.active : ""}`}
              data-process-card
            >
              <div className={styles.imageWrap}>
                <img src={step.image} alt="" aria-hidden="true" />
                <div className={styles.overlay} />
              </div>
              <div className={styles.content}>
                <p className={styles.number}>{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
