import styles from "./article-intro.module.scss";

type ArticleIntroProps = {
  text: string;
};

export function ArticleIntro({ text }: ArticleIntroProps) {
  return <p className={styles.intro}>{text}</p>;
}
