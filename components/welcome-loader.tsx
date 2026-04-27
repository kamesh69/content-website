"use client";

import { useEffect, useState } from "react";

import styles from "./welcome-loader.module.scss";

const STORAGE_KEY = "studio-replica-loader-seen";

export function WelcomeLoader() {
  const [visible, setVisible] = useState(true);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const hasSeenLoader = window.sessionStorage.getItem(STORAGE_KEY) === "true";
    const duration = hasSeenLoader ? 900 : 2500;

    setCompact(hasSeenLoader);
    window.sessionStorage.setItem(STORAGE_KEY, "true");

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.loader} ${compact ? styles.compact : ""}`} aria-hidden="true">
      <div className={styles.lines}>
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className={styles.line}
            style={{ animationDelay: `${index * 35}ms` }}
          />
        ))}
      </div>
      <div className={styles.words}>
        <span className={styles.kicker}>Loading /home</span>
        <strong>AARAV</strong>
        <strong>MIRELLE</strong>
        <p>Portfolio V</p>
      </div>
    </div>
  );
}
