"use client";

import { useState } from "react";
import { PopupModal } from "react-calendly";
import { useTranslation } from "react-i18next";

const BookingSection = () => {
  const [state, setState] = useState(false);
  const { t } = useTranslation();

  return (
    <section id="booking" className="py-12 px-8 text-center">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-4">{t("book_appointment")}</h2>

      {/* Subheading */}
      <p className="text-gray-600 mb-8">{t("schedule_consultation")}</p>

      {/* Schedule Button */}
      <button
        onClick={() => setState(true)}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
      >
        {t("schedule_now")}
      </button>

      {/* Calendly Popup Modal */}
      <PopupModal
        url="https://calendly.com/catherine-gonzalez3070/30min"
        onModalClose={() => setState(false)}
        open={state}
        /*
         * react-calendly uses React's Portal feature (https://reactjs.org/docs/portals.html) to render the popup modal.
         * Specify the rootElement property to ensure that the modal is inserted into the correct DOM node.
         */
        rootElement={document.getElementById("root") as HTMLElement}
      />
    </section>
  );
};

export default BookingSection;
