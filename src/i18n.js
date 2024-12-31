import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    supportedLngs: ["en-US", "es"],
    load: "languageOnly", // Normalize to "en" or "es"
    debug: process.env.NODE_ENV === "development",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    ns: ["translation"],
    defaultNS: "translation",
    react: {
      useSuspense: false, // For SSR compatibility
      wait: true,
    },
  });

export default i18n;
