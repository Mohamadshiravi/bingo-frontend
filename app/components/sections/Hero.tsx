import RocketIcon from "@/assets/icons/rocket.svg";
import PlayIcon from "@/assets/icons/play.svg";
import { getTranslate } from "@/tolgee/server";
import { MediaImage as Image } from "@/components/ui/Media";

export default async function Hero() {
  const t = await getTranslate();

  return (
    <section className="w-full md:h-[90vh] h-[80vh] relative">
      <Image
        src="/landing/hero.jpg"
        alt="Hero Image"
        fill
        className="w-full h-full object-cover absolute top-0 left-0"
      />

      <div className="w-full h-full absolute top-0 left-0 bg-linear-to-b from-background/40 to-background"></div>

      <div className="w-full h-full absolute top-0 left-0 flex flex-col md:gap-8 gap-4 md:justify-end justify-center items-center pb-36 px-4">
        <h1 className="md:text-7xl/20 text-5xl/15 text-beenbo font-semibold font-morabba max-w-200 text-center">
          {t("landing.hero.mainTitle")}
        </h1>
        <h2 className="md:mt-8 mt-4 text-on-background text-center">
          {t("landing.hero.subTitle")}
        </h2>

        <div className="flex items-center justify-center flex-wrap gap-3">
          <a
            target="_blank"
            href={process.env.NEXT_PUBLIC_PANEL_URL}
            className="hover:scale-105 transition-all flex items-center gap-3 bg-extended-accent/20 cursor-pointer border border-extended-accent text-extended-accent px-6 py-2 rounded-full"
          >
            <RocketIcon />
            {t("landing.hero.startButton")}
          </a>
          <button className="hover:scale-105 transition-all flex items-center gap-3 bg-extended-red/20 cursor-pointer border border-extended-red text-extended-red px-6 py-2 rounded-full">
            <PlayIcon />
            {t("landing.hero.watchIntroButton")}
          </button>
        </div>
      </div>
    </section>
  );
}
