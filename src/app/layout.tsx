"use client";

import "./globals.css";
import { Roboto } from "next/font/google";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { Layout } from "@/components";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <html lang="en" id="root">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
            integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <title>
            Dr. Catherine González - Specialist in General and Pulmonary
            Medicine
          </title>
          <meta
            name="description"
            content="Dr. Catherine González offers general and online medical consultations with a focus on respiratory health. Book an appointment today for personalized, professional care."
          />
          <meta
            name="keywords"
            content="Catherine González, Pulmonary Medicine, General Medicine, Bogotá, Online Medical Consultations"
          />
          <meta name="author" content="Dr. Catherine González" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://yourwebsite.com" />
          <meta
            property="og:title"
            content="Dr. Catherine González - Specialist in General and Pulmonary Medicine"
          />
          <meta
            property="og:description"
            content="Dr. Catherine González offers general and online medical consultations with a focus on respiratory health. Book an appointment today for personalized, professional care."
          />
          <meta property="og:url" content="https://yourwebsite.com" />
          <meta
            property="og:image"
            content="https://yourwebsite.com/og-image.jpg"
          />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Dr. Catherine González - Specialist in General and Pulmonary Medicine"
          />
          <meta
            name="twitter:description"
            content="Dr. Catherine González offers general and online medical consultations with a focus on respiratory health. Book an appointment today for personalized, professional care."
          />
          <meta
            name="twitter:image"
            content="https://yourwebsite.com/twitter-image.jpg"
          />
        </head>
        <body className={roboto.className}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </I18nextProvider>
  );
}
