import { Reveal } from "@/components/reveal";
import { services as fallbackServices } from "@/lib/content/services";
import { servicesIntro as fallbackServicesIntro } from "@/lib/content/site";
import type { Service } from "@/lib/types";

import styles from "./services-section.module.scss";

type ServicesSectionProps = {
  services?: Service[];
  servicesIntro?: typeof fallbackServicesIntro;
};

export function ServicesSection({
  services = fallbackServices,
  servicesIntro = fallbackServicesIntro,
}: ServicesSectionProps) {
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
