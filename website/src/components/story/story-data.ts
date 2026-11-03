export type StoryChapterData = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  align: "left" | "right" | "center";
  tone?: "hero" | "quiet" | "final";
};

export const storyChapters: StoryChapterData[] = [
  {
    id: "arrival",
    eyebrow: "Sector 6 · Bhilai, Chhattisgarh",
    title: "Sector 6 Mosque",
    body: "A place shaped by prayer, craft, and the life of its community.",
    align: "center",
    tone: "hero",
  },
  {
    id: "light",
    eyebrow: "01 · Light",
    title: "A name held in light",
    body: "Particles gather into the Arabic word Allah, a brief moment of stillness before architecture takes form.",
    align: "center",
    tone: "quiet",
  },
  {
    id: "making",
    eyebrow: "02 · Making",
    title: "Raised from the ground",
    body: "Foundation, walls, arches, dome, and minaret arrive in sequence. Each course reveals how many parts become one place.",
    align: "left",
  },
  {
    id: "arcade",
    eyebrow: "03 · Threshold",
    title: "The front arcade",
    body: "A rhythm of pointed arches creates a sheltered edge between the open courtyard and the prayer spaces within.",
    align: "right",
  },
  {
    id: "hall",
    eyebrow: "04 · Gathering",
    title: "The prayer hall",
    body: "The main interior brings worshippers together in aligned rows for congregational prayer and reflection.",
    align: "left",
  },
  {
    id: "jali",
    eyebrow: "05 · Pattern",
    title: "The jali screens",
    body: "Geometric screens give the upper facade its identity, filtering light and air through a repeating field of ornament.",
    align: "right",
  },
  {
    id: "dome",
    eyebrow: "06 · Crown",
    title: "The ribbed dome",
    body: "Set above the central hall, the dome crowns the composition and makes the mosque legible across the neighborhood skyline.",
    align: "left",
  },
  {
    id: "minaret",
    eyebrow: "07 · Landmark",
    title: "The minaret",
    body: "The tall marble-clad tower acts as a civic marker, carrying the familiar architectural presence associated with the call to prayer.",
    align: "right",
  },
  {
    id: "whole",
    eyebrow: "08 · One place",
    title: "Architecture becomes community",
    body: "Every threshold, screen, arch, and vertical marker returns to a single purpose: a shared place for worship, learning, service, and care.",
    align: "center",
    tone: "final",
  },
];
