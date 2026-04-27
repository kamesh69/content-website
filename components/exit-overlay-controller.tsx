"use client";

import { useExitOverlayTimer } from "@/hooks/use-exit-overlay-timer";

import styles from "./exit-overlay-controller.module.scss";

export function ExitOverlayController() {
  const { armed, visible, trigger, dismiss } = useExitOverlayTimer();

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="exit-title">
      <div className={styles.media} aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
        >
          <source
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className={styles.panel}>
        <p className="eyebrow">Exit overlay {armed ? "armed" : "inactive"}</p>
        <h2 id="exit-title">Don&apos;t disappear just yet.</h2>
        <p>
          The leave state has been active for this session for more than ten minutes, so this
          branded overlay appears on interceptable leave actions.
        </p>
        <p className={styles.meta}>Triggered by: {trigger ?? "unknown"}</p>
        <button type="button" onClick={dismiss}>
          Return to the site
        </button>
      </div>
    </div>
  );
}
