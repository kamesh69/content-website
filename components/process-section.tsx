import { Reveal } from "@/components/reveal";
import { processSteps as fallbackProcessSteps } from "@/lib/content/process";
import { processIntro as fallbackProcessIntro } from "@/lib/content/site";
import type { ProcessStep } from "@/lib/types";

import styles from "./process-section.module.scss";

type ProcessSectionProps = {
  processSteps?: ProcessStep[];
  processIntro?: typeof fallbackProcessIntro;
};

export function ProcessSection({
  processSteps = fallbackProcessSteps,
  processIntro = fallbackProcessIntro,
}: ProcessSectionProps) {
  return (
    <section className={styles.section} id="process" aria-labelledby="process-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.intro}>
          <h2 id="process-heading">
            {processIntro.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </Reveal>

        <ol className={styles.timeline}>
          {processSteps.map((step, index) => (
            <Reveal key={step.number} as="li" className={styles.step} delay={index * 80}>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.number}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
