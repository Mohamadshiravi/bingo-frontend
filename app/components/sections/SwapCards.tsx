import CardSwap, { Card } from "@/components/ui/CardSwap";
import { getTranslate } from "@/tolgee/server";

export default async function SwapCards() {
  const t = await getTranslate();

  const items = [
    { title: t("landing.swapCards.reliable"), src: "" },
    { title: t("landing.swapCards.customizable"), src: "" },
    { title: t("landing.swapCards.smooth"), src: "" },
  ];

  return (
    <section
      dir="ltr"
      className="md:my-20 my-10 flex lg:flex-row flex-col-reverse lg:gap-0 md:gap-20 gap-28 section-container overflow-hidden lg:pt-20 lg:pb-10 bg-[#050505] rounded-2xl"
    >
      <div
        dir="auto"
        className="grid lg:place-content-center lg:p-0 p-8 gap-1 grow"
      >
        <div className="flex flex-col gap-8 lg:w-90">
          <h2 className="font-morabba md:text-5xl/18 text-4xl font-semibold mt-3">
            {t("landing.swapCards.title")}
          </h2>
          <h3 className="text-schemes-outline md:text-2xl text-xl">
            {t("landing.swapCards.subtitle")}
          </h3>
        </div>
      </div>
      <div className="relative md:h-[400px] h-80 lg:w-[500px]">
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={5000}
          pauseOnHover={false}
        >
          {items.map((e, i) => (
            <Card key={i}>
              <div className="flex flex-col">
                <h3 className="w-full text-left px-4 py-3 border-b">
                  {e.title}
                </h3>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>
    </section>
  );
}
