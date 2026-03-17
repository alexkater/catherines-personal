import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const isClient = typeof window !== "undefined";

if (!i18n.isInitialized) {
  const initChain = i18n.use(initReactI18next);

  if (isClient) {
    // Browser-only plugins — cannot run during SSR
    const HttpBackend = require("i18next-http-backend").default;
    const LanguageDetector = require("i18next-browser-languagedetector").default;
    initChain.use(HttpBackend).use(LanguageDetector);
  }

  initChain.init({
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    load: "languageOnly",
    debug: process.env.NODE_ENV === "development" && isClient,
    backend: isClient
      ? { loadPath: "/locales/{{lng}}/{{ns}}.json" }
      : undefined,
    ns: ["translation"],
    defaultNS: "translation",
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
