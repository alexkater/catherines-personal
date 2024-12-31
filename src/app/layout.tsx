"use client";

import "./globals.css";
import { Roboto } from "next/font/google";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { Layout, FixedPlugin } from "@/components";

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
          <title>Dr. Catherine González</title>
        </head>
        <body className={roboto.className}>
          <Layout>{children}</Layout>
        </body>
      </html>
    </I18nextProvider>
  );
}
