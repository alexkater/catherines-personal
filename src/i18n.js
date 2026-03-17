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
