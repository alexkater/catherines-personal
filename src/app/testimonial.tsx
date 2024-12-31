"use client";

import React from "react";
import Image from "next/image";
import { Typography, Card, CardBody, Avatar } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function Testimonial() {
  const { t } = useTranslation();
  const [active, setActive] = React.useState(1);

  // Translated testimonials data
  const testimonials = [
    {
      id: 1,
      name: t("testimonial_1_name"),
      title: t("testimonial_1_title"),
      feedback: t("testimonial_1_feedback"),
      avatar: "/images/testimonial1.jpg",
    },
    {
      id: 2,
      name: t("testimonial_2_name"),
      title: t("testimonial_2_title"),
      feedback: t("testimonial_2_feedback"),
      avatar: "/images/testimonial2.jpg",
    },
    {
      id: 3,
      name: t("testimonial_3_name"),
      title: t("testimonial_3_title"),
      feedback: t("testimonial_3_feedback"),
      avatar: "/images/testimonial3.jpg",
    },
  ];

  const activeTestimonial = testimonials.find((t) => t.id === active);

  return (
    <section className="py-12 px-8 lg:py-24">
      <div className="container max-w-screen-lg mx-auto">
        {/* Header Section */}
        <div className="container mx-auto mb-20 text-center">
          <Typography variant="h2" color="blue-gray" className="mb-4">
            {t("testimonial_title")}
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto w-full px-4 font-normal !text-gray-500 lg:w-8/12"
          >
            {t("testimonial_subtitle")}
          </Typography>
        </div>

        {/* Testimonial Card */}
        <Card color="transparent" shadow={false} className="py-8 lg:flex-row">
          <CardBody className="w-full lg:gap-10 h-full lg:!flex justify-between">
            {/* Testimonial Content */}
            <div className="w-full mb-10 lg:mb-0">
              <Typography
                variant="h3"
                color="blue-gray"
                className="mb-4 font-bold lg:max-w-xs"
              >
                {activeTestimonial?.title}
              </Typography>
              <Typography className="mb-3 w-full lg:w-8/12 font-normal !text-gray-500">
                {activeTestimonial?.feedback}
              </Typography>
              <Typography variant="h6" color="blue-gray" className="mb-0.5">
                {activeTestimonial?.name}
              </Typography>
              <Typography
                variant="small"
                className="font-normal mb-5 !text-gray-500"
              >
                {activeTestimonial?.title}
              </Typography>
              <div className="flex items-center gap-4">
                {testimonials.map((testimonial) => (
                  <Avatar
                    key={testimonial.id}
                    variant="rounded"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    size="sm"
                    className={`cursor-pointer ${
                      active === testimonial.id ? "opacity-100" : "opacity-50"
                    }`}
                    onClick={() => setActive(testimonial.id)}
                  />
                ))}
              </div>
            </div>

            {/* Testimonial Image */}
            <div className="h-[21rem] rounded-lg w-full sm:w-[18rem] shrink-0">
              <Image
                width={768}
                height={768}
                src={activeTestimonial?.avatar || ""}
                alt={activeTestimonial?.name || "testimonial image"}
                className="h-full rounded-lg w-full object-cover"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default Testimonial;
