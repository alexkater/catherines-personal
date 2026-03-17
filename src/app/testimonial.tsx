"use client";

import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function Testimonial() {
  const { t } = useTranslation();

  const testimonials = [
    {
      feedback: t("testimonial_1_feedback"),
      name: t("testimonial_1_name"),
      title: t("testimonial_1_title"),
      initials: "JD",
    },
    {
      feedback: t("testimonial_2_feedback"),
      name: t("testimonial_2_name"),
      title: t("testimonial_2_title"),
      initials: "JS",
    },
    {
      feedback: t("testimonial_3_feedback"),
      name: t("testimonial_3_name"),
      title: t("testimonial_3_title"),
      initials: "CM",
    },
  ];

  return (
    <section className="py-20 px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-14">
          <Typography variant="h2" color="blue-gray" className="mb-3 font-bold">
            {t("testimonial_title")}
          </Typography>
          <Typography variant="lead" color="gray" className="max-w-2xl mx-auto">
            {t("testimonial_subtitle")}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-blue-50 rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <i className="fa-solid fa-quote-left text-blue-300 text-2xl" />
              <Typography className="text-gray-600 text-sm leading-relaxed flex-1">
                {item.feedback}
              </Typography>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.initials}
                </div>
                <div>
                  <Typography className="font-semibold text-blue-gray-800 text-sm">
                    {item.name}
                  </Typography>
                  <Typography className="text-xs text-gray-500">{item.title}</Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
