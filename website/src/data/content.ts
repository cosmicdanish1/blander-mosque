/**
 * Placeholder content for the frontend. Everything here is sample data so the
 * pages feel complete; replace with a CMS/backend later without touching the UI.
 */

export type EventItem = {
  id: string;
  title: string;
  category: "Weekly" | "Class" | "Community" | "Special";
  day: string;
  time: string;
  summary: string;
  recurring?: boolean;
};

export const EVENTS: EventItem[] = [
  { id: "jummah", title: "Jummah Prayer & Khutbah", category: "Weekly", day: "Every Friday", time: "1:30 PM", summary: "The main congregational prayer of the week, preceded by the sermon.", recurring: true },
  { id: "quran-class", title: "Qur'an & Tajweed Circle", category: "Class", day: "Tue & Thu", time: "6:30 PM", summary: "Recitation and pronunciation practice for all ages and levels.", recurring: true },
  { id: "kids-madrasa", title: "Children's Madrasa", category: "Class", day: "Sat & Sun", time: "9:00 AM", summary: "Weekend classes in Qur'an, akhlaq, and the basics of faith.", recurring: true },
  { id: "community-iftar", title: "Community Dinner", category: "Community", day: "Last Saturday", time: "7:30 PM", summary: "A shared meal open to neighbours of every background.", recurring: true },
  { id: "youth-halaqa", title: "Youth Halaqa", category: "Weekly", day: "Every Sunday", time: "5:00 PM", summary: "Discussion circle for teens and young adults.", recurring: true },
  { id: "eid-salah", title: "Eid Salah & Festival", category: "Special", day: "Eid mornings", time: "7:00 AM", summary: "Festival prayer followed by breakfast and celebration for families." },
];

export type Sermon = {
  id: string;
  title: string;
  speaker: string;
  series: string;
  date: string;
  length: string;
};

export const SERMONS: Sermon[] = [
  { id: "s1", title: "The Weight of Good Character", speaker: "Imam (placeholder)", series: "Friday Khutbah", date: "2026-10-30", length: "24 min" },
  { id: "s2", title: "Mercy in the Everyday", speaker: "Imam (placeholder)", series: "Friday Khutbah", date: "2026-10-23", length: "21 min" },
  { id: "s3", title: "Patience Through Hardship", speaker: "Guest Speaker", series: "Evening Lecture", date: "2026-10-18", length: "38 min" },
  { id: "s4", title: "Gratitude and the Heart", speaker: "Imam (placeholder)", series: "Friday Khutbah", date: "2026-10-16", length: "22 min" },
  { id: "s5", title: "The Rights of Neighbours", speaker: "Imam (placeholder)", series: "Friday Khutbah", date: "2026-10-09", length: "26 min" },
  { id: "s6", title: "Preparing the Soul for Ramadan", speaker: "Guest Speaker", series: "Seasonal Series", date: "2026-10-02", length: "41 min" },
];

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "winter-prayer-timetable",
    title: "Winter Prayer Timetable Now Available",
    category: "Announcement",
    date: "2026-11-01",
    excerpt: "Isha congregation moves earlier as the evenings draw in. Full monthly timetable inside.",
    body: [
      "As the days shorten, the congregational times shift with the sun. The Isha jama'ah will now be held earlier, and the full monthly timetable is available on the Prayer Times page and printed copies are at the entrance.",
      "Please arrive a few minutes early to make the rows. May Allah accept your prayers.",
    ],
  },
  {
    slug: "madrasa-enrolment-open",
    title: "Children's Madrasa Enrolment is Open",
    category: "Community",
    date: "2026-10-20",
    excerpt: "Weekend classes for ages 5–14 in Qur'an, character, and the basics of faith.",
    body: [
      "Enrolment for the weekend children's madrasa is now open for the new term. Classes cover Qur'an recitation, memorisation, Islamic character (akhlaq), and the fundamentals of faith in a warm, encouraging environment.",
      "Places are limited. Speak to a volunteer after Jummah or use the Contact page to register your interest.",
    ],
  },
  {
    slug: "restoration-of-the-jali-screens",
    title: "Caring for the Jali Screens",
    category: "Architecture",
    date: "2026-10-05",
    excerpt: "A short note on the geometric lattice screens that give the upper facade its identity.",
    body: [
      "The jali screens filter harsh light into a soft, patterned glow and keep air moving through the prayer hall. Their geometry is both practical and devotional — a reminder that beauty and function belong together.",
      "This article is placeholder content; replace it with the mosque's own history and announcements.",
    ],
  },
];

export type GalleryItem = {
  id: string;
  src: string;
  caption: string;
  tag: "Render" | "Detail" | "Exterior";
  wide?: boolean;
};

export const GALLERY: GalleryItem[] = [
  { id: "g1", src: "/images/render-front.png", caption: "Front elevation — the courtyard arcade and dome", tag: "Render", wide: true },
  { id: "g2", src: "/images/render-three-quarter.png", caption: "Three-quarter view with the minaret", tag: "Render" },
  { id: "g3", src: "/images/render-detail.png", caption: "Jali lattice and ribbed dome, up close", tag: "Detail" },
  { id: "g4", src: "/images/render-rear.png", caption: "Rear elevation and boundary wall", tag: "Render" },
  { id: "g5", src: "/images/mosque-fallback.png", caption: "The complete mosque at night", tag: "Exterior", wide: true },
];

export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  { q: "Is the mosque open to visitors of all faiths?", a: "Yes. Visitors of every faith and background are welcome. We simply ask that you dress modestly and observe quiet during prayer times." },
  { q: "What should I wear to visit?", a: "Modest clothing that covers the shoulders and knees. A head covering is appreciated for women inside the prayer hall; scarves are usually available to borrow at the entrance." },
  { q: "Where do I remove my shoes?", a: "Shoe racks are provided at the entrance to the prayer hall. Please remove footwear before stepping onto the prayer carpet." },
  { q: "Are women able to pray at the mosque?", a: "Yes, there is a dedicated prayer space for women. Please ask a volunteer to direct you on arrival." },
  { q: "How can I arrange a Nikah or Janazah?", a: "Please use the Contact page or speak to a volunteer. The mosque supports marriage (Nikah) and funeral (Janazah) services for the community." },
  { q: "Can I bring children?", a: "Absolutely. Families are welcome, and the weekend madrasa offers classes for children aged 5–14." },
];

export type DonationCause = {
  id: string;
  title: string;
  summary: string;
  raised: number;
  goal: number;
};

export const CAUSES: DonationCause[] = [
  { id: "operations", title: "Keep the Doors Open", summary: "Utilities, upkeep, and the daily running of the mosque.", raised: 384000, goal: 600000 },
  { id: "madrasa", title: "Support the Madrasa", summary: "Books, materials, and teachers for the children's classes.", raised: 142000, goal: 250000 },
  { id: "zakat", title: "Zakat & Welfare Fund", summary: "Distributed to those in need in the local community.", raised: 268000, goal: 400000 },
];

export const DONATION_AMOUNTS = [251, 501, 1100, 2100, 5100];

export type Service = {
  icon: "hands" | "users" | "heart" | "book" | "moon" | "star";
  title: string;
  body: string;
};

export const SERVICES: Service[] = [
  { icon: "book", title: "Qur'an & Islamic Education", body: "Weekend madrasa for children and recitation circles for adults." },
  { icon: "hands", title: "Nikah & Janazah", body: "Marriage ceremonies and funeral prayers, with guidance for families." },
  { icon: "heart", title: "Welfare & Zakat", body: "Food support and a welfare fund for neighbours facing hardship." },
  { icon: "users", title: "New Muslim Support", body: "A warm welcome, mentorship, and resources for those new to Islam." },
  { icon: "moon", title: "Ramadan Programmes", body: "Taraweeh, community iftars, and i'tikaf during the holy month." },
  { icon: "star", title: "Counselling & Advice", body: "Confidential, compassionate support for individuals and families." },
];

export const RESOURCES = [
  { title: "How to Pray (Salah) — Step by Step", kind: "Guide", href: "#" },
  { title: "A Beginner's Guide to Wudu", kind: "Guide", href: "#" },
  { title: "Understanding Zakat", kind: "Guide", href: "#" },
  { title: "Reading the Qur'an — Starter Resources", kind: "Links", href: "#" },
  { title: "New Muslim Welcome Pack", kind: "Download", href: "#" },
  { title: "Monthly Prayer Timetable (PDF)", kind: "Download", href: "#" },
];
