import Image from "next/image";
import { storyChapters } from "./story-data";
import styles from "./story.module.css";

export function WebGLFallback() {
  return (
    <div className={styles.fallback}>
      <Image
        src="/images/mosque-fallback.png"
        alt="Three-quarter architectural view of the Sector 6 Mosque"
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.fallbackShade} />
      <div className={styles.fallbackCopy}>
        <p>{storyChapters[0].eyebrow}</p>
        <h1>{storyChapters[0].title}</h1>
        <span>{storyChapters[0].body}</span>
      </div>
    </div>
  );
}
