"use client";
import { Typography } from "@material-tailwind/react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";

import InfoCard from "@/components/info-card";

const EDUCATION = [
  {
    icon: AcademicCapIcon,
    titleKey: "education_fea_pulmonary", // Translation key
    date: "2018 - 2023",
    descriptionKey: "education_fea_pulmonary_desc", // Translation key
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_thoracic_oncology",
    date: "2023",
    descriptionKey: "education_thoracic_oncology_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_doctor",
    date: "2013",
    descriptionKey: "education_doctor_desc",
  },
  {
    icon: AcademicCapIcon,
    titleKey: "education_nimv_methodology",
    date: "2023",
    descriptionKey: "education_nimv_methodology_desc",
  },
];

const EXPERIENCE = [
  {
    icon: BriefcaseIcon,
    titleKey: "experience_vithas",
    date: "Feb 2023 - Present",
    descriptionKey: "experience_vithas_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_jerez",
    date: "2018 - 2023",
    descriptionKey: "experience_jerez_desc",
  },
  {
    icon: BriefcaseIcon,
    titleKey: "experience_sanitas",
    date: "2013",
    descriptionKey: "experience_sanitas_desc",
  },
];

const SKILLS = [
  {
    icon: FireIcon,
    titleKey: "skill_teamwork",
    date: "Soft Skill",
    descriptionKey: "skill_teamwork_desc",
  },
  {
    icon: FireIcon,
    titleKey: "skill_proactivity",
    date: "Soft Skill",
    descriptionKey: "skill_proactivity_desc",
  },
  {
    icon: FireIcon,
    titleKey: "skill_leadership",
    date: "Soft Skill",
    descriptionKey: "skill_leadership_desc",
  },
  {
    icon: FireIcon,
    titleKey: "skill_research",
    date: "Technical Skill",
    descriptionKey: "skill_research_desc",
  },
];

export function InformationSection() {
  const { t } = useTranslation();

  return (
    <section id="about-us" className="pb-28 px-8">
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
          <div className="container mx-auto grid grid-cols-1 gap-16 gap-y-12">
            {EDUCATION.map((item, idx) => (
              <InfoCard
                key={idx}
                icon={item.icon}
                titleKey={item.titleKey}
                date={item.date}
                descriptionKey={item.descriptionKey}
              />
            ))}
          </div>
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
          <div className="container mx-auto grid grid-cols-1 gap-16 gap-y-12">
            {EXPERIENCE.map((item, idx) => (
              <InfoCard
                key={idx}
                icon={item.icon}
                titleKey={item.titleKey}
                date={item.date}
                descriptionKey={item.descriptionKey}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="container gap-20 mt-36 mx-auto items-center">
        <div>
          <div className="mb-10">
            <Typography color="blue-gray" className="mb-2 text-3xl font-bold">
              {t("info_title_skills")}
            </Typography>
            <Typography variant="lead" className="!text-gray-500">
              {t("info_description_skills")}
            </Typography>
          </div>
          <div className="container mx-auto grid grid-cols-1 gap-16 gap-y-12 lg:grid-cols-2">
            {SKILLS.map((item, idx) => (
              <InfoCard
                key={idx}
                icon={item.icon}
                titleKey={item.titleKey}
                date={item.date}
                descriptionKey={item.descriptionKey}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InformationSection;
