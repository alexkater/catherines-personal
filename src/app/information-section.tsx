"use client";
import { Typography } from "@material-tailwind/react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";

import InfoCard from "@/components/info-card";

const EDUCATION = [
  {
    icon: AcademicCapIcon,
    titleKey: "education_bronchoscopy",
    date: "2025",
    descriptionKey: "education_bronchoscopy_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_epoc_master",
    date: "2024",
    descriptionKey: "education_epoc_master_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_thoracic_oncology",
    date: "2023",
    descriptionKey: "education_thoracic_oncology_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_nimv_methodology",
    date: "2023",
    descriptionKey: "education_nimv_methodology_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_fea_pulmonary",
    date: "2018 - 2023",
    descriptionKey: "education_fea_pulmonary_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_doctor",
    date: "2013",
    descriptionKey: "education_doctor_desc",
  },
];

const EXPERIENCE = [
  {
    icon: BriefcaseIcon,
    titleKey: "experience_servisalud",
    date: "Jun 2025 - Presente",
    descriptionKey: "experience_servisalud_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_vithas",
    date: "Feb 2023 - May 2024",
    descriptionKey: "experience_vithas_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_jerez",
    date: "May 2018 - Feb 2023",
    descriptionKey: "experience_jerez_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_sanitas",
    date: "2013",
    descriptionKey: "experience_sanitas_desc",
  },
];

export function InformationSection() {
  const { t } = useTranslation();
  const shouldAnimate = useReducedMotion() === false;

  const cardVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  const pillVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 10 : 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  };

  return (
    <motion.section
      id="about-us"
      className="py-20 pb-28 px-8"
      initial={{ opacity: 0, y: shouldAnimate ? 30 : 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid xl:grid-cols-2 md:grid-cols-1 container gap-20 mx-auto items-start">
        {/* Education Section */}
        <div>
          <div className="mb-10">
            <Typography color="blue-gray" className="mb-2 text-3xl font-bold">
              {t("info_title_education")}
            </Typography>
            <Typography variant="lead" className="!text-gray-500">
              {t("info_description_education")}
            </Typography>
          </div>
          <motion.div
            className="container mx-auto grid grid-cols-1 gap-16 gap-y-12"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {EDUCATION.map((item, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <InfoCard
                  icon={item.icon}
                  titleKey={item.titleKey}
                  date={item.date}
                  descriptionKey={item.descriptionKey}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Experience Section */}
        <div>
          <div className="mb-10">
            <Typography color="blue-gray" className="mb-2 text-3xl font-bold">
              {t("info_title_experience")}
            </Typography>
            <Typography variant="lead" className="!text-gray-500">
              {t("info_description_experience")}
            </Typography>
          </div>
          <motion.div
            className="container mx-auto grid grid-cols-1 gap-16 gap-y-12"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {EXPERIENCE.map((item, idx) => (
              <motion.div key={idx} variants={cardVariants}>
                <InfoCard
                  icon={item.icon}
                  titleKey={item.titleKey}
                  date={item.date}
                  descriptionKey={item.descriptionKey}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        <Typography color="blue-gray" className="mb-2 text-3xl font-bold text-center">
          {t("info_title_skills")}
        </Typography>
        <Typography variant="lead" className="!text-gray-500 text-center mb-8">
          {t("info_description_skills")}
        </Typography>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {[
            { key: "skill_teamwork", icon: "fa-solid fa-people-group" },
            { key: "skill_proactivity", icon: "fa-solid fa-bolt" },
            { key: "skill_leadership", icon: "fa-solid fa-star" },
            { key: "skill_research", icon: "fa-solid fa-magnifying-glass" },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={pillVariants}
              className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2"
            >
              <i className={`${s.icon} text-blue-600 text-sm`} />
              <Typography className="text-blue-gray-700 font-medium text-sm">{t(s.key)}</Typography>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default InformationSection;
