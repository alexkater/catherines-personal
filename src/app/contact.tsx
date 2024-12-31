"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact-us" className="bg-gray-100 py-12 px-8">
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
                <a href="tel:+573123456789" className="hover:underline">
                  {t("contact_phone")}
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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.578917357655!2d-74.05457489999999!3d4.6689093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9af4d9303f6b%3A0x95bef74bf8c6c172!2sCra.%2014%20%2384-98%2C%20Chapinero%2C%20Bogot%C3%A1%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v1735600116035!5m2!1ses!2sco"
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
