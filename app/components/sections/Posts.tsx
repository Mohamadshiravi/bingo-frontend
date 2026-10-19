import { MediaImage as Image } from "@/components/ui/Media";
import { getTranslate } from "@/tolgee/server";

export default async function Posts() {
  const t = await getTranslate();

  const items = [
    { img: "https://picsum.photos/id/1015/600/900", height: 200 },
    { img: "https://picsum.photos/id/1011/600/750", height: 150 },
    { img: "https://picsum.photos/id/1020/600/800", height: 300 },
    { img: "https://picsum.photos/id/1021/600/800", height: 100 },
    { img: "https://picsum.photos/id/1023/600/800", height: 250 },
    { img: "https://picsum.photos/id/1028/600/800", height: 200 },
    { img: "https://picsum.photos/id/1076/600/800", height: 300 },
    { img: "https://picsum.photos/id/1029/600/800", height: 100 },
    { img: "https://picsum.photos/id/1039/600/800", height: 300 },
    { img: "https://picsum.photos/id/1050/600/800", height: 350 },
    { img: "https://picsum.photos/id/1052/600/800", height: 200 },
    { img: "https://picsum.photos/id/1080/600/800", height: 400 },
    { img: "https://picsum.photos/id/1056/600/800", height: 150 },
    { img: "https://picsum.photos/id/1059/600/800", height: 400 },
    { img: "https://picsum.photos/id/1057/600/800", height: 350 },
  ];

  return (
    <section className="mt-26 section-container">
      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="text-schemes-outline md:text-2xl text-xl text-center">
          {t("landing.posts.joinUs")}
        </h3>
        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3 text-center">
          {t("landing.posts.latestFreePosts")}
        </h2>
      </div>

      <div className="w-full relative lg:columns-5 md:columns-4 sm:columns-3 columns-2 gap-0 md:mt-20 mt-10 h-[750px] overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-7/12 flex pointer-events-none items-end justify-center px-4 font-semibold text-center z-10 md:text-2xl text-lg text-schemes-outline bg-linear-to-t from-background to-background/0">
          <p className="max-w-250">{t("landing.posts.note")}</p>
        </div>
        {items.map((e, i) => (
          <div
            key={i}
            style={{ height: e.height }}
            className="w-full rounded-xl overflow-hidden break-inside-avoid p-1.5 group"
          >
            <Image
              className="w-full h-full object-cover rounded-lg group-hover:scale-90 transition-all duration-300 active:scale-85"
              src={e.img}
              width={600}
              height={e.height}
              alt=""
            />
          </div>
        ))}
      </div>
    </section>
  );
}
