# SEO Pereira Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Dr. Catherine Gonzalez's website to target Pereira/Risaralda, rank #1 for "Neumologo en Pereira", add virtual-first booking, WhatsApp, and English consultation availability.

**Architecture:** Split the root `layout.tsx` from a client component into a server component (enabling the Next.js Metadata API and JSON-LD structured data), while moving i18n + theme providers into a new `providers.tsx` client component. All content changes are driven through the i18n translation files.

**Tech Stack:** Next.js 15 App Router, React 18, TypeScript, Tailwind CSS, Material Tailwind, react-i18next, Firebase Analytics, react-calendly.

**Spec:** `docs/superpowers/specs/2026-03-16-seo-pereira-redesign.md`

---

## Chunk 1: Architecture Split — Server Layout + Providers

### Task 1: Create `src/app/providers.tsx`

**Files:**
- Create: `src/app/providers.tsx`

This is the new `"use client"` wrapper that holds everything that needs browser APIs: i18n and the Material Tailwind theme.

- [ ] **Step 1: Create `src/app/providers.tsx`**

```tsx
"use client";

import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { Layout } from "@/components";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Layout>{children}</Layout>
    </I18nextProvider>
  );
}
```

- [ ] **Step 2: Verify the file is syntactically valid**

```bash
npx tsc --noEmit 2>&1 | grep "providers" | head -10
```

Expected: no errors specifically mentioning `providers.tsx`. At this point `layout.tsx` is still the old client version, so errors in that file are expected and fine — only check `providers.tsx`.

---

### Task 2: Convert `src/app/layout.tsx` to a server component

**Files:**
- Modify: `src/app/layout.tsx`

Remove `"use client"`, strip out the old `<head>` JSX, add the `metadata` export, add JSON-LD, and render `<Providers>` instead of `<I18nextProvider>` + `<Layout>`.

Full implementation is shown in `docs/superpowers/specs/2026-03-16-seo-pereira-redesign.md` Sections 2 and 3. Summary of the new file structure:

- [ ] **Step 1: Replace `src/app/layout.tsx` with the server component version**

The new file must:
1. Remove `"use client"` directive entirely
2. Remove the old imports: `I18nextProvider`, `i18n`, `Layout` — these move to `providers.tsx`
3. Import `{ Metadata }` from `"next"` and `Providers` from `"./providers"`
4. Keep `Roboto` font initialization via `next/font/google` (stays here — cannot be in a client component)
5. Export a `metadata` constant typed as `Metadata` — full value in spec Section 2
6. Define a `physicianSchema` constant (static object, no user input) — full value in spec Section 3
7. Render the JSON-LD script tag inside `<body>` using React's `__html` prop with `JSON.stringify(physicianSchema)` — this is the standard Next.js pattern for JSON-LD; the object is fully static so there is no XSS risk
8. Keep the Font Awesome CDN `<link>` inside `<head>` JSX (metadata API does not handle stylesheet CDN links)
9. Render `<Providers>{children}</Providers>` inside `<body>` — NOT wrapping `<html>` (that was a bug in the old code)
10. The `<html lang="es" id="root">` element stays in this server component

Expected structure:
```
<html lang="es" id="root">
  <head>
    [Font Awesome link]
  </head>
  <body className={roboto.className}>
    [JSON-LD script]
    <Providers>{children}</Providers>
  </body>
</html>
```

- [ ] **Step 2: Run the build to verify the architecture split compiles**

```bash
cd /Users/ale/catherines-personal && npm run build 2>&1 | tail -30
```

Expected: Build completes successfully.

- [ ] **Step 3: Start dev server and verify the page loads**

```bash
cd /Users/ale/catherines-personal && npm run dev &
sleep 5
curl -s http://localhost:4000 | grep -i "catherine" | head -3
```

Expected: Page title/content includes "Catherine".

- [ ] **Step 4: Verify JSON-LD is in the HTML**

```bash
curl -s http://localhost:4000 | grep -c "application/ld+json"
```

Expected: `1`

```bash
pkill -f "next dev"
```

- [ ] **Step 5: Commit**

```bash
cd /Users/ale/catherines-personal
git add src/app/layout.tsx src/app/providers.tsx
git commit -m "feat: split layout into server component, add metadata API and JSON-LD schema"
```

---

## Chunk 2: Translation Updates

### Task 3: Update `public/locales/en/translation.json`

**Files:**
- Modify: `public/locales/en/translation.json`

- [ ] **Step 1: Update the following existing keys**

Replace these four keys with the values below (keep all other keys untouched):

```
"description": "Discover the expertise of Dr. Catherine Gonzalez, a pulmonology physician fully certified in Colombia, now serving Pereira, Risaralda with in-person and virtual consultations in English and Spanish."

"contact_address": "Centro Comercial Cerritos, Pereira, Risaralda, Colombia"

"contact_phone": "+57 310 596 7326"

"hero_subheading": "General Practitioner and Pulmonology Specialist, fully certified in Colombia after training in Spain. Based in Pereira, Risaralda at Centro Comercial Cerritos. Dr. Catherine Gonzalez offers virtual and in-person consultations in English and Spanish, focused on prevention, diagnosis, and treatment of respiratory and general health conditions."
```

- [ ] **Step 2: Add new keys before the closing `}`**

```json
"contact_whatsapp_label": "WhatsApp:",
"contact_whatsapp": "+57 310 596 7326",
"virtual_consultation": "Virtual Consultation",
"virtual_consultation_desc": "Available from anywhere — book a video call",
"inperson_consultation": "In-Person Consultation",
"inperson_consultation_desc": "Centro Comercial Cerritos, Pereira, Risaralda",
"english_available": "Consultations available in English and Spanish"
```

- [ ] **Step 3: Validate the JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('public/locales/en/translation.json','utf8')); console.log('valid')"
```

Expected: `valid`

---

### Task 4: Update `public/locales/es/translation.json`

**Files:**
- Modify: `public/locales/es/translation.json`

- [ ] **Step 1: Update existing keys**

```
"description": "Descubre la experiencia de la Dra. Catherine Gonzalez, neumologa con titulo homologado en Colombia, atendiendo en Pereira, Risaralda con consultas presenciales y virtuales en espanol e ingles."

"contact_address": "Centro Comercial Cerritos, Pereira, Risaralda, Colombia"

"contact_phone": "+57 310 596 7326"

"hero_subheading": "Medica General y Especialista en Neumologia, con titulo homologado en Colombia tras su formacion en Espana. Con sede en Pereira, Risaralda en el Centro Comercial Cerritos. La Dra. Catherine Gonzalez ofrece consultas virtuales y presenciales en espanol e ingles, enfocadas en prevencion, diagnostico y tratamiento de enfermedades respiratorias y de salud general."
```

NOTE: Use proper Spanish accented characters (tildes) in the actual file. The above shows them without accents for plain-text readability. The correct accented values are in the spec file Section 4.

- [ ] **Step 2: Add new keys**

```json
"contact_whatsapp_label": "WhatsApp:",
"contact_whatsapp": "+57 310 596 7326",
"virtual_consultation": "Consulta Virtual",
"virtual_consultation_desc": "Disponible desde cualquier lugar — agenda una videollamada",
"inperson_consultation": "Consulta Presencial",
"inperson_consultation_desc": "Centro Comercial Cerritos, Pereira, Risaralda",
"english_available": "Consultas disponibles en ingles y espanol"
```

NOTE: Use proper accented characters. The accented forms are in the spec Section 4.

- [ ] **Step 3: Validate**

```bash
node -e "JSON.parse(require('fs').readFileSync('public/locales/es/translation.json','utf8')); console.log('valid')"
```

Expected: `valid`

- [ ] **Step 4: Commit**

```bash
cd /Users/ale/catherines-personal
git add public/locales/en/translation.json public/locales/es/translation.json
git commit -m "feat: update translations for Pereira, virtual consultation, and English availability"
```

---

## Chunk 3: Component Updates

### Task 5: Update `src/app/contact.tsx`

**Files:**
- Modify: `src/app/contact.tsx`

Three changes: fix the hardcoded phone href, add WhatsApp row, update the map embed.

- [ ] **Step 1: Fix `tel:` href**

On line 33, change:
```tsx
<a href="tel:+573123456789" className="hover:underline">
```
To:
```tsx
<a href="tel:+573105967326" className="hover:underline">
```

- [ ] **Step 2: Add WhatsApp row**

After the closing `</div>` of the phone block, add:

```tsx
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
```

- [ ] **Step 3: Update the Google Maps embed src**

Replace the existing Bogota iframe `src` with:
```
https://maps.google.com/maps?q=Centro+Comercial+Cerritos,+Pereira,+Risaralda,+Colombia&output=embed
```

- [ ] **Step 4: Lint check**

```bash
cd /Users/ale/catherines-personal && npm run lint 2>&1 | grep -E "contact|Error" | head -10
```

Expected: No errors for `contact.tsx`.

- [ ] **Step 5: Commit**

```bash
cd /Users/ale/catherines-personal
git add src/app/contact.tsx
git commit -m "feat: update contact section with real phone, WhatsApp, and Pereira map"
```

---

### Task 6: Update `src/app/hero.tsx`

**Files:**
- Modify: `src/app/hero.tsx`

Add WhatsApp icon button as the third social icon.

- [ ] **Step 1: Add WhatsApp `IconButton` after the email button**

After the closing `</IconButton>` of the email button block, insert:

```tsx
<IconButton
  variant="text"
  color="gray"
  onClick={() => window.open("https://wa.me/573105967326", "_blank")}
>
  <i className="fa-brands fa-whatsapp text-lg" />
</IconButton>
```

- [ ] **Step 2: Lint check**

```bash
cd /Users/ale/catherines-personal && npm run lint 2>&1 | grep -E "hero|Error" | head -10
```

- [ ] **Step 3: Commit**

```bash
cd /Users/ale/catherines-personal
git add src/app/hero.tsx
git commit -m "feat: add WhatsApp button to hero social links"
```

---

### Task 7: Update `src/app/booking-section.tsx`

**Files:**
- Modify: `src/app/booking-section.tsx`

Replace the single-button layout with a virtual-first two-card design.

- [ ] **Step 1: Replace the entire contents of `src/app/booking-section.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { PopupModal } from "react-calendly";
import { useTranslation } from "react-i18next";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/lib/firebase";

const BookingSection = () => {
  const [state, setState] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();

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
    <section id="booking" className="py-20 bg-gray-100 px-8 text-center">
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
    </section>
  );
};

export default BookingSection;
```

- [ ] **Step 2: Run lint**

```bash
cd /Users/ale/catherines-personal && npm run lint 2>&1 | grep -E "booking|Error" | head -10
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/ale/catherines-personal
git add src/app/booking-section.tsx
git commit -m "feat: virtual-first two-card booking layout with English badge"
```

---

## Chunk 4: Final Verification

### Task 8: Full build and smoke test

- [ ] **Step 1: Run lint + full build**

```bash
cd /Users/ale/catherines-personal && npm run lint && npm run build 2>&1 | tail -20
```

Expected: Zero lint errors. Build succeeds.

- [ ] **Step 2: Smoke test key content in dev**

```bash
cd /Users/ale/catherines-personal && npm run dev &
sleep 5
curl -s http://localhost:4000 | python3 -c "
import sys
html = sys.stdin.read()
checks = {
  'JSON-LD present': 'application/ld+json' in html,
  'Pereira in HTML': 'Pereira' in html,
  'WhatsApp link': 'wa.me' in html,
  'Cerritos in HTML': 'Cerritos' in html,
}
for k, v in checks.items():
    print(f'{k}: {\"PASS\" if v else \"FAIL\"}')"
pkill -f "next dev"
```

Expected: All four checks show `PASS`.

- [ ] **Step 3: Visual inspection checklist**

Start dev server (`npm run dev`) and open `http://localhost:4000`. Verify manually:

- [ ] Hero section mentions Pereira
- [ ] WhatsApp icon appears in hero alongside LinkedIn and email
- [ ] Booking section shows two cards (blue Virtual, white In-Person)
- [ ] "Consultations available in English and Spanish" badge visible below cards
- [ ] Clicking Virtual card opens Calendly popup
- [ ] Clicking In-Person card scrolls to the contact section
- [ ] Contact section shows `+57 310 596 7326` for phone
- [ ] Contact section shows WhatsApp link
- [ ] Map shows Cerritos area of Pereira (not Bogota)
- [ ] Language switcher still works (ES/EN toggle)

- [ ] **Step 4: Commit and push to trigger GitHub Pages deploy**

```bash
cd /Users/ale/catherines-personal && git log --oneline -6
git push origin main
```

- [ ] **Step 5: Post-deploy — validate structured data (manual)**

After GitHub Pages deploys (usually ~2 min), validate the live site's structured data at:
`https://search.google.com/test/rich-results`

Enter `https://alexkater.github.io/catherines-personal` and confirm a `Physician` entity is detected.
