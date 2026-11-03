/**
 * Central mosque configuration.
 *
 * Coordinates and name are real (Sector 6, Bhilai). Contact details, hours and
 * narrative facts are PLACEHOLDERS for the frontend — swap for verified data
 * (or wire a backend) before going live.
 */
export const MOSQUE = {
  name: "Sector 6 Jama Masjid",
  shortName: "Sector 6 Masjid",
  tagline: "A living place of prayer, craft, and community in Bhilai.",
  city: "Bhilai",
  region: "Chhattisgarh",
  country: "India",
  // Real coordinates for Sector 6, Bhilai (used for prayer times, qibla, map).
  coords: { lat: 21.2095, lng: 81.3784 },
  address: {
    line1: "Sector 6, Bhilai",
    line2: "Durg District, Chhattisgarh 490006",
    country: "India",
  },
  // Placeholder contact — replace with verified details.
  contact: {
    phone: "+91 00000 00000",
    email: "hello@sector6masjid.example",
  },
  socials: [
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "WhatsApp", href: "#" },
  ],
  stats: [
    { value: 508, label: "Modelled components", suffix: "" },
    { value: 24, label: "Architectural sections", suffix: "" },
    { value: 180318, label: "Vertices in the 3D model", suffix: "" },
    { value: 5, label: "Daily congregational prayers", suffix: "" },
  ],
} as const;

export const MOSQUE_LONG_ABOUT = [
  "The Sector 6 Jama Masjid is a neighbourhood mosque in Bhilai, a planned steel-township city in Chhattisgarh. Like the city around it, it serves a community drawn together from many parts of India — a place for daily prayer, learning, and mutual care.",
  "Its architecture follows a familiar grammar: a walled courtyard, a sheltering arcade of pointed arches, a prayer hall aligned toward Makkah, geometric jali screens that filter light and air, a ribbed central dome, and a marble-clad minaret that marks the skyline and the call to prayer.",
  "This website pairs a cinematic 3D reconstruction of the building with the practical life of the mosque — prayer times, programmes, services, and ways to visit and support.",
];
