# Animations & Loading Polish Design

**Goal:** Eliminate the i18n translation flash on load and add professional Framer Motion entrance animations throughout the site.

**Architecture:** Fix translations at the root cause (static bundle), add a branded loading screen, then layer Framer Motion scroll-triggered animations on every section.

**Tech Stack:** Next.js 15, Framer Motion, react-i18next (static resources), Tailwind CSS

---

## 1. i18n Glitch Fix

**Problem:** `i18next-http-backend` fetches `/locales/{lng}/translation.json` asynchronously. With `useSuspense: false`, the page renders immediately with raw translation keys visible for ~200ms until the fetch resolves.

**Fix:** Remove `i18next-http-backend`. Import both translation JSON files directly in `src/i18n.js` and pass them as `resources` to `i18n.init()`. Translations are then bundled at build time and available synchronously.

`i18next-browser-languagedetector` is retained so the site still detects the user's browser language automatically.

**Files changed:**
- `src/i18n.js` — replace backend config with static `resources`

```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../public/locales/en/translation.json";
import es from "../public/locales/es/translation.json";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: { en: { translation: en }, es: { translation: es } },
      fallbackLng: "en",
      supportedLngs: ["en", "es"],
      load: "languageOnly",
      react: { useSuspense: false },
    });
}

export default i18n;
```

---

## 2. Branded Loading Screen

A full-screen white overlay rendered at the top of the component tree in `providers.tsx`. It is visible until:
1. The hero `<Image>` fires its `onLoad` callback (signaling the main visual asset is ready), AND
2. A minimum of 1000ms has elapsed (prevents flash-of-loading for fast connections)

Once both conditions are met, the overlay fades out over 400ms then unmounts.

**Content:**
- Centered layout
- `Dra. Catherine González` in `text-3xl font-bold text-blue-gray-800`
- `Especialista en Neumología` in `text-gray-500 text-sm mt-1`
- An animated pulse ring below (CSS `animate-ping` on a blue circle)

**Signal mechanism:** `hero.tsx` sets `window.__heroImageLoaded = true` in the Image `onLoad` callback (a boolean flag, not a callback). `providers.tsx` polls this flag on an interval after mount and clears the interval once it reads `true`. This avoids the race condition where a `priority` image (which gets a `<link rel="preload">` and may load before hydration) fires `onLoad` before `providers.tsx` has registered a callback. Because the flag persists on `window`, late-arriving polling always reads the correct value.

**Loading screen content** is intentionally language-invariant (always Spanish branded text) since i18n must be initialized before translations are usable — using translated text here would be a circular dependency.

**Files:**
- `src/components/loading-screen.tsx` — NEW: the overlay component
- `src/app/providers.tsx` — manages `isLoading` state, polls `window.__heroImageLoaded`, renders `<LoadingScreen>`
- `src/app/hero.tsx` — sets `window.__heroImageLoaded = true` in Image `onLoad`

---

## 3. Framer Motion Animations

**Install:** `framer-motion` (latest).

### 3a. Hero (mount animations)
All triggered on mount, no scroll needed.

| Element | Animation | Delay |
|---|---|---|
| Name (`h1`) | `y: 20 → 0`, `opacity: 0 → 1` | 0ms |
| Subheading | `y: 20 → 0`, `opacity: 0 → 1` | 150ms |
| CTA button | `scale: 0.95 → 1`, `opacity: 0 → 1` | 300ms |
| Social icons | `opacity: 0 → 1` | 400ms |
| Photo | `x: 30 → 0`, `opacity: 0 → 1` | 100ms |

### 3b. Navbar
`y: -20 → 0`, `opacity: 0 → 1` on mount, 200ms duration. Use `motion(MTNavbar)` (i.e. `const MotionNavbar = motion(MTNavbar)`) rather than wrapping in a `motion.div`, to preserve `sticky top-0 z-50` positioning — a wrapper div starting at `y: -20` would create a gap at the top of the viewport.

### 3c. Section fade-up (scroll-triggered)
Applied to every section container: Booking, Services, Information, Testimonials, Contact.

```
initial: { opacity: 0, y: 30 }
whileInView: { opacity: 1, y: 0 }
viewport: { once: true, margin: "-80px" }
transition: { duration: 0.5, ease: "easeOut" }
```

### 3d. Staggered cards
Applied to card grids inside Services, Testimonials, and Education/Experience items. The Skills pills row in `InformationSection` also gets stagger treatment (same pattern, just smaller pills).

The parent grid wrapper uses `motion.div` with `whileInView`, `variants` containing `staggerChildren: 0.1`, and `viewport: { once: true }`. Each child card is a `motion.div` with variants only (no `whileInView` on children — the parent's `whileInView` propagates the stagger automatically):

```
// Parent
variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
initial="hidden"
whileInView="visible"
viewport={{ once: true, margin: "-80px" }}

// Child card
variants={{
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}}
```

**Files changed:**
- `src/components/navbar.tsx` — mount fade-down
- `src/app/hero.tsx` — mount stagger
- `src/app/booking-section.tsx` — section fade-up
- `src/app/services-section.tsx` — section fade-up + staggered cards
- `src/app/information-section.tsx` — section fade-up + staggered cards
- `src/app/testimonial.tsx` — section fade-up + staggered cards
- `src/app/contact.tsx` — section fade-up

---

### 3e. Reduced motion accessibility
Use Framer Motion's `useReducedMotion()` hook in each animated component. When it returns `true`, all `y`/`x` transforms are set to `0` (opacity-only transitions). This respects the OS-level `prefers-reduced-motion` setting, which is important for a medical site where patients with vestibular disorders may have it enabled.

### 3f. Cleanup
After implementing, run `npm uninstall i18next-http-backend` to remove the now-unused dependency.

## Non-goals
- No page transitions between routes (single-page site)
- No parallax effects
- No skeleton loaders (loading screen is sufficient)
- No animation on Footer or FloatingWhatsApp button
