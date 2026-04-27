"use client";

import Link from "next/link";
import { useState } from "react";

import type { Project } from "@/lib/types";

import styles from "./retro-tv-project-card.module.scss";

type RetroTVProjectCardProps = {
  project: Project;
  active: boolean;
  onHover: () => void;
};

export function RetroTVProjectCard({ project, active, onHover }: RetroTVProjectCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);

  return (
    <>
      <article
        className={`${styles.card} ${active ? styles.active : ""}`}
        onMouseEnter={onHover}
        onFocus={onHover}
      >
        <div className={styles.copy}>
          <p className={styles.year}>{project.year}</p>
          <h3>{project.title}</h3>
          <p className={styles.summary}>{project.summary}</p>
          <div className={styles.services}>
            {project.services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => setGalleryOpen(true)}>
              Open gallery
            </button>
            <Link href={project.link} target="_blank" rel="noreferrer">
              Visit project
            </Link>
          </div>
        </div>
        <div className={styles.tvShell}>
          <div className={styles.tvFrame}>
            <div className={styles.glow} />
            <div className={styles.screen}>
              <video
                className={styles.video}
                src={project.tvVideo}
                poster={project.coverImage}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
            <div className={styles.controls}>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </article>
      {galleryOpen ? (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={project.title}>
          <button className={styles.close} type="button" onClick={() => setGalleryOpen(false)}>
            Close
          </button>
          <div className={styles.gallery}>
            {project.gallery.map((image) => (
              <img key={image} src={image} alt={`${project.title} gallery frame`} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
