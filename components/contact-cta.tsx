import styles from "./contact-cta.module.scss";

type ContactCTAProps = {
  heading?: string;
  subheading?: string;
  label?: string;
  href?: string;
};

export function ContactCTA({
  heading = "Liked the content?",
  subheading = "Let’s talk about what the right words could do for your brand.",
  label = "CONNECT WITH ME →",
  href = "#contact-form",
}: ContactCTAProps) {
  return (
    <section className={styles.cta} aria-labelledby="article-contact-heading">
      <h2 id="article-contact-heading" className={styles.heading}>
        {heading}
      </h2>
      <p className={styles.subheading}>{subheading}</p>
      <a href={href} className={styles.link}>
        {label}
      </a>
    </section>
  );
}
