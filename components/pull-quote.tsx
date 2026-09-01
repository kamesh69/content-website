import styles from "./pull-quote.module.scss";

type PullQuoteProps = {
  quote: string;
};

export function PullQuote({ quote }: PullQuoteProps) {
  const display = quote.replace(/^["“]|["”]$/g, "");

  return (
    <blockquote className={styles.quote}>
      <p className={styles.text}>“{display}”</p>
    </blockquote>
  );
}
