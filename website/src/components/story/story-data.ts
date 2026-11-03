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
    body: "A place shaped by prayer, craft, and the life of its community — rebuilt here, piece by piece, as you scroll.",
    align: "center",
    tone: "hero",
  },
  {
    id: "light",
    eyebrow: "01 · Light",
    title: "A name held in light",
    body: "Before the first stone, particles gather into the Arabic word Allah — a brief stillness, then they scatter and the ground is cleared.",
    align: "center",
    tone: "quiet",
  },
  {
    id: "making",
    eyebrow: "02 · Making",
    title: "Built the way it was built",
    body: "Nothing simply floats into place. Walls are laid in stone courses, screens are drawn in light, and the tall forms rise out of their own base — each part assembled the way its craft demands.",
    align: "left",
  },
  {
    id: "arcade",
    eyebrow: "03 · Threshold",
    title: "Arches drawn in light",
    body: "The front arcade materialises as architecture: a line sweeps up each pier and pointed arch, carving a sheltered edge between the courtyard and the prayer spaces within.",
    align: "right",
  },
  {
    id: "hall",
    eyebrow: "04 · Gathering",
    title: "Walls laid in stone",
    body: "The prayer hall is raised course by course. Masonry climbs from the foundation to the terrace, bringing worshippers together in aligned rows for congregational prayer.",
    align: "left",
  },
  {
    id: "jali",
    eyebrow: "05 · Pattern",
    title: "The jali screens",
    body: "Geometric screens are traced into place like a working drawing, filtering light and air through a repeating field of ornament that gives the upper facade its identity.",
    align: "right",
  },
  {
    id: "dome",
    eyebrow: "06 · Crown",
    title: "The ribbed dome rises",
    body: "Set above the central hall, the dome emerges in one piece — a single solid form lifting out of its drum to crown the composition and mark the skyline.",
    align: "left",
  },
  {
    id: "minaret",
    eyebrow: "07 · Landmark",
    title: "The minaret extends",
    body: "The marble-clad tower draws upward out of its base as a single shaft, its crown and finial rod extending last — a civic marker carrying the presence of the call to prayer.",
    align: "right",
  },
  {
    id: "whole",
    eyebrow: "08 · One place",
    title: "Architecture becomes community",
    body: "Stone, screen, arch, dome, and vertical marker return to a single purpose: a shared place for worship, learning, service, and care.",
    align: "center",
    tone: "final",
  },
];
