# Animations & Loading Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the i18n translation flash on load, add a branded loading screen, and add professional Framer Motion entrance animations throughout the site.

**Architecture:** Fix translations at root cause by bundling them statically (no HTTP fetch). Add a branded loading screen controlled by providers.tsx that waits for the hero image and a minimum time. Layer Framer Motion scroll-triggered animations on every section with staggered cards.

**Tech Stack:** Next.js 15 App Router, Framer Motion, react-i18next (static resources), Tailwind CSS, TypeScript

---

## Chunk 1: i18n Fix + Loading Screen

### Task 1: Fix i18n — bundle translations statically

**Files:**
- Modify: `src/i18n.js`

**Context:** The current `i18n.js` uses `i18next-http-backend` which fetches `/locales/{lng}/translation.json` asynchronously. With `useSuspense: false`, the page renders immediately with raw keys visible for ~200ms. The fix: import both JSON files as static ES imports so they're bundled and available synchronously. Language detection is kept via conditional require (browser-only guard already present in the codebase pattern).

- [ ] **Step 1: Replace `src/i18n.js` with static resource bundle**

```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../public/locales/en/translation.json";
import es from "../public/locales/es/translation.json";

const isClient = typeof window !== "undefined";

if (!i18n.isInitialized) {
  const chain = i18n.use(initReactI18next);

  if (isClient) {
    // LanguageDetector accesses navigator/localStorage — browser-only
    const LanguageDetector = require("i18next-browser-languagedetector").default;
    chain.use(LanguageDetector);
  }

  chain.init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    load: "languageOnly",
    react: { useSuspense: false },
  });
}

export default i18n;
```

- [ ] **Step 2: Remove unused dependency**

```bash
cd /Users/ale/catherines-personal && npm uninstall i18next-http-backend
```

Expected: `i18next-http-backend` removed from `package.json` and `node_modules`.

- [ ] **Step 3: Verify build compiles**

```bash
cd /Users/ale/catherines-personal && npm run build
```

Expected: Build succeeds with no errors. No `i18next-http-backend` references.

- [ ] **Step 4: Commit**

```bash
git add src/i18n.js package.json package-lock.json
git commit -m "fix: bundle i18n translations statically to eliminate load flash"
```

---

### Task 2: Install Framer Motion

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install framer-motion**

```bash
cd /Users/ale/catherines-personal && npm install framer-motion
```

Expected: `framer-motion` added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install framer-motion for animations"
```

---

### Task 3: Loading screen component

**Files:**
- Create: `src/components/loading-screen.tsx`
- Modify: `src/app/providers.tsx`
- Modify: `src/app/hero.tsx`
- Modify: `src/components/index.ts` (export the new component if an index file exists — check first, skip if not)

**Context:** The loading screen is a full-screen white overlay. It stays visible until:
1. Hero image fires `onLoad` (sets `window.__heroImageLoaded = true`)
2. A minimum of 1000ms has elapsed

`providers.tsx` polls `window.__heroImageLoaded` on a 50ms interval so it handles the race condition where a `priority` image loads before hydration completes. The content is intentionally language-invariant (always Spanish) since i18n can't be used here without a circular dependency.

- [ ] **Step 1: Create `src/components/loading-screen.tsx`**

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  visible: boolean;
}

export default function LoadingScreen({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          <p className="text-3xl font-bold text-blue-gray-800 tracking-tight">
            Dra. Catherine González
          </p>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            Especialista en Neumología
          </p>
          <div className="relative mt-8 flex h-10 w-10 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-blue-600" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Update `src/app/providers.tsx` to manage loading state**

Replace the entire file:

```tsx
"use client";

import { useState, useEffect } from "react";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { Layout } from "@/components";
import LoadingScreen from "@/components/loading-screen";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minTime = new Promise<void>((resolve) => setTimeout(resolve, 1000));

    let interval: ReturnType<typeof setInterval>;

    const imageReady = new Promise<void>((resolve) => {
      // Poll for the flag set by hero.tsx onLoad.
      // Polling handles the race condition where a priority image
      // (preloaded via <link rel="preload">) fires onLoad before
      // this useEffect registers.
      interval = setInterval(() => {
        if ((window as Window & { __heroImageLoaded?: boolean }).__heroImageLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });

    Promise.all([minTime, imageReady]).then(() => setIsLoading(false));

    return () => clearInterval(interval);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LoadingScreen visible={isLoading} />
      <Layout>{children}</Layout>
    </I18nextProvider>
  );
}
```

- [ ] **Step 3: Update `src/app/hero.tsx` — add `onLoad` signal**

Add `onLoad` to the `<Image>` component. Find the `<Image>` block and change it to:

```tsx
<Image
  src="/image/catherine.webp"
  alt={t("hero_photo_alt")}
  width={288}
  height={288}
  className="w-full h-full object-cover"
  priority
  onLoad={() => {
    (window as Window & { __heroImageLoaded?: boolean }).__heroImageLoaded = true;
  }}
/>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4000`. Expected: Loading screen with name + pulse ring appears for ~1s, then fades out. No translation keys visible at any point.

- [ ] **Step 5: Commit**

```bash
git add src/components/loading-screen.tsx src/app/providers.tsx src/app/hero.tsx
git commit -m "feat: add branded loading screen with hero image signal"
```

---

## Chunk 2: Framer Motion Animations

### Task 4: Hero + Navbar entrance animations

**Files:**
- Modify: `src/app/hero.tsx`
- Modify: `src/components/navbar.tsx`

**Context:** Hero animates on mount with staggered delays (name → subheading → CTA → socials, photo from right). Navbar fades down from top on mount. `useReducedMotion()` returns `boolean | null` (`null` during SSR). Use `const shouldAnimate = useReducedMotion() === false` — this treats `null` (unknown/SSR) the same as `true` (reduce motion requested), ensuring no transform flash on first paint for reduced-motion users. Every `y`/`x`/`scale` value in `initial` must use `shouldAnimate ? value : 0`.

- [ ] **Step 1: Replace `src/app/hero.tsx` with animated version**

```tsx
"use client";

import { IconButton, Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

function Hero() {
  const { t } = useTranslation();
  // useReducedMotion() returns boolean | null (null = SSR/unknown).
  // Treat null as "reduce" to avoid transform flash on first paint.
  const shouldAnimate = useReducedMotion() === false;

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full bg-white">
      <div className="container mx-auto px-8 py-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">

          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: shouldAnimate ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Typography variant="h1" color="blue-gray" className="mb-4">
                {t("hero_title")}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: shouldAnimate ? 20 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            >
              <Typography
                variant="lead"
                color="gray"
                className="mb-8 max-w-xl mx-auto lg:mx-0"
              >
                {t("hero_subheading")}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: shouldAnimate ? 0.95 : 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
            >
              <Button
                size="lg"
                color="blue"
                className="mb-8"
                onClick={scrollToBooking}
              >
                {t("hero_cta")}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
            >
              <Typography className="mb-3 text-blue-gray-900 font-medium uppercase text-sm">
                {t("hero_connect")}
              </Typography>
              <div className="flex gap-2 justify-center lg:justify-start">
                <IconButton
                  variant="text"
                  color="gray"
                  onClick={() =>
                    window.open("https://www.linkedin.com/in/catherine-gonzalez-perez", "_blank")
                  }
                >
                  <i className="fa-brands fa-linkedin text-lg" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="gray"
                  onClick={() => {
                    window.open(
                      `mailto:catherine.gonzalez3070@gmail.com?subject=${encodeURIComponent(
                        t("email_subject")
                      )}&body=${encodeURIComponent(t("email_body"))}`
                    );
                  }}
                >
                  <i className="fa-solid fa-envelope text-lg" />
                </IconButton>
                <IconButton
                  variant="text"
                  color="gray"
                  onClick={() => window.open("https://wa.me/573105967326", "_blank")}
                >
                  <i className="fa-brands fa-whatsapp text-lg" />
                </IconButton>
              </div>
            </motion.div>
          </div>

          {/* Photo */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: shouldAnimate ? 30 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-blue-100 shadow-xl bg-blue-50 flex items-center justify-center">
              <Image
                src="/image/catherine.webp"
                alt={t("hero_photo_alt")}
                width={288}
                height={288}
                className="w-full h-full object-cover"
                priority
                onLoad={() => {
                  (window as Window & { __heroImageLoaded?: boolean }).__heroImageLoaded = true;
                }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default Hero;
```

- [ ] **Step 2: Update `src/components/navbar.tsx` — fade-down on mount**

Use `motion(MTNavbar as any)` to animate the navbar directly and preserve `sticky top-0 z-50` positioning. **IMPORTANT:** `MotionNavbar` must be defined at module scope (outside the component function) — defining it inside the component causes React to create a new component type on every render, which unmounts/remounts the navbar on every state change (e.g. mobile menu toggle).

The `as any` cast is safe: Material Tailwind's Navbar uses `forwardRef`, which is not assignable to `React.ComponentType` at the TypeScript level, but Framer Motion handles forwardRef components correctly at runtime.

The full updated `src/components/navbar.tsx`:

```tsx
"use client";

import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

const MotionNavbar = motion(MTNavbar as any);

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Typography
        as="a"
        href={href}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 font-medium text-gray-900"
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  const NAV_MENU = [
    { label: t("nav_home"), href: "#" },
    { label: t("nav_booking"), href: "#booking" },
    { label: t("nav_services"), href: "#services" },
    { label: t("nav_about_us"), href: "#about-us" },
    { label: t("nav_contact_us"), href: "#contact-us" },
  ];

  return (
    <MotionNavbar
      initial={{ opacity: 0, y: shouldAnimate ? -20 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      fullWidth
      blurred={false}
      shadow={false}
      color="white"
      className="sticky top-0 z-50 border-0"
      placeholder=""
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Typography
          as="a"
          href="/"
          color="blue-gray"
          className="text-lg font-bold"
          placeholder={""}
        >
          {t("navbar_title")}
        </Typography>

        {/* Desktop Navigation */}
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map((nav, index) => (
            <NavItem key={index} href={nav.href}>
              {nav.label}
            </NavItem>
          ))}
          <LanguageSwitcher />
        </ul>

        {/* Mobile Menu Button */}
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile Menu */}
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map((nav, index) => (
              <NavItem key={index} href={nav.href}>
                {nav.label}
              </NavItem>
            ))}
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      </Collapse>
    </MotionNavbar>
  );
}

export default Navbar;
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4000`. Expected:
- Navbar fades down smoothly on load
- Hero text cascades in (name → subheading → button → socials)
- Photo slides in from the right

- [ ] **Step 4: Commit**

```bash
git add src/app/hero.tsx src/components/navbar.tsx
git commit -m "feat: add hero and navbar entrance animations"
```

---

### Task 5: Section fade-up + staggered card animations

**Files:**
- Modify: `src/app/booking-section.tsx`
- Modify: `src/app/services-section.tsx`
- Modify: `src/app/information-section.tsx`
- Modify: `src/app/testimonial.tsx`
- Modify: `src/app/contact.tsx`

**Context:** Each section gets `whileInView` fade-up. Card grids (Services, Education, Experience, Testimonials, Skills) use parent stagger with children variants. `useReducedMotion()` disables y/x transforms everywhere.

**Shared animation patterns (do not import from a shared file — inline in each component):**

In all components use `const shouldAnimate = useReducedMotion() === false`.

Section wrapper pattern:
```tsx
initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-80px" }}
transition={{ duration: 0.5, ease: "easeOut" }}
```

Stagger parent pattern:
```tsx
variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
initial="hidden"
whileInView="visible"
viewport={{ once: true, margin: "-80px" }}
```

Stagger child pattern:
```tsx
variants={{
  hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}}
```

- [ ] **Step 1: Update `src/app/booking-section.tsx`**

Add `motion` and `useReducedMotion` imports. Wrap the `<section>` element:

```tsx
"use client";

import { useState, useEffect } from "react";
import { PopupModal } from "react-calendly";
import { useTranslation } from "react-i18next";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/lib/firebase";
import { motion, useReducedMotion } from "framer-motion";

const BookingSection = () => {
  const [state, setState] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  useEffect(() => {
    if (typeof document !== "undefined") {
      setRootElement(document.getElementById("root"));
    }
  }, []);

  const handleVirtualClick = () => {
    setState(true);
    if (analytics) {
      logEvent(analytics, "booking_click", { label: "Virtual Booking Clicked" });
    }
  };

  const handleInPersonClick = () => {
    if (analytics) {
      logEvent(analytics, "booking_click", { label: "In-Person Booking Clicked" });
    }
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      id="booking"
      className="py-20 bg-gray-100 px-8 text-center"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-4">{t("book_appointment")}</h2>
      <p className="text-gray-600 mb-8">{t("schedule_consultation")}</p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
        {/* Virtual Consultation - primary */}
        <div className="flex-1 bg-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <i className="fa-solid fa-video text-3xl mb-3" />
          <h3 className="text-xl font-bold mb-2">{t("virtual_consultation")}</h3>
          <p className="text-blue-100 text-sm mb-4">{t("virtual_consultation_desc")}</p>
          <button
            onClick={handleVirtualClick}
            className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg shadow hover:bg-blue-50 transition"
          >
            {t("schedule_now")}
          </button>
        </div>

        {/* In-Person Consultation - secondary */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center">
          <i className="fa-solid fa-hospital text-3xl text-gray-500 mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t("inperson_consultation")}</h3>
          <p className="text-gray-500 text-sm mb-4">{t("inperson_consultation_desc")}</p>
          <button
            onClick={handleInPersonClick}
            className="border border-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-50 transition"
          >
            {t("nav_contact_us")}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6 italic">
        <i className="fa-solid fa-globe mr-1" />
        {t("english_available")}
      </p>

      {rootElement && (
        <PopupModal
          url="https://calendly.com/catherine-gonzalez3070/30min"
          onModalClose={() => setState(false)}
          open={state}
          rootElement={rootElement}
        />
      )}
    </motion.section>
  );
};

export default BookingSection;
```

- [ ] **Step 2: Update `src/app/services-section.tsx`**

```tsx
"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

const SERVICES = [
  { icon: "fa-solid fa-lungs", titleKey: "service_asthma", descKey: "service_asthma_desc" },
  { icon: "fa-solid fa-wind", titleKey: "service_copd", descKey: "service_copd_desc" },
  { icon: "fa-solid fa-ribbon", titleKey: "service_lung_cancer", descKey: "service_lung_cancer_desc" },
  { icon: "fa-solid fa-mask-face", titleKey: "service_vmni", descKey: "service_vmni_desc" },
  { icon: "fa-solid fa-x-ray", titleKey: "service_ild", descKey: "service_ild_desc" },
  { icon: "fa-solid fa-virus", titleKey: "service_pneumonia", descKey: "service_pneumonia_desc" },
  { icon: "fa-solid fa-moon", titleKey: "service_sleep", descKey: "service_sleep_desc" },
  { icon: "fa-solid fa-stethoscope", titleKey: "service_bronchoscopy", descKey: "service_bronchoscopy_desc" },
];

export default function ServicesSection() {
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  const cardVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="services"
      className="py-20 px-8 bg-blue-50"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <Typography variant="h2" color="blue-gray" className="mb-3 font-bold">
            {t("services_title")}
          </Typography>
          <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
            {t("services_subtitle")}
          </Typography>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i className={`${s.icon} text-blue-600 text-xl`} />
              </div>
              <div>
                <Typography className="font-bold text-blue-gray-800 mb-1">
                  {t(s.titleKey)}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  {t(s.descKey)}
                </Typography>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 3: Update `src/app/information-section.tsx`**

```tsx
"use client";
import { Typography } from "@material-tailwind/react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

import InfoCard from "@/components/info-card";

const EDUCATION = [
  {
    icon: AcademicCapIcon,
    titleKey: "education_bronchoscopy",
    date: "2025",
    descriptionKey: "education_bronchoscopy_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_epoc_master",
    date: "2024",
    descriptionKey: "education_epoc_master_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_thoracic_oncology",
    date: "2023",
    descriptionKey: "education_thoracic_oncology_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_nimv_methodology",
    date: "2023",
    descriptionKey: "education_nimv_methodology_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_fea_pulmonary",
    date: "2018 - 2023",
    descriptionKey: "education_fea_pulmonary_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_doctor",
    date: "2013",
    descriptionKey: "education_doctor_desc",
  },
];

const EXPERIENCE = [
  {
    icon: BriefcaseIcon,
    titleKey: "experience_servisalud",
    date: "Jun 2025 - Presente",
    descriptionKey: "experience_servisalud_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_vithas",
    date: "Feb 2023 - May 2024",
    descriptionKey: "experience_vithas_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_jerez",
    date: "May 2018 - Feb 2023",
    descriptionKey: "experience_jerez_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_sanitas",
    date: "2013",
    descriptionKey: "experience_sanitas_desc",
  },
];

export function InformationSection() {
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  const cardVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const pillVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 10 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.section
      id="about-us"
      className="py-20 pb-28 px-8"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid xl:grid-cols-2 md:grid-cols-1 container gap-20 mx-auto items-start">
        {/* Education Section */}
        <div>
          <div className="mb-10">
            <Typography color="blue-gray" className="mb-2 text-3xl font-bold">
              {t("info_title_education")}
            </Typography>
            <Typography variant="lead" className="!text-gray-500">
              {t("info_description_education")}
            </Typography>
          </div>
          <motion.div
            className="container mx-auto grid grid-cols-1 gap-16 gap-y-12"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {EDUCATION.map((item, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <InfoCard
                  icon={item.icon}
                  titleKey={item.titleKey}
                  date={item.date}
                  descriptionKey={item.descriptionKey}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Experience Section */}
        <div>
          <div className="mb-10">
            <Typography color="blue-gray" className="mb-2 text-3xl font-bold">
              {t("info_title_experience")}
            </Typography>
            <Typography variant="lead" className="!text-gray-500">
              {t("info_description_experience")}
            </Typography>
          </div>
          <motion.div
            className="container mx-auto grid grid-cols-1 gap-16 gap-y-12"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {EXPERIENCE.map((item, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <InfoCard
                  icon={item.icon}
                  titleKey={item.titleKey}
                  date={item.date}
                  descriptionKey={item.descriptionKey}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        <Typography color="blue-gray" className="mb-2 text-3xl font-bold text-center">
          {t("info_title_skills")}
        </Typography>
        <Typography variant="lead" className="!text-gray-500 text-center mb-8">
          {t("info_description_skills")}
        </Typography>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {[
            { key: "skill_teamwork", icon: "fa-solid fa-people-group" },
            { key: "skill_proactivity", icon: "fa-solid fa-bolt" },
            { key: "skill_leadership", icon: "fa-solid fa-star" },
            { key: "skill_research", icon: "fa-solid fa-magnifying-glass" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={pillVariants}
              className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2"
            >
              <i className={`${s.icon} text-blue-600 text-sm`} />
              <Typography className="text-blue-gray-700 font-medium text-sm">{t(s.key)}</Typography>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default InformationSection;
```

- [ ] **Step 4: Update `src/app/testimonial.tsx`**

```tsx
"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

export function Testimonial() {
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  const testimonials = [
    {
      feedback: t("testimonial_1_feedback"),
      name: t("testimonial_1_name"),
      title: t("testimonial_1_title"),
      initials: "JD",
    },
    {
      feedback: t("testimonial_2_feedback"),
      name: t("testimonial_2_name"),
      title: t("testimonial_2_title"),
      initials: "JS",
    },
    {
      feedback: t("testimonial_3_feedback"),
      name: t("testimonial_3_name"),
      title: t("testimonial_3_title"),
      initials: "CM",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="py-20 px-8 bg-white"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <Typography variant="h2" color="blue-gray" className="mb-3 font-bold">
            {t("testimonial_title")}
          </Typography>
          <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
            {t("testimonial_subtitle")}
          </Typography>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="bg-blue-50 rounded-xl p-6 shadow-sm flex flex-col gap-4"
            >
              <i className="fa-solid fa-quote-left text-blue-300 text-2xl" />
              <Typography className="text-gray-600 text-sm leading-relaxed flex-1">
                {item.feedback}
              </Typography>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.initials}
                </div>
                <div>
                  <Typography className="font-semibold text-blue-gray-800 text-sm">
                    {item.name}
                  </Typography>
                  <Typography className="text-xs text-gray-500">{item.title}</Typography>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default Testimonial;
```

- [ ] **Step 5: Update `src/app/contact.tsx`**

Add `motion` import and wrap the section:

```tsx
"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

const ContactSection = () => {
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  return (
    <motion.section
      id="contact-us"
      className="bg-gray-100 py-20 px-8"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <Typography variant="h2" color="blue-gray" className="mb-4 font-bold">
            {t("contact_title")}
          </Typography>
          <Typography variant="lead" color="gray" className="mb-6">
            {t("contact_subtitle")}
          </Typography>

          <div className="space-y-4">
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_address_label")}
              </Typography>
              <Typography color="gray">{t("contact_address")}</Typography>
            </div>
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_phone_label")}
              </Typography>
              <Typography color="gray">
                <a href="tel:+573105967326" className="hover:underline">
                  {t("contact_phone")}
                </a>
              </Typography>
            </div>
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_whatsapp_label")}
              </Typography>
              <Typography color="gray">
                <a
                  href="https://wa.me/573105967326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {t("contact_whatsapp")}
                </a>
              </Typography>
            </div>
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_email_label")}
              </Typography>
              <Typography color="gray">{t("contact_email")}</Typography>
            </div>
          </div>
        </div>

        {/* Map Integration */}
        <div className="w-full h-96">
          <iframe
            src="https://maps.google.com/maps?q=Centro+Comercial+Cerritos,+Pereira,+Risaralda,+Colombia&output=embed"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
```

- [ ] **Step 6: Verify full site in browser**

```bash
npm run dev
```

Open `http://localhost:4000`. Scroll through the full page. Expected:
- Loading screen appears ~1s then fades out
- No translation key flash at any point
- Hero entrance: name → subheading → CTA → socials cascade, photo from right
- Navbar fades down from top
- Each section fades up as you scroll to it
- Service cards (8), Education cards (6), Experience cards (4), Testimonial cards (3), Skills pills (4) all stagger in nicely

- [ ] **Step 7: Build and verify no TypeScript errors**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 8: Commit and push**

```bash
git add src/app/booking-section.tsx src/app/services-section.tsx src/app/information-section.tsx src/app/testimonial.tsx src/app/contact.tsx
git commit -m "feat: add scroll-triggered section and card stagger animations"
git push origin main
```
