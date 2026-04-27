"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { SectionNavItem } from "@/lib/types";

import styles from "./section-nav.module.scss";

type SectionNavProps = {
  items: SectionNavItem[];
};

export function SectionNav({ items }: SectionNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`} aria-label="Primary">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={styles.link}>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
