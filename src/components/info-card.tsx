import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

interface InfoCardProps {
  icon: React.ElementType;
  titleKey: string; // The key for the title translation
  date: string;
  descriptionKey: string; // The key for the description translation
}

export function InfoCard({
  icon: Icon,
  titleKey,
  date,
  descriptionKey,
}: InfoCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        className="flex items-center justify-between rounded-none overflow-visible"
        floated={false}
        shadow={false}
      >
        <div className="flex flex-col gap-1 w-full">
          <Typography color="blue" className="font-bold text-xs">
            {date}
          </Typography>
          <Typography color="blue-gray" variant="h5" className="w-full">
            {t(titleKey)} {/* Translated title */}
          </Typography>
        </div>
        <IconButton
          className="flex-shrink-0 pointer-events-none"
          ripple={false}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </IconButton>
      </CardHeader>
      <CardBody className="grid justify-start !px-3.5 pt-2">
        <Typography className=" font-normal !text-gray-500">
          {t(descriptionKey)} {/* Translated description */}
        </Typography>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
