"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { AboutContent } from "@/lib/types";

import styles from "./about-section.module.scss";

gsap.registerPlugin(ScrollTrigger);

type AboutSectionProps = {
  about: AboutContent;
};

export function AboutSection({ about }: AboutSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      timeline
        .fromTo(
          "[data-about-frame]",
          {
            width: "11.1rem",
            height: "10.4rem",
            borderRadius: "0.15rem",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
          },
          {
            width: "100vw",
            height: "100vh",
            borderRadius: "0rem",
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            ease: "none",
            duration: 0.42,
          },
          0,
        )
        .fromTo(
          "[data-about-scene]",
          {
            scale: 1.22,
          },
          {
            scale: 1,
            ease: "none",
            duration: 1,
          },
          0,
        )
        .fromTo(
          "[data-about-manifesto]",
          {
            opacity: 0,
            y: 36,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.22,
          },
          0.2,
        )
        .fromTo(
          "[data-about-practice]",
          {
            opacity: 0,
            y: 26,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.2,
          },
          0.28,
        )
        .fromTo(
          "[data-about-portrait]",
          {
            yPercent: 18,
            scale: 1.08,
            opacity: 0.55,
          },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            duration: 0.4,
          },
          0.18,
        )
        .to(
          "[data-about-copy]",
          {
            opacity: 0.08,
            y: -56,
            duration: 0.18,
          },
          0.54,
        )
        .fromTo(
          "[data-about-stats]",
          {
            opacity: 0,
            y: 88,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
          },
          0.58,
        )
        .fromTo(
          "[data-about-footer-tag]",
          {
            opacity: 0,
            y: 22,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
          },
          0.64,
        )
        .to(
          "[data-about-wash]",
          {
            opacity: 0.16,
            duration: 0.9,
          },
          0,
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="about" ref={rootRef}>
      <div className={styles.pinStage}>
        <div className={styles.frame} data-about-frame>
          <div className={styles.scene} data-about-scene>
            <img
              src={about.heroImage}
              alt=""
              aria-hidden="true"
              className={styles.portrait}
              data-about-portrait
            />
            <div className={styles.sceneWash} aria-hidden="true" data-about-wash />

            <div className={styles.copyCluster} data-about-copy>
              <div className={styles.manifesto}>
                {about.manifesto.map((line) => (
                  <p key={line} data-about-manifesto>
                    {line}
                  </p>
                ))}
              </div>

              <div className={styles.practice}>
                {about.practice.map((line) => (
                  <p key={line} data-about-practice>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.stats} data-about-stats>
              {about.stats.map((group) => (
                <div key={group.label} className={styles.statRow}>
                  <p className={styles.statLabel}>{group.label}</p>
                  <div className={styles.statValues}>
                    {group.values.map((value) => (
                      <p key={value}>{value}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footerTag} data-about-footer-tag>
              <span>{about.eyebrow}</span>
              <span>AARAV MIRELLE STUDIO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
