type IconName =
  | "clock"
  | "pin"
  | "calendar"
  | "heart"
  | "mail"
  | "phone"
  | "compass"
  | "book"
  | "play"
  | "users"
  | "star"
  | "moon"
  | "arrow"
  | "mosque"
  | "image"
  | "hands"
  | "quran";

const PATHS: Record<IconName, React.ReactNode> = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2.5" /><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" /></>,
  heart: <path d="M12 20s-7-4.3-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.7 12 20 12 20Z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  phone: <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 17l4 1.5v3a1.5 1.5 0 0 1-1.7 1.5A17 17 0 0 1 4 6.7 1.5 1.5 0 0 1 5.5 5" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>,
  book: <><path d="M5 5.5A2 2 0 0 1 7 4h11v14H7a2 2 0 0 0-2 2V5.5Z" /><path d="M5 18.5A2 2 0 0 1 7 20h11" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5-3.5-5-3.5Z" fill="currentColor" stroke="none" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3.2 3.2 0 0 1 0 6M17 20a5.5 5.5 0 0 0-2-4.3" /></>,
  star: <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.2L12 16.8l-4.6 2.4.9-5.2L4.5 9.6l5.2-.7L12 4Z" />,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  arrow: <path d="M5 12h13m-5-5 5 5-5 5" />,
  mosque: <><path d="M4 20v-7h16v7M4 13c0-3 4-4 4-7 0 3 4 4 4 7M12 6c0 3 4 4 4 7M9 20v-3a3 3 0 0 1 6 0v3" /><path d="M12 2.5c1.2 1 1.2 2.2 0 3.2-1.2-1-1.2-2.2 0-3.2Z" /></>,
  image: <><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="8.5" cy="10" r="1.6" /><path d="m4 17 5-4 4 3 3-2 4 3" /></>,
  hands: <path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0 0V5a1.5 1.5 0 0 1 3 0v6m0 0V6.5a1.5 1.5 0 0 1 3 0V13a6 6 0 0 1-6 6h-1a5 5 0 0 1-4.3-2.5L3 13.5a1.6 1.6 0 0 1 2.4-2L7 13" />,
  quran: <><path d="M12 6c-1.5-1.3-3.6-2-6-2v13c2.4 0 4.5.7 6 2 1.5-1.3 3.6-2 6-2V4c-2.4 0-4.5.7-6 2Z" /><path d="M12 6v13" /></>,
};

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
