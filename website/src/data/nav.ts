export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };

export const PRIMARY_NAV: NavLink[] = [
  { label: "Prayer Times", href: "/prayer-times" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/visit" },
  { label: "Events", href: "/events" },
  { label: "Media", href: "/gallery" },
  { label: "Learn", href: "/resources" },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Visit & Pray",
    links: [
      { label: "Prayer Times", href: "/prayer-times" },
      { label: "Qibla Finder", href: "/qibla" },
      { label: "Visit & Location", href: "/visit" },
      { label: "Ramadan & Eid", href: "/ramadan" },
    ],
  },
  {
    label: "Community",
    links: [
      { label: "Events & Programs", href: "/events" },
      { label: "Volunteer & Membership", href: "/volunteer" },
      { label: "Donate", href: "/donate" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Media & Learn",
    links: [
      { label: "Gallery", href: "/gallery" },
      { label: "Live Stream", href: "/live" },
      { label: "Sermons", href: "/sermons" },
      { label: "Articles", href: "/blog" },
      { label: "Resources & FAQ", href: "/resources" },
    ],
  },
  {
    label: "The Mosque",
    links: [
      { label: "The Story", href: "/" },
      { label: "About & Architecture", href: "/about" },
    ],
  },
];
