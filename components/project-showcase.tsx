"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Project } from "@/lib/types";

import styles from "./project-showcase.module.scss";

gsap.registerPlugin(ScrollTrigger);

type ProjectShowcaseProps = {
  projects: Project[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const activeProject = projects[activeIndex];

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      revealTimeline
        .fromTo(
          "[data-reveal-stage]",
          {
            clipPath: "circle(8.5rem at 58% 40%)",
          },
          {
            clipPath: "circle(140vmax at 58% 40%)",
            ease: "none",
            duration: 1,
          },
          0,
        )
        .fromTo(
          "[data-work-list]",
          {
            opacity: 0,
            x: -140,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
          },
          0.15,
        )
        .fromTo(
          "[data-work-line]",
          {
            opacity: 0.1,
            scaleX: 0.08,
          },
          {
            opacity: 0.92,
            scaleX: 1,
            duration: 0.5,
          },
          0.18,
        )
        .fromTo(
          "[data-meta-part]",
          {
            opacity: 0,
            y: 58,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.38,
          },
          0.26,
        )
        .fromTo(
          "[data-tv-shell]",
          {
            scale: 0.72,
            yPercent: 18,
          },
          {
            scale: 1,
            yPercent: 0,
            duration: 0.55,
          },
          0,
        )
        .fromTo(
          "[data-tv-screen]",
          {
            scale: 0.78,
          },
          {
            scale: 1,
            duration: 0.55,
          },
          0.04,
        )
        .fromTo(
          "[data-tv-static]",
          {
            opacity: 0.96,
          },
          {
            opacity: 0.18,
            duration: 0.42,
          },
          0.18,
        )
        .fromTo(
          "[data-signal-glow]",
          {
            scale: 0.5,
            opacity: 0.75,
          },
          {
            scale: 3,
            opacity: 0.16,
            duration: 0.9,
          },
          0.02,
        )
        .to(
          "[data-work-list], [data-work-line], [data-meta-part]",
          {
            opacity: 0,
            y: 42,
            duration: 0.24,
          },
          0.78,
        )
        .fromTo(
          "[data-scene-wash]",
          {
            opacity: 0.62,
          },
          {
            opacity: 0.22,
            duration: 1,
          },
          0,
        );

      gsap.to("[data-scene]", {
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="work" ref={rootRef}>
      <div className={styles.pinStage}>
        <div
          className={styles.scene}
          data-scene
          style={{
            backgroundImage: `url(${activeProject.coverImage})`,
          }}
        >
          <div className={styles.sceneWash} data-scene-wash />

          <div className={styles.revealStage} data-reveal-stage>
            <div className={styles.inner}>
              <div className={styles.leftList} data-work-list>
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    className={`${styles.projectName} ${index === activeIndex ? styles.activeName : ""}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    data-project-name
                  >
                    {project.title}
                  </button>
                ))}
              </div>

              <div className={styles.stageBody}>
                <div className={styles.topLine} aria-hidden="true" data-work-line />
                <div className={styles.bottomLine} aria-hidden="true" data-work-line />

                <div className={styles.yearTag} data-meta-part>
                  <span>{activeProject.year}</span>
                  <span>{activeProject.services[1] ?? activeProject.services[0]}</span>
                </div>

                <div className={styles.projectMeta}>
                  <p className="eyebrow" data-meta-part>
                    Selected Works 2016 — 2026
                  </p>
                  <h2 data-meta-part>{activeProject.title}</h2>
                  <p data-meta-part>{activeProject.summary}</p>
                </div>

                <p className={styles.contactCue} data-meta-part>
                  You like what you see? Let&apos;s talk:
                </p>
              </div>
            </div>
          </div>

          <div className={styles.tvAnchor}>
            <div className={styles.signalGlow} aria-hidden="true" data-signal-glow />
            <div className={styles.tvShell} data-tv-shell>
              <div className={styles.tvTop} aria-hidden="true" />
              <div className={styles.tvBrand}>MONOLITH</div>
              <div className={styles.tvScreen} data-tv-screen>
                <img src={activeProject.coverImage} alt="" aria-hidden="true" className={styles.screenImage} />
                <video
                  key={activeProject.id}
                  src={activeProject.tvVideo}
                  poster={activeProject.coverImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={styles.screenVideo}
                />
                <div className={styles.tvGlass} aria-hidden="true" />
                <div className={styles.tvStatic} aria-hidden="true" data-tv-static />
              </div>
              <div className={styles.tvBottomPanel}>
                <div className={styles.tvDialGroup} aria-hidden="true">
                  <span />
                  <span />
                </div>
                <div className={styles.tvPorts} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
