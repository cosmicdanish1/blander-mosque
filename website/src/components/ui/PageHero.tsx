import Image from "next/image";
import { Reveal } from "./Reveal";
import styles from "./ui.module.css";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: string;
  image?: string;
  actions?: React.ReactNode;
};

export function PageHero({ eyebrow, title, lede, image, actions }: PageHeroProps) {
  return (
    <header className={styles.hero}>
      {image && (
        <Image
          className={styles.heroBg}
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
        />
      )}
      <div className={styles.heroWash} />
      <div className="container">
        <Reveal className={styles.heroInner}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={styles.heroTitle}>{title}</h1>
          {lede && <p className={`lede ${styles.heroLede}`}>{lede}</p>}
          {actions && <div className={styles.heroActions}>{actions}</div>}
        </Reveal>
      </div>
    </header>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal className={styles.head}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={styles.headTitle}>{title}</h2>
      {lede && <p className={`lede ${styles.headLede}`}>{lede}</p>}
    </Reveal>
  );
}
