"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-blue-gray-900 text-white px-8 pt-14 pb-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Typography className="text-xl font-bold text-white mb-1">
              {t("navbar_title")}
            </Typography>
            <Typography className="text-blue-gray-300 text-sm mb-4">
              {t("footer_specialty")}
            </Typography>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/catherine-gonzalez-perez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-gray-300 hover:text-white transition"
              >
                <i className="fa-brands fa-linkedin text-xl" />
              </a>
              <a
                href="https://wa.me/573105967326"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-gray-300 hover:text-white transition"
              >
                <i className="fa-brands fa-whatsapp text-xl" />
              </a>
              <a
                href="mailto:catherine3070@hotmail.com"
                className="text-blue-gray-300 hover:text-white transition"
              >
                <i className="fa-solid fa-envelope text-xl" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <Typography className="text-sm font-semibold text-blue-gray-200 uppercase tracking-wide mb-3">
              {t("contact_title")}
            </Typography>
            <ul className="space-y-2 text-blue-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-location-dot mt-1 text-blue-400" />
                {t("contact_address")}
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-phone text-blue-400" />
                <a href="tel:+573105967326" className="hover:text-white transition">
                  {t("contact_phone")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-brands fa-whatsapp text-blue-400" />
                <a href="https://wa.me/573105967326" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  {t("contact_whatsapp")}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <Typography className="text-sm font-semibold text-blue-gray-200 uppercase tracking-wide mb-3">
              {t("nav_home")}
            </Typography>
            <ul className="space-y-2 text-blue-gray-300 text-sm">
              <li><a href="#booking" className="hover:text-white transition">{t("nav_booking")}</a></li>
              <li><a href="#services" className="hover:text-white transition">{t("nav_services")}</a></li>
              <li><a href="#about-us" className="hover:text-white transition">{t("nav_about_us")}</a></li>
              <li><a href="#contact-us" className="hover:text-white transition">{t("nav_contact_us")}</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-blue-gray-700 pt-6 text-center">
          <Typography className="text-blue-gray-400 text-sm">
            &copy; {CURRENT_YEAR} {t("navbar_title")} · {t("footer_specialty")} · {t("footer_location")} · {t("footer_rights")}
          </Typography>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
