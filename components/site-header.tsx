"use client";

import { useEffect, useId, useState } from "react";

import { navigation, site } from "@/lib/content/site";

import styles from "./site-header.module.scss";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    return () => document.body.classList.remove("nav-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeAndNavigate = () => setOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`section-shell ${styles.inner}`}>
        <a href="#top" className={styles.brand} onClick={closeAndNavigate}>
          <span className={styles.name}>{site.name}</span>
          <span className={styles.role}>{site.role}</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={styles.cta}>
          Work with me
        </a>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} aria-hidden="true" />
        </button>
      </div>

      <div
        id={menuId}
        className={`${styles.mobilePanel} ${open ? styles.mobileOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={styles.mobileLink} onClick={closeAndNavigate}>
              {item.label}
            </a>
          ))}
          <a href="#contact" className={styles.mobileCta} onClick={closeAndNavigate}>
            Work with me
          </a>
        </nav>
      </div>
    </header>
  );
}
