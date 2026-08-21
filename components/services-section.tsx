import { Reveal } from "@/components/reveal";
import { services } from "@/lib/content/services";
import { servicesIntro } from "@/lib/content/site";

import styles from "./services-section.module.scss";

export function ServicesSection() {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.intro}>
          <p className="eyebrow">{servicesIntro.label}</p>
          <h2 id="services-heading">{servicesIntro.heading}</h2>
        </Reveal>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <Reveal key={service.id} as="article" className={styles.card} delay={index * 80}>
              <div className={styles.top}>
                <span className={styles.number}>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href={service.href} className={styles.cta}>
                {service.cta} →
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
