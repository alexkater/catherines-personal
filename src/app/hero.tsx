"use client";

import { IconButton, Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

function Hero() {
  const { t } = useTranslation();

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full bg-white">
      <div className="container mx-auto px-8 py-20">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">

          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <Typography variant="h1" color="blue-gray" className="mb-4">
              {t("hero_title")}
            </Typography>
            <Typography
              variant="lead"
              color="gray"
              className="mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {t("hero_subheading")}
            </Typography>

            <Button
              size="lg"
              color="blue"
              className="mb-8"
              onClick={scrollToBooking}
            >
              {t("hero_cta")}
            </Button>

            <Typography className="mb-3 text-blue-gray-900 font-medium uppercase text-sm">
              {t("hero_connect")}
            </Typography>

            <div className="flex gap-2 justify-center lg:justify-start">
              <IconButton
                variant="text"
                color="gray"
                onClick={() =>
                  window.open("https://www.linkedin.com/in/catherine-gonzalez-perez", "_blank")
                }
              >
                <i className="fa-brands fa-linkedin text-lg" />
              </IconButton>
              <IconButton
                variant="text"
                color="gray"
                onClick={() => {
                  window.open(
                    `mailto:catherine.gonzalez3070@gmail.com?subject=${encodeURIComponent(
                      t("email_subject")
                    )}&body=${encodeURIComponent(t("email_body"))}`
                  );
                }}
              >
                <i className="fa-solid fa-envelope text-lg" />
              </IconButton>
              <IconButton
                variant="text"
                color="gray"
                onClick={() => window.open("https://wa.me/573105967326", "_blank")}
              >
                <i className="fa-brands fa-whatsapp text-lg" />
              </IconButton>
            </div>
          </div>

          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-blue-100 shadow-xl bg-blue-50 flex items-center justify-center">
              <Image
                src="/image/catherine.webp"
                alt={t("hero_photo_alt")}
                width={288}
                height={288}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Hero;
