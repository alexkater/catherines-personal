"use client";

import { IconButton, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      <div className="grid place-items-center min-h-[92vh] px-8">
        <div className="container mx-auto grid place-items-center h-max text-center">
          {/* Hero Title */}
          <Typography variant="h1" color="blue-gray">
            {t("hero_title")}
          </Typography>

          {/* Subheading */}
          <Typography
            variant="lead"
            color="gray"
            className="mt-4 mb-12 w-full md:max-w-full lg:max-w-4xl"
          >
            {t("hero_subheading")}
          </Typography>

          {/* Connect Section */}
          <Typography className="mt-12 mb-4 text-blue-gray-900 font-medium uppercase">
            {t("hero_connect")}
          </Typography>

          {/* Social Media Icons */}
          <div className="gap-2 lg:flex">
            <IconButton
              variant="text"
              color="gray"
              placeholder=""
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/catherine-gonzalez-perez",
                  "_blank"
                )
              }
            >
              <i className="fa-brands fa-linkedin text-lg" />
            </IconButton>
            <IconButton
              variant="text"
              color="gray"
              onClick={() => {
                window.open(
                  `mailto:catherine3070+staticweb@hotmail.com?subject=${encodeURIComponent(
                    t("email_subject")
                  )}&body=${encodeURIComponent(t("email_body"))}`
                );
              }}
            >
              <i className="fa-solid fa-envelope text-lg" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
