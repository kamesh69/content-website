"use client";

import { Application, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";

import styles from "./pixel-curtain.module.scss";

export function PixelCurtain() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;

    if (!mountNode) {
      return;
    }

    let cancelled = false;
    let app: Application | null = null;

    const setup = async () => {
      app = new Application();

      await app.init({
        width: mountNode.clientWidth,
        height: mountNode.clientHeight,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (cancelled || !app) {
        app?.destroy(true, { children: true });
        return;
      }

      const pixiApp = app;

      mountNode.appendChild(app.canvas);

      const bars = Array.from({ length: 18 }, (_, index) => {
        const bar = new Graphics();
        const width = 6 + (index % 3) * 4;
        const x = (mountNode.clientWidth / 18) * index;

        bar.rect(0, 0, width, mountNode.clientHeight);
        bar.fill({ color: index % 2 === 0 ? 0xde563a : 0x677cff, alpha: 0.16 + (index % 4) * 0.04 });
        bar.x = x;
        bar.y = 0;
        pixiApp.stage.addChild(bar);

        return { bar, index };
      });

      pixiApp.ticker.add((ticker) => {
        bars.forEach(({ bar, index }) => {
          bar.alpha = 0.14 + Math.sin(ticker.lastTime * 0.0016 + index) * 0.06;
          bar.scale.y = 0.92 + Math.sin(ticker.lastTime * 0.0011 + index * 0.4) * 0.12;
        });
      });

      const resize = () => {
        if (!app || !mountRef.current) {
          return;
        }

        const nextWidth = mountRef.current.clientWidth;
        const nextHeight = mountRef.current.clientHeight;

        app.renderer.resize(nextWidth, nextHeight);
        bars.forEach(({ bar, index }) => {
          bar.clear();
          const width = 6 + (index % 3) * 4;
          bar.rect(0, 0, width, nextHeight);
          bar.fill({
            color: index % 2 === 0 ? 0xde563a : 0x677cff,
            alpha: 0.16 + (index % 4) * 0.04,
          });
          bar.x = (nextWidth / 18) * index;
        });
      };

      window.addEventListener("resize", resize);
      app.canvas.dataset.resizeBound = "true";
      app.canvas.dataset.resizeHandler = "pixel-curtain";

      return () => {
        window.removeEventListener("resize", resize);
      };
    };

    let cleanupResize: (() => void) | undefined;

    setup().then((cleanup) => {
      cleanupResize = cleanup;
    });

    return () => {
      cancelled = true;
      cleanupResize?.();
      app?.destroy(true, { children: true });
    };
  }, []);

  return <div className={styles.curtain} ref={mountRef} aria-hidden="true" />;
}
