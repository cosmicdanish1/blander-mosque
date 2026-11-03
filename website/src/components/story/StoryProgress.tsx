import { storyChapters } from "./story-data";
import styles from "./story.module.css";

type Props = { progress: number; activeChapter: number };

export function StoryProgress({ progress, activeChapter }: Props) {
  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={styles.progress} aria-label="Story chapters">
      <p aria-live="polite">
        <span>{String(activeChapter + 1).padStart(2, "0")}</span>
        <span className={styles.progressTotal}>
          {String(storyChapters.length).padStart(2, "0")}
        </span>
      </p>
      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ transform: `scaleY(${progress})` }} />
      </div>
      <div className={styles.chapterDots}>
        {storyChapters.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            className={index === activeChapter ? styles.dotActive : ""}
            aria-label={`Go to ${chapter.title}`}
            aria-current={index === activeChapter ? "step" : undefined}
            onClick={() => goTo(chapter.id)}
          />
        ))}
      </div>
    </nav>
  );
}
