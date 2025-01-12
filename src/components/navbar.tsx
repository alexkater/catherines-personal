import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import LanguageSwitcher from "./language-switcher";
import { useTranslation } from "react-i18next";

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Typography
        as="a"
        href={href}
        variant="paragraph"
        color="gray"
        className="flex items-center gap-2 font-medium text-gray-900"
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  const NAV_MENU = [
    { label: t("nav_home"), href: "#" },
    { label: t("nav_booking"), href: "#booking" }, // Booking Section
    { label: t("nav_about_us"), href: "#about-us" },
    { label: t("nav_contact_us"), href: "#contact-us" },
    { label: t("nav_blog"), href: "https://catherine-nemologia.blogspot.com/" }, // Blog Section
  ];

  return (
    <MTNavbar
      fullWidth
      blurred={false}
      shadow={false}
      color="white"
      className="sticky top-0 z-50 border-0"
      placeholder=""
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Typography
          as="a"
          href="/"
          color="blue-gray"
          className="text-lg font-bold"
          placeholder={""}
        >
          {t("navbar_title")}
        </Typography>

        {/* Desktop Navigation */}
        <ul className="ml-10 hidden items-center gap-8 lg:flex">
          {NAV_MENU.map((nav, index) => (
            <NavItem key={index} href={nav.href}>
              {nav.label}
            </NavItem>
          ))}
          <LanguageSwitcher />
        </ul>

        {/* Mobile Menu Button */}
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile Menu */}
      <Collapse open={open}>
        <div className="container mx-auto mt-3 border-t border-gray-200 px-2 pt-4">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map((nav, index) => (
              <NavItem key={index} href={nav.href}>
                {nav.label}
              </NavItem>
            ))}
            {/* Language Switcher in Mobile Menu */}
            <li>
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
