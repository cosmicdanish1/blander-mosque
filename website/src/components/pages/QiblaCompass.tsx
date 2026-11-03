"use client";

import { useEffect, useState } from "react";
import { MOSQUE } from "@/data/mosque";
import { qiblaBearing, qiblaDistance } from "@/lib/qibla";
import { Icon } from "@/components/ui/Icon";

type OrientationEventiOS = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};
type DOE = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export function QiblaCompass() {
  const bearing = qiblaBearing(MOSQUE.coords.lat, MOSQUE.coords.lng);
  const distance = qiblaDistance(MOSQUE.coords.lat, MOSQUE.coords.lng);
  const [heading, setHeading] = useState<number | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "DeviceOrientationEvent" in window);
  }, []);

  const enableCompass = async () => {
    const DOEClass = window.DeviceOrientationEvent as unknown as DOE;
    try {
      if (typeof DOEClass?.requestPermission === "function") {
        const res = await DOEClass.requestPermission();
        if (res !== "granted") return;
      }
    } catch {
      /* ignore */
    }
    const onOrient = (e: DeviceOrientationEvent) => {
      const iosHeading = (e as OrientationEventiOS).webkitCompassHeading;
      if (typeof iosHeading === "number") setHeading(iosHeading);
      else if (typeof e.alpha === "number") setHeading(360 - e.alpha);
    };
    window.addEventListener("deviceorientation", onOrient, true);
  };

  // Rotate the dial opposite to the device heading so North points to real north.
  const dialRotation = heading != null ? -heading : 0;

  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>
      <div className="glass-strong" style={{ padding: "clamp(24px, 4vw, 44px)", display: "grid", placeItems: "center" }}>
        <div style={{ position: "relative", width: "min(74vw, 320px)", aspectRatio: 1 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid var(--glass-border)",
              background: "radial-gradient(circle at 50% 30%, color-mix(in oklch, var(--accent) 8%, transparent), transparent 60%)",
              transform: `rotate(${dialRotation}deg)`,
              transition: "transform 240ms ease-out",
            }}
          >
            {["N", "E", "S", "W"].map((d, i) => (
              <span
                key={d}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 90}deg) translateY(calc(-50% - 44%)) rotate(${-i * 90 - dialRotation}deg)`,
                  color: d === "N" ? "var(--accent)" : "var(--muted)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {d}
              </span>
            ))}
            {/* Qibla needle */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 4,
                height: "42%",
                transformOrigin: "bottom center",
                transform: `translate(-50%, -100%) rotate(${bearing}deg)`,
                background: "linear-gradient(to top, transparent, var(--accent))",
                borderRadius: 4,
                filter: "drop-shadow(0 0 6px color-mix(in oklch, var(--accent) 70%, transparent))",
              }}
            />
            <div style={{ position: "absolute", top: "50%", left: "50%", width: 14, height: 14, borderRadius: "50%", background: "var(--accent)", transform: "translate(-50%, -50%)" }} />
          </div>
          <span style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
            <Icon name="mosque" size={18} />
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <div className="glass" style={{ padding: 24 }}>
          <p className="eyebrow">Qibla direction</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontSize: "clamp(40px, 6vw, 62px)", color: "var(--accent)", marginTop: 8 }}>
            {bearing.toFixed(1)}°
          </p>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>from true North, toward the Kaaba in Makkah</p>
        </div>
        <div className="glass" style={{ padding: 24 }}>
          <p className="eyebrow">Distance to the Kaaba</p>
          <p style={{ fontFamily: "var(--font-display-family)", fontSize: "clamp(28px, 4vw, 40px)", color: "var(--text)", marginTop: 8 }}>
            {Math.round(distance).toLocaleString("en-US")} km
          </p>
        </div>
        {supported && (
          <button type="button" className="btn btn-primary" style={{ justifyContent: "center" }} onClick={enableCompass}>
            {heading != null ? "Compass active" : "Use my phone's compass"} <Icon name="compass" size={16} />
          </button>
        )}
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          Bearing is calculated for the mosque&rsquo;s location in Sector 6, Bhilai. On a
          phone, enable the compass and keep the device flat; the dial turns so the
          gold needle points to the qibla.
        </p>
      </div>
    </div>
  );
}
