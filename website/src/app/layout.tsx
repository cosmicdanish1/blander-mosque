import type { Metadata } from "next";
import type { Viewport } from "next";
import { Marcellus, Onest } from "next/font/google";
import { ThemeProvider, themeNoFlashScript } from "@/components/site/ThemeProvider";
import { MOSQUE } from "@/data/mosque";
import "./globals.css";

const display = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Onest({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: `${MOSQUE.name} — Bhilai, Chhattisgarh`,
    template: `%s · ${MOSQUE.shortName}`,
  },
  description:
    "A scroll-led architectural story and the living home of the Sector 6 Jama Masjid in Bhilai — prayer times, programmes, services, and ways to visit.",
};

export const viewport: Viewport = {
  themeColor: "#08101f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
