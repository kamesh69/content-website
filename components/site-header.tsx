"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

import { editorialNavigation, navigation, site } from "@/lib/content/site";

import styles from "./site-header.module.scss";

type SiteHeaderProps = {
  variant?: "default" | "editorial";
  contactHref?: string;
};

type NavAnchorProps = {
  href: string;
  className: string;
  onClick?: () => void;
  children: ReactNode;
  "aria-current"?: "page";
};

function NavAnchor({ href, className, onClick, children, ...rest }: NavAnchorProps) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export function SiteHeader({ variant = "default", contactHref }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const editorial = variant === "editorial";
  const pathname = usePathname();

  const items = (editorial ? editorialNavigation : navigation).map((item) => {
    if (!editorial || !contactHref) return item;
    if (item.label === "Let’s Talk" || item.label === "Contact") {
      return { ...item, href: contactHref };
    }
    return item;
  });

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

    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeAndNavigate = () => setOpen(false);

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !open) return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("a, button");
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  };

  const headerClass = [
    styles.header,
    scrolled ? styles.scrolled : "",
    editorial ? styles.editorial : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className={`section-shell ${styles.inner}`}>
        <NavAnchor href={editorial ? "/" : "#top"} className={styles.brand} onClick={closeAndNavigate}>
          <span className={styles.name}>{site.name}</span>
          {editorial ? null : <span className={styles.role}>{site.role}</span>}
        </NavAnchor>

        <nav className={styles.desktopNav} aria-label="Primary">
          {items.map((item, index) => (
            <NavAnchor
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={`${styles.navLink} ${editorial && index === items.length - 1 ? styles.navCta : ""}`}
              aria-current={item.href === "/blog" && (pathname.startsWith("/blog") || pathname.startsWith("/articles")) ? "page" : undefined}
            >
              {item.label}
            </NavAnchor>
          ))}
        </nav>

        {editorial ? null : (
          <a href={contactHref ?? "#contact"} className={styles.cta}>
            Work with me
          </a>
        )}

        <button
          ref={buttonRef}
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
        ref={panelRef}
        id={menuId}
        className={`${styles.mobilePanel} ${open ? styles.mobileOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        hidden={!open}
        onKeyDown={onPanelKeyDown}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {items.map((item, index) => (
            <NavAnchor
              key={`${item.label}-${item.href}-mobile`}
              href={item.href}
              className={`${styles.mobileLink} ${editorial && index === items.length - 1 ? styles.mobileCtaLink : ""}`}
              onClick={closeAndNavigate}
              aria-current={item.href === "/blog" && (pathname.startsWith("/blog") || pathname.startsWith("/articles")) ? "page" : undefined}
            >
              {item.label}
            </NavAnchor>
          ))}
          {editorial ? null : (
            <a href={contactHref ?? "#contact"} className={styles.mobileCta} onClick={closeAndNavigate}>
              Work with me
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
