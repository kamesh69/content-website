"use client";

import { useEffect, useRef, useState } from "react";

const TEN_MINUTES = 10 * 60 * 1000;
const SESSION_START_KEY = "studio-replica-session-start";

export function useExitOverlayTimer() {
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [trigger, setTrigger] = useState<"outbound" | "history" | "hidden" | null>(null);
  const armedRef = useRef(false);

  useEffect(() => {
    armedRef.current = armed;
  }, [armed]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const existingSessionStart = window.sessionStorage.getItem(SESSION_START_KEY);
    const now = Date.now();
    const sessionStart = existingSessionStart ? Number(existingSessionStart) : now;

    if (!existingSessionStart) {
      window.sessionStorage.setItem(SESSION_START_KEY, String(sessionStart));
    }

    const remaining = TEN_MINUTES - (now - sessionStart);

    if (remaining <= 0) {
      setArmed(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setArmed(true);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const link = target.closest("a");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      const targetBlank = link.getAttribute("target") === "_blank";
      const isExternal =
        href !== null &&
        (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:"));

      if (targetBlank || isExternal) {
        if (!armedRef.current) {
          return;
        }

        setTrigger("outbound");
        setVisible(true);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && armedRef.current) {
        setTrigger("hidden");
        setVisible(true);
      }
    };

    const onPopState = () => {
      if (!armedRef.current) {
        return;
      }

      setTrigger("history");
      setVisible(true);
      window.history.pushState({ studioReplica: true }, "", window.location.href);
    };

    window.history.pushState({ studioReplica: true }, "", window.location.href);
    window.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return {
    armed,
    visible,
    trigger,
    dismiss: () => setVisible(false),
  };
}
