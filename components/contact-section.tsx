import Link from "next/link";

import { DoorGraphicLayer } from "@/components/door-graphic-layer";
import type { ContactBlock, DoorGraphic } from "@/lib/types";

import styles from "./contact-section.module.scss";

type ContactSectionProps = {
  contact: ContactBlock;
  doors: DoorGraphic[];
};

export function ContactSection({ contact, doors }: ContactSectionProps) {
  return (
    <section className={styles.section} id="contact">
      <DoorGraphicLayer doors={doors} />
      <div className={`section-shell ${styles.inner}`}>
        <div className={styles.finishStrong}>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>{contact.finishStrongTitle}</h2>
          <p>{contact.finishStrongBody}</p>
        </div>

        <div className={styles.footerGrid}>
          <div className={styles.emailBox}>
            <p className={styles.footerHeading}>{contact.heading}</p>
            <a href={`mailto:${contact.email}`} className={styles.email}>
              {contact.email}
            </a>
            <ul className={styles.details}>
              {contact.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className={styles.socialBox}>
            <p className={styles.footerHeading}>Follow me:</p>
            {contact.socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.legalBox}>
            <p className={styles.footerHeading}>Legal:</p>
            {contact.legalLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.studioBox}>
            <p className={styles.footerHeading}>Studio:</p>
            {contact.studioLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
