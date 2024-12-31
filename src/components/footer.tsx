import { Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const LINKS = ["nav_home", "nav_about_us", "nav_contact_us", "nav_services"];
const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-10 px-8 pt-20">
      <div className="container mx-auto">
        <div className="mt-16 flex flex-wrap items-center justify-center gap-y-4 border-t border-gray-200 py-6 md:justify-between">
          <Typography className="text-center font-normal !text-gray-700">
            &copy; {CURRENT_YEAR} {t("footer_made_with")}{" "}
            <a href="https://www.material-tailwind.com" target="_blank">
              Material Tailwind
            </a>{" "}
            {t("footer_by")}{" "}
            <a href="https://www.creative-tim.com" target="_blank">
              Creative Tim
            </a>
            .
          </Typography>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
