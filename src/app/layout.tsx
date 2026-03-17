import "./globals.css";
import { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "./providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

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

const physicianSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  name: "Dra. Catherine González",
  description:
    "Especialista en neumología en Pereira, Risaralda. Consultas en español e inglés.",
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
    {
      "@type": "MedicalTherapy",
      name: "Ventilación Mecánica No Invasiva (VMNI)",
    },
    {
      "@type": "MedicalTherapy",
      name: "Enfermedades Respiratorias Crónicas",
    },
  ],
  knowsLanguage: ["es", "en"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" id="root">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={roboto.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
