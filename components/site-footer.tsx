import Link from "next/link";

import { navigation, site, socialLinks } from "@/lib/content/site";

import styles from "./site-footer.module.scss";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`section-shell ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.role}>{site.role}</p>
        </div>

        <nav className={styles.nav} aria-label="Footer">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.social}>
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className={`section-shell ${styles.meta}`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className={styles.legal}>
          <Link href="/imprint">Imprint</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/blog">Writing</Link>
        </div>
      </div>
    </footer>
  );
}
