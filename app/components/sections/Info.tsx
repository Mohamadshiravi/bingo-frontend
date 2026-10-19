import GlassIcons from "@/components/ui/GlassIcons";
import HandDollarIcon from "@/assets/icons/hand-dollar.svg";
import LayerIcon from "@/assets/icons/layer.svg";
import ZoomIcon from "@/assets/icons/zoom.svg";
import { getTranslate } from "@/tolgee/server";

export default async function Info() {
  const t = await getTranslate();

  const items = [
    {
      icon: <ZoomIcon />,
      color: "blue",
      label: t("landing.info.worksOnCampaigns"),
    },
    {
      icon: <HandDollarIcon />,
      color: "red",
      label: t("landing.info.givenWorkToPeople"),
    },
    {
      icon: <LayerIcon />,
      color: "green",
      label: t("landing.info.completedTasks"),
    },
  ];

  return (
    <section className="mt-40 section-container">
      <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3 text-center">
        {t("landing.info.title")}
      </h2>

      <div className="w-full relative mt-10">
        <GlassIcons items={items} />
      </div>
    </section>
  );
}
