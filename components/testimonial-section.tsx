import { Reveal } from "@/components/reveal";
import { testimonial as fallbackTestimonial } from "@/lib/content/site";

import styles from "./testimonial-section.module.scss";

type TestimonialSectionProps = {
  testimonial?: typeof fallbackTestimonial;
};

export function TestimonialSection({ testimonial = fallbackTestimonial }: TestimonialSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="testimonial-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.intro}>
          <p className="eyebrow">{testimonial.label}</p>
          <h2 id="testimonial-heading">{testimonial.heading}</h2>
        </Reveal>

        <Reveal className={styles.quoteBlock} delay={100}>
          <span className={styles.mark} aria-hidden="true">
            “
          </span>
          <blockquote>
            <p>{testimonial.quote}</p>
            <footer>— {testimonial.attribution}</footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
