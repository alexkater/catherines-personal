"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const SERVICES = [
  { icon: "fa-solid fa-lungs", titleKey: "service_asthma", descKey: "service_asthma_desc" },
  { icon: "fa-solid fa-wind", titleKey: "service_copd", descKey: "service_copd_desc" },
  { icon: "fa-solid fa-ribbon", titleKey: "service_lung_cancer", descKey: "service_lung_cancer_desc" },
  { icon: "fa-solid fa-mask-face", titleKey: "service_vmni", descKey: "service_vmni_desc" },
  { icon: "fa-solid fa-x-ray", titleKey: "service_ild", descKey: "service_ild_desc" },
  { icon: "fa-solid fa-virus", titleKey: "service_pneumonia", descKey: "service_pneumonia_desc" },
];

export default function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-20 px-8 bg-blue-50">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <Typography variant="h2" color="blue-gray" className="mb-3 font-bold">
            {t("services_title")}
          </Typography>
          <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
            {t("services_subtitle")}
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <i className={`${s.icon} text-blue-600 text-xl`} />
              </div>
              <div>
                <Typography className="font-bold text-blue-gray-800 mb-1">
                  {t(s.titleKey)}
                </Typography>
                <Typography className="text-sm text-gray-500">
                  {t(s.descKey)}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
