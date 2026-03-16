# Spec: SEO Pereira Redesign + Virtual-First + Full Metadata Refactor

**Date:** 2026-03-16
**Goal:** Rank #1 on Google for "Neumólogo en Pereira" / "Pulmonologist in Pereira", update location to Cerritos, surface virtual consultations and English-language availability.

---

## 1. Architecture — Split layout.tsx into server + client

**Problem:** `layout.tsx` uses `"use client"` which prevents Next.js from using the `metadata` export API and server-rendering JSON-LD structured data.

### layout.tsx (becomes server component)

Remove `"use client"`. It keeps:
- `<html lang="es" id="root">` and `<body className={roboto.className}>`
- Roboto font initialization via `next/font/google` (must stay here — `next/font` is forbidden in client components)
- `export const metadata` (Next.js Metadata API)
- JSON-LD `<script>` tag rendered inside `<body>`
- The Font Awesome CDN `<link>` tag currently in the JSX `<head>` — keep it as literal JSX in a `<head>` element (Next.js Metadata API does not cover CDN stylesheets)
- Renders `<Providers>{children}</Providers>` inside `<body>`

**IMPORTANT — structural fix:** The current code wraps `<I18nextProvider>` around `<html>`, which is incorrect. The new structure must be:
```tsx
<html lang="es" id="root">
  <head>...</head>
  <body className={roboto.className}>
    <script type="application/ld+json" ... />
    <Providers>{children}</Providers>
  </body>
</html>
```

`layout.tsx` does NOT import `Layout` or anything from `@/components` directly. It only imports `Providers` from `./providers`.

The `I18nextProvider` and `Layout` wrapper move out entirely — layout.tsx will only import `Providers` from the new file.

### providers.tsx (new file — `"use client"`)

Location: `src/app/providers.tsx`

Props: `{ children: React.ReactNode }` only.

Imports:
- `i18n` from `"../i18n"` (the existing side-effect-initialized i18n instance from `src/i18n.js`)
- `I18nextProvider` from `"react-i18next"`
- `{ Layout }` from `"@/components"` (accepts only `children`)

Structure:
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

### src/components/layout.tsx — no changes.

---

## 2. SEO Metadata (layout.tsx — Next.js Metadata API)

Replace all hardcoded `<head>` JSX with:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dra. Catherine González | Neumóloga en Pereira | Consulta Virtual y Presencial",
  description:
    "Especialista en neumología en Pereira, Risaralda. Dra. Catherine González ofrece consultas virtuales y presenciales en español e inglés. Reserva tu cita hoy.",
  keywords: [
    "Neumólogo Pereira",
    "Pulmonologist Pereira",
    "Neumóloga Risaralda",
    "consulta virtual neumología",
    "oncología torácica Pereira",
    "Catherine González",
    "English pulmonologist Colombia",
    "médico Cerritos Pereira",
  ],
  authors: [{ name: "Dra. Catherine González" }],
  robots: "index, follow",
  alternates: {
    canonical: "https://alexkater.github.io/catherines-personal",
  },
  openGraph: {
    title: "Dra. Catherine González | Neumóloga en Pereira",
    description:
      "Especialista en neumología en Pereira, Risaralda. Consultas virtuales y presenciales en español e inglés.",
    url: "https://alexkater.github.io/catherines-personal",
    type: "website",
    images: [
      {
        url: "https://alexkater.github.io/catherines-personal/favicon.png",
        width: 512,
        height: 512,
        alt: "Dra. Catherine González - Neumóloga en Pereira",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dra. Catherine González | Neumóloga en Pereira",
    description:
      "Especialista en neumología en Pereira, Risaralda. Consultas virtuales y presenciales en español e inglés.",
    images: ["https://alexkater.github.io/catherines-personal/favicon.png"],
  },
};
```

The Font Awesome CDN `<link>` that was in the old `<head>` must be moved to the `<head>` of the new server-component layout. Keep it exactly as it is — just move it to the server layout's JSX `<head>` or add it via Next.js's `<head>` element inside the server layout.

---

## 3. JSON-LD Structured Data (Physician schema)

In `layout.tsx`, define a static const above the component function (no user input — safe from XSS):

```ts
const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: "Dra. Catherine González",
  description: "Especialista en neumología en Pereira, Risaralda. Consultas en español e inglés.",
  medicalSpecialty: "Pulmonary Medicine",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Centro Comercial Cerritos",
    addressLocality: "Pereira",
    addressRegion: "Risaralda",
    addressCountry: "CO",
  },
  telephone: "+573105967326",
  url: "https://alexkater.github.io/catherines-personal",
  availableService: [
    { "@type": "MedicalTherapy", name: "Consulta Virtual de Neumología" },
    { "@type": "MedicalTherapy", name: "Consulta Presencial de Neumología" },
    { "@type": "MedicalTherapy", name: "Oncología Torácica" },
    { "@type": "MedicalTherapy", name: "Ventilación Mecánica No Invasiva (VMNI)" },
    { "@type": "MedicalTherapy", name: "Enfermedades Respiratorias Crónicas" },
  ],
  knowsLanguage: ["es", "en"],
};
```

Render it inside the `<body>` of layout.tsx using Next.js standard JSON-LD pattern (static object, safe):

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
/>
```

This is the Next.js-recommended pattern for JSON-LD. `physicianSchema` is a fully developer-controlled static object — no user input reaches this string.

---

## 4. Translation updates (EN + ES)

### Updated keys — exact values

**`contact_address`**
- EN + ES: `"Centro Comercial Cerritos, Pereira, Risaralda, Colombia"`

**`contact_phone`**
- EN + ES: `"+57 310 596 7326"`

**`description`**
- EN: `"Discover the expertise of Dr. Catherine González, a pulmonology physician fully certified in Colombia, now serving Pereira, Risaralda with in-person and virtual consultations in English and Spanish."`
- ES: `"Descubre la experiencia de la Dra. Catherine González, neumóloga con título homologado en Colombia, atendiendo en Pereira, Risaralda con consultas presenciales y virtuales en español e inglés."`

**`hero_subheading`**
- EN: `"General Practitioner and Pulmonology Specialist, fully certified in Colombia after training in Spain. Based in Pereira, Risaralda at Centro Comercial Cerritos. Dr. Catherine González offers virtual and in-person consultations in English and Spanish, focused on prevention, diagnosis, and treatment of respiratory and general health conditions."`
- ES: `"Médica General y Especialista en Neumología, con título homologado en Colombia tras su formación en España. Con sede en Pereira, Risaralda en el Centro Comercial Cerritos. La Dra. Catherine González ofrece consultas virtuales y presenciales en español e inglés, enfocadas en prevención, diagnóstico y tratamiento de enfermedades respiratorias y de salud general."`

### New keys — exact values

| Key | EN | ES |
|-----|----|----|
| `contact_whatsapp_label` | `"WhatsApp:"` | `"WhatsApp:"` |
| `contact_whatsapp` | `"+57 310 596 7326"` | `"+57 310 596 7326"` |
| `virtual_consultation` | `"Virtual Consultation"` | `"Consulta Virtual"` |
| `virtual_consultation_desc` | `"Available from anywhere — book a video call"` | `"Disponible desde cualquier lugar — agenda una videollamada"` |
| `inperson_consultation` | `"In-Person Consultation"` | `"Consulta Presencial"` |
| `inperson_consultation_desc` | `"Centro Comercial Cerritos, Pereira, Risaralda"` | `"Centro Comercial Cerritos, Pereira, Risaralda"` |
| `english_available` | `"Consultations available in English and Spanish"` | `"Consultas disponibles en inglés y español"` |

---

## 5. contact.tsx — Phone, WhatsApp, Maps embed

**Phone href:** Change the hardcoded string literal `href="tel:+573123456789"` to `href="tel:+573105967326"`. The display text stays as `{t("contact_phone")}`. These two are intentionally separate — the href is a stable constant, the display text is translated.

**WhatsApp row:** Insert after the phone `<div>`:
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

**Google Maps embed:** Replace the existing Bogotá `src` with:
```
https://maps.google.com/maps?q=Centro+Comercial+Cerritos,+Pereira,+Risaralda,+Colombia&output=embed
```
This uses the Google Maps search-embed format which resolves the place by name. The mall is at ~4.8161° N, 75.7741° W. Verify the iframe renders the correct pin before committing.

---

## 6. booking-section.tsx — Virtual-first two-card layout

The Calendly URL is `https://calendly.com/catherine-gonzalez3070/30min` (unchanged from existing code).

Replace the current button block with two side-by-side cards. The section heading and subtitle (`book_appointment`, `schedule_consultation`) are unchanged.

**Handler changes:** Remove the existing `handleBookingClick` function entirely. Replace with two separate handlers:
```ts
const handleVirtualClick = () => {
  setState(true);
  if (analytics) logEvent(analytics, "booking_click", { label: "Virtual Booking Clicked" });
};

const handleInPersonClick = () => {
  if (analytics) logEvent(analytics, "booking_click", { label: "In-Person Booking Clicked" });
  document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
};
```

**Card 1 — Virtual (primary, solid blue background):**
- Title: `{t("virtual_consultation")}`
- Description: `{t("virtual_consultation_desc")}`
- Button label: `{t("schedule_now")}`
- Button action: `handleVirtualClick`

**Card 2 — In-Person (secondary, white bg with border):**
- Title: `{t("inperson_consultation")}`
- Description: `{t("inperson_consultation_desc")}`
- Button label: `{t("nav_contact_us")}`
- Button action: `handleInPersonClick`

**Badge** below both cards, centered:
```tsx
<p className="text-sm text-gray-500 mt-4 italic">
  <i className="fa-solid fa-globe mr-1" />
  {t("english_available")}
</p>
```

**PopupModal placement:** The `<PopupModal>` JSX node is rendered at the bottom of the component's return statement (inside the `<section>` but after the card grid and badge). This is a JSX tree position, not a visual position — the modal is a portal that renders in the document root.

---

## 7. hero.tsx — WhatsApp icon

Add a WhatsApp `IconButton` as the third icon after LinkedIn and email. Use Font Awesome 6's `fa-brands fa-whatsapp` — available via the existing FA CDN `<link>` in `layout.tsx`:

```tsx
<IconButton
  variant="text"
  color="gray"
  onClick={() => window.open("https://wa.me/573105967326", "_blank")}
>
  <i className="fa-brands fa-whatsapp text-lg" />
</IconButton>
```

No other JSX changes in `hero.tsx` — the Pereira + English content is handled by the `hero_subheading` translation update.

---

## Files changed

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Convert to server component; remove `"use client"`; add `metadata` export; add JSON-LD script; render `<Providers>` |
| `src/app/providers.tsx` | **New** — `"use client"` component wrapping `I18nextProvider` + `<Layout>` |
| `src/app/contact.tsx` | Fix `tel:` href; add WhatsApp row; update Maps embed src |
| `src/app/hero.tsx` | Add WhatsApp `IconButton` |
| `src/app/booking-section.tsx` | Replace single button with virtual/in-person two-card layout |
| `public/locales/en/translation.json` | Updated + new keys per Section 4 |
| `public/locales/es/translation.json` | Updated + new keys per Section 4 |
| `src/components/layout.tsx` | No changes |
