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
