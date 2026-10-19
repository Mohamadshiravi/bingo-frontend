import { MediaVideo } from "@/components/ui/Media";
import ApkIcon from "@/assets/icons/apk.svg";
import PlayIcon from "@/assets/icons/play.svg";
import { getTranslate } from "@/tolgee/server";
import { MediaImage as Image } from "@/components/ui/Media";

export default async function Hero() {
  // const response = await fetch(`${process.env.BACKEND_URL}/app/version`);
  // const body = await response.json();
  // const downloadUrl = body.data.url;

  const t = await getTranslate();

  const videos = [
    { src: "/careers/1.png", type: "image" },
    { src: "/careers/2.mp4", type: "video" },
    { src: "/careers/3.png", type: "image" },
    { src: "/careers/4.mp4", type: "video" },
    { src: "/careers/5.png", type: "image" },
    { src: "/careers/6.png", type: "image" },
    { src: "/careers/7.mp4", type: "video" },
    { src: "/careers/8.png", type: "image" },
    { src: "/careers/9.mp4", type: "video" },
    { src: "/careers/10.png", type: "image" },
    { src: "/careers/11.mp4", type: "video" },
    { src: "/careers/12.png", type: "image" },
  ];

  return (
    <section className="w-full relative overflow-hidden grid md:grid-cols-2 items-center max-w-[1800px] mx-auto">
      <div className="md:bg-transparent bg-background/75 w-full h-full flex flex-col justify-center md:gap-8 gap-4 md:p-10 p-6 z-10">
        <h1 className="lg:text-7.5xl/24 text-5xl/15 text-beenbo font-semibold font-morabba max-w-200">
          {t("careersLanding.hero.title")}
        </h1>
        <p className="text-lg md:mt-0 mt-4">
          {t("careersLanding.hero.descriptionPart1")}
          <br />
          <br />
          {t("careersLanding.hero.descriptionPart2")}
          <br />
          <br />
          {t("careersLanding.hero.descriptionPart3")}
        </p>

        <div className="flex items-center flex-wrap gap-3 mt-8">
          <a
            // href={downloadUrl}
            className="hover:scale-105 transition-all flex items-center gap-3 bg-extended-accent/20 cursor-pointer border border-extended-accent text-extended-accent px-6 py-2 rounded-full"
          >
            <ApkIcon />
            {t("careersLanding.hero.downloadApk")}
          </a>
          <button className="hover:scale-105 transition-all flex items-center gap-3 bg-extended-red/20 cursor-pointer border border-extended-red text-extended-red px-6 py-2 rounded-full">
            <PlayIcon />
            {t("careersLanding.hero.watchIntro")}
          </button>
        </div>
      </div>
      <div className="w-full h-full grid xl:grid-cols-4 grid-cols-3 md:static absolute">
        {videos.map((e, i) =>
          e.type === "video" ? (
            <MediaVideo
              key={i}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src={e.src}
            />
          ) : (
            <Image
              key={i}
              className="w-full h-full object-cover"
              src={e.src}
              alt=""
              width={400}
              height={300}
            />
          ),
        )}
      </div>
    </section>
  );
}
