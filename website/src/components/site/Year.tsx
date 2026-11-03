"use client";

import { useEffect, useState } from "react";

/** Renders the current year on the client (avoids Date during prerender). */
export function Year() {
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}
