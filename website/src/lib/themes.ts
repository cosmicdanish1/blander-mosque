export type ThemeId = "sapphire" | "emerald" | "teal" | "marble";

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  mode: "dark" | "light";
  /** Swatch colours for the switcher (base, primary, accent). */
  swatch: [string, string, string];
};

export const THEMES: ThemeMeta[] = [
  {
    id: "sapphire",
    name: "Midnight Sapphire",
    mode: "dark",
    swatch: ["oklch(0.13 0.035 255)", "oklch(0.55 0.12 242)", "oklch(0.72 0.11 78)"],
  },
  {
    id: "emerald",
    name: "Emerald & Gold",
    mode: "dark",
    swatch: ["oklch(0.15 0.045 160)", "oklch(0.6 0.12 162)", "oklch(0.76 0.11 86)"],
  },
  {
    id: "teal",
    name: "Persian Teal",
    mode: "dark",
    swatch: ["oklch(0.16 0.05 210)", "oklch(0.62 0.12 198)", "oklch(0.72 0.11 66)"],
  },
  {
    id: "marble",
    name: "Desert Marble",
    mode: "light",
    swatch: ["oklch(0.95 0.012 85)", "oklch(0.55 0.09 50)", "oklch(0.6 0.1 72)"],
  },
];

export const DEFAULT_THEME: ThemeId = "sapphire";
export const THEME_STORAGE_KEY = "s6-theme";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

/** Background/fog tint the 3D landing scene uses per theme (keeps it cohesive). */
export const THEME_SCENE: Record<ThemeId, string> = {
  sapphire: "#08101f",
  emerald: "#07170f",
  teal: "#06171d",
  marble: "#17120b",
};
