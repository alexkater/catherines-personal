"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

const ContactSection = () => {
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  return (
    <motion.section
      id="contact-us"
      className="bg-gray-100 py-20 px-8"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <div className="w-full h-96">
          <iframe
            src="https://maps.google.com/maps?q=Centro+Comercial+Cerritos,+Pereira,+Risaralda,+Colombia&output=embed"
            title="Ubicación en mapa"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
