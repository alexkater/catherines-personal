"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact-us" className="bg-gray-100 py-20 px-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div>
          <Typography variant="h2" color="blue-gray" className="mb-4 font-bold">
            {t("contact_title")}
          </Typography>
          <Typography variant="lead" color="gray" className="mb-6">
            {t("contact_subtitle")}
          </Typography>

          <div className="space-y-4">
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_address_label")}
              </Typography>
              <Typography color="gray">{t("contact_address")}</Typography>
            </div>
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_phone_label")}
              </Typography>
              <Typography color="gray">
                <a href="tel:+573105967326" className="hover:underline">
                  {t("contact_phone")}
                </a>
              </Typography>
            </div>
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_whatsapp_label")}
              </Typography>
              <Typography color="gray">
                <a
                  href="https://wa.me/573105967326"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {t("contact_whatsapp")}
                </a>
              </Typography>
            </div>
            <div>
              <Typography className="font-bold text-blue-gray-700">
                {t("contact_email_label")}
              </Typography>
              <Typography color="gray">{t("contact_email")}</Typography>
            </div>
          </div>
        </div>

        {/* Map Integration */}
        <div className="w-full h-96">
          <iframe
            src="https://maps.google.com/maps?q=Centro+Comercial+Cerritos,+Pereira,+Risaralda,+Colombia&output=embed"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
