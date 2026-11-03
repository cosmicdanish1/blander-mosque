import { StoryChapterData } from "./story-data";
import styles from "./story.module.css";

type Props = {
  chapter: StoryChapterData;
  index: number;
  active: boolean;
};

export function StoryChapter({ chapter, index, active }: Props) {
  return (
    <section
      id={chapter.id}
      className={`${styles.chapter} ${styles[chapter.align]} ${
        chapter.tone ? styles[chapter.tone] : ""
      } ${active ? styles.active : ""}`}
      data-active={active ? "true" : "false"}
      aria-label={`${index + 1}. ${chapter.title}`}
    >
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
        <p className={styles.description}>{chapter.body}</p>
        {index === 0 && (
          <div className={styles.scrollCue} aria-hidden="true">
            <span />
            Scroll to enter
          </div>
        )}
      </div>
    </section>
  );
}
