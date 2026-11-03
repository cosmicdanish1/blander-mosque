# Design System

## Visual Theme

An architectural night exhibition viewed in a quiet gallery: deep mineral blue space, pale stone, precise points of antique gold, and atmospheric particles. The mosque is luminous enough to inspect while the surrounding world stays subdued. The visual language is cinematic and reverent, with clear contemporary typography for a worldwide audience.

## Color Palette

- Night: `oklch(0.13 0.035 255)`
- Deep sapphire: `oklch(0.22 0.07 255)`
- Celestial blue: `oklch(0.55 0.12 242)`
- Antique gold: `oklch(0.72 0.11 78)`
- Warm pearl: `oklch(0.93 0.012 85)`
- Quiet text: `oklch(0.76 0.018 245)`

Use a committed dark-blue atmosphere with gold reserved for orientation, particle light, progress, and carefully chosen architectural emphasis. Never use pure black or pure white.

## Typography

Use Marcellus for the mosque name and major chapter titles, evoking carved architectural lettering without becoming ornate. Use Onest for descriptions, navigation labels, and controls. Maintain generous line height and cap descriptive copy near 65 characters per line.

## Layout

The WebGL canvas is fixed and full viewport. Story chapters occupy tall scroll sections over it, with text alternating between quiet left and right placements to follow the camera subject. The hero name is a first-viewport signal. Copy remains unframed and sparse; small chapter markers and a vertical progress rail provide orientation.

## Motion

All major motion is driven by scroll progress. Ambient particles gather into the Arabic word Allah, dissolve, then yield to a bottom-to-top architectural assembly. Camera chapters visit the arcade, prayer hall, jali, dome, minaret, and complete building. Use exponential ease-out curves without bounce. Reduced motion swaps travel and particle morphing for static views, short crossfades, and complete geometry.

## Components

- `MosqueStory`: owns narrative timing and shared scroll progress.
- `StoryCanvas`: full-screen Three.js presentation and lighting.
- `MosqueModel`: segmented GLB, material treatment, and build reveal.
- `ParticleField`: ambient blue and gold spatial particles.
- `AllahParticles`: decorative particle morph into Arabic calligraphy.
- `StoryChapter`: reusable text chapter with alignment and active state.
- `StoryProgress`: accessible chapter and scroll indicator.
- `WebGLFallback`: static rendered mosque image plus the complete story text.

## Responsive Behavior

Desktop uses wider camera travel and alternating copy. Mobile uses closer portrait framing, bottom-aligned chapter copy, fewer particles, and shorter scroll distances. Typography changes through breakpoint steps rather than viewport-scaled font sizing. Touch scrolling and wheel scrolling drive the same timeline.
