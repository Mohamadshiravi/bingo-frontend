import { MediaImage as Image } from "@/components/ui/Media";
import ApkIcon from "@/assets/icons/apk.svg";
import { getTranslate } from "@/tolgee/server";

export default async function DownloadApp() {
  // const response = await fetch(`${process.env.BACKEND_URL}/app/version`);
  // const body = await response.json();
  // const downloadUrl = body.data.url;

  const t = await getTranslate();

  return (
    <section className="md:mt-30 mt-20 section-container flex md:flex-row flex-col items-center lg:gap-38 gap-10">
      <div className="max-w-[355px] shrink-0">
        <Image src={"/careers/mobile.png"} width={400} height={768} alt="" />
      </div>
      <div>
        <h3 className="text-schemes-outline md:text-2xl text-xl">
          {t("careersLanding.downloadApp.startQuestion")}
        </h3>

        <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3">
          {t("careersLanding.downloadApp.startWorking")}
        </h2>

        <p className="mt-12 md:text-2xl text-xl">
          {t("careersLanding.downloadApp.paragraph1")}
          <br />
          <br />
          {t("careersLanding.downloadApp.paragraph2")}
          <br />
          <br />
          {t("careersLanding.downloadApp.paragraph3")}
          <br />
          <br />
          {t("careersLanding.downloadApp.paragraph4")}
        </p>

        <a
          // href={downloadUrl}
          className="mt-16 inline-flex items-center gap-3 border px-5 py-2.5 rounded-full hover:bg-[#EEFF90] hover:shadow-xl shadow-[#EEFF90]/30 hover:scale-105 hover:text-surface cursor-pointer duration-300 text-[#EEFF90] border-[#EEFF90]"
        >
          <ApkIcon />
          {t("careersLanding.downloadApp.downloadApk")}
        </a>
      </div>
    </section>
  );
}
