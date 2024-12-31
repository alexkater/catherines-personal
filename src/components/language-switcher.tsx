"use client";

import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Updates the current language
  };

  return (
    <div className="flex gap-4 items-center">
      {/* English Button */}
      <button
        onClick={() => changeLanguage("en")}
        className={`text-2xl py-2 rounded transition-opacity ${
          i18n.language === "en" ? "opacity-100" : "opacity-50"
        }`}
        aria-label="Switch to English"
      >
        🇬🇧
      </button>

      {/* Spanish Button */}
      <button
        onClick={() => changeLanguage("es")}
        className={`text-2xl py-2 rounded transition-opacity ${
          i18n.language === "es" ? "opacity-100" : "opacity-50"
        }`}
        aria-label="Switch to Spanish"
      >
        🇪🇸
      </button>
    </div>
  );
};

export default LanguageSwitcher;
