"use client";

import { useState, useEffect } from "react";
import { PopupModal } from "react-calendly";
import { useTranslation } from "react-i18next";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/lib/firebase";

const BookingSection = () => {
  const [state, setState] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof document !== "undefined") {
      setRootElement(document.getElementById("root"));
    }
  }, []);

  const handleVirtualClick = () => {
    setState(true);
    if (analytics) {
      logEvent(analytics, "booking_click", { label: "Virtual Booking Clicked" });
    }
  };

  const handleInPersonClick = () => {
    if (analytics) {
      logEvent(analytics, "booking_click", { label: "In-Person Booking Clicked" });
    }
    document.getElementById("contact-us")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="booking" className="py-20 bg-gray-100 px-8 text-center">
      <h2 className="text-3xl font-bold mb-4">{t("book_appointment")}</h2>
      <p className="text-gray-600 mb-8">{t("schedule_consultation")}</p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
        {/* Virtual Consultation - primary */}
        <div className="flex-1 bg-blue-600 text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <i className="fa-solid fa-video text-3xl mb-3" />
          <h3 className="text-xl font-bold mb-2">{t("virtual_consultation")}</h3>
          <p className="text-blue-100 text-sm mb-4">{t("virtual_consultation_desc")}</p>
          <button
            onClick={handleVirtualClick}
            className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg shadow hover:bg-blue-50 transition"
          >
            {t("schedule_now")}
          </button>
        </div>

        {/* In-Person Consultation - secondary */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col items-center">
          <i className="fa-solid fa-hospital text-3xl text-gray-500 mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t("inperson_consultation")}</h3>
          <p className="text-gray-500 text-sm mb-4">{t("inperson_consultation_desc")}</p>
          <button
            onClick={handleInPersonClick}
            className="border border-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-50 transition"
          >
            {t("nav_contact_us")}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-6 italic">
        <i className="fa-solid fa-globe mr-1" />
        {t("english_available")}
      </p>

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
