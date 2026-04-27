"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { HeroContent } from "@/lib/types";

import styles from "./hero-scene.module.scss";

gsap.registerPlugin(ScrollTrigger);

type HeroSceneProps = {
  hero: HeroContent;
};

export function HeroScene({ hero }: HeroSceneProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from("[data-intro-line]", {
        yPercent: 110,
        opacity: 0,
        duration: 1.15,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from("[data-intro-copy]", {
        opacity: 0,
        y: 30,
        duration: 0.9,
        delay: 0.35,
        stagger: 0.1,
      });

      gsap.to("[data-bg]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          scrub: true,
          start: "top top",
          end: "bottom top",
        },
      });

      gsap.to("[data-commandments]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          scrub: true,
          start: "top top",
          end: "bottom top",
        },
      });

      gsap.to("[data-logo-wall]", {
        xPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          scrub: true,
          start: "top top",
          end: "bottom top",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.intro} id="home" ref={rootRef}>
      <div className={styles.trigger} />
      <div className={styles.bgScaler} data-bg>
        <div
          className={styles.bg}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(9, 9, 9, 0.08), rgba(9, 9, 9, 0.85)), url(${hero.backgroundImage})`,
          }}
        />
      </div>
      <div className={styles.overlayGrid}>
        <p className={styles.topCopy} data-intro-copy>
          {hero.topCopy}
        </p>
        <div className={styles.commandments} data-commandments>
          <p>
            {hero.commandments.concat(hero.commandments).concat(hero.commandments).join(" ")}
          </p>
        </div>
        <div className={styles.center}>
          <div className={styles.centerMask}>
            <div className={styles.centerCard}>
              <div className={styles.monogram}>{hero.sideMonogram}</div>
            </div>
          </div>
          <div className={styles.centerText}>
            <span className={styles.topTitle} data-intro-line>
              {hero.titleTop}
            </span>
            <span className={styles.name} data-intro-line>
              {hero.titleBottom}
            </span>
            <span className={styles.accent} data-intro-line>
              {hero.titleAccent}
            </span>
            <span className={styles.caption} data-intro-copy>
              {hero.centerCaption}
            </span>
            <span className={styles.noise} data-intro-copy>
              ©®█§§ ¦ #░░▀▄░░
            </span>
          </div>
        </div>
        <div className={styles.logoWall} data-logo-wall>
          {hero.logoWallLabel}
        </div>
        <p className={styles.bottomCopy} data-intro-copy>
          {hero.bottomCopy}
        </p>
        <div className={styles.floatingBox} data-intro-copy>
          <p className={styles.boxTitle}>{hero.floatingCardTitle}</p>
          <p>{hero.floatingCardBody}</p>
          <div className={styles.metrics}>
            {hero.metrics.map((metric) => (
              <span key={metric}>{metric}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
