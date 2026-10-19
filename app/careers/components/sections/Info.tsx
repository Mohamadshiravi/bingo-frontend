import GlassIcons from "@/components/ui/GlassIcons";
import HandDollarIcon from "@/assets/icons/hand-dollar.svg";
import LayerIcon from "@/assets/icons/layer.svg";
import ClockIcon from "@/assets/icons/clock.svg";
import { getTranslate } from "@/tolgee/server";

export default async function Info() {
  const t = await getTranslate();

  const items = [
    {
      icon: <ClockIcon />,
      color: "blue",
      label: t("careersLanding.info.workAnytime"),
    },
    {
      icon: <LayerIcon />,
      color: "red",
      label: t("careersLanding.info.instantPayout"),
    },
    {
      icon: <HandDollarIcon />,
      color: "green",
      label: t("careersLanding.info.unlimitedIncome"),
    },
  ];

  return (
    <section className="mt-40 section-container">
      <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3 text-center">
        {t("careersLanding.info.title")}
      </h2>

      <div className="w-full relative mt-10">
        <GlassIcons items={items} />
      </div>
    </section>
  );
}
