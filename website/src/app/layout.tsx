import type { Metadata } from "next";
import type { Viewport } from "next";
import { Marcellus, Onest } from "next/font/google";
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
  title: "Sector 6 Mosque | An Architectural Story",
  description:
    "A scroll-led architectural journey through the Sector 6 Mosque in Bhilai, Chhattisgarh.",
};

export const viewport: Viewport = {
  themeColor: "#08101f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
