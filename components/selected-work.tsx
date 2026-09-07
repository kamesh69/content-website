import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { projects as fallbackProjects } from "@/lib/content/projects";
import { workIntro as fallbackWorkIntro } from "@/lib/content/site";
import type { Project } from "@/lib/types";

import styles from "./selected-work.module.scss";

type SelectedWorkProps = {
  projects?: Project[];
  workIntro?: typeof fallbackWorkIntro;
};

export function SelectedWork({
  projects = fallbackProjects,
  workIntro = fallbackWorkIntro,
}: SelectedWorkProps) {
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const supporting = projects.filter((project) => project.id !== featured.id);

  return (
    <section className={styles.section} id="work" aria-labelledby="work-heading">
      <div className={`section-shell ${styles.inner}`}>
        <Reveal className={styles.intro}>
          <p className="eyebrow">{workIntro.label}</p>
          <h2 id="work-heading">{workIntro.heading}</h2>
        </Reveal>

        <Reveal as="article" className={styles.featured}>
          <a href={featured.href} className={styles.featuredLink}>
            <div className={styles.featuredMedia}>
              <Image
                src={featured.image}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                className={styles.image}
              />
            </div>
            <div className={styles.featuredCopy}>
              <p className={styles.category}>{featured.category}</p>
              <h3>{featured.title}</h3>
              <p className={styles.type}>{featured.type}</p>
              {featured.description ? <p className={styles.description}>{featured.description}</p> : null}
              <span className={styles.cta}>View Article →</span>
            </div>
          </a>
        </Reveal>

        <div className={styles.grid}>
          {supporting.map((project, index) => (
            <Reveal key={project.id} as="article" className={styles.card} delay={(index % 3) * 70}>
              <a href={project.href} className={styles.cardLink}>
                <div className={styles.cardMedia}>
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                    className={styles.image}
                  />
                </div>
                <div className={styles.cardCopy}>
                  <p className={styles.category}>{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className={styles.type}>{project.type}</p>
                  <span className={styles.cta}>View Article →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
