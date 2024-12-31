"use client";

import { useState, useEffect } from "react";
import { PopupModal } from "react-calendly";
import { useTranslation } from "react-i18next";

const BookingSection = () => {
  const [state, setState] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof document !== "undefined") {
      setRootElement(document.getElementById("root"));
    }
  }, []);

  return (
    <section id="booking" className="py-12 px-8 text-center">
      <h2 className="text-3xl font-bold mb-4">{t("book_appointment")}</h2>
      <p className="text-gray-600 mb-8">{t("schedule_consultation")}</p>
      <button
        onClick={() => setState(true)}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
      >
        {t("schedule_now")}
      </button>
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
