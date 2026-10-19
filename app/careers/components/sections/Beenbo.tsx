import { MediaVideo } from "@/components/ui/Media";
import RobotIcon from "@/assets/icons/robot.svg";
import HeartHandIcon from "@/assets/icons/heart-hand.svg";
import YoutubeIcon from "@/assets/icons/youtube.svg";
import InstagramIcon from "@/assets/icons/instagram.svg";
import UsersIcon from "@/assets/icons/users.svg";
import LikeIcon from "@/assets/icons/like.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import ViewIcon from "@/assets/icons/view.svg";
import ShareIcon from "@/assets/icons/share.svg";
import { getTranslate } from "@/tolgee/server";

export default async function Beenbo() {
  const t = await getTranslate();

  return (
    <section className="flex lg:flex-row flex-col-reverse items-center lg:gap-8 gap-4 lg:mt-30 mt-12 section-container">
      <div>
        <div>
          <h3 className="text-schemes-outline md:text-2xl text-xl">
            {t("careersLanding.beenbo.whatIsBeenboTitle")}
          </h3>
          <h2 className="font-morabba md:text-5xl text-4xl font-semibold mt-3">
            {t("careersLanding.beenbo.mainTitle")}
          </h2>

          <p className="mt-12 md:text-2xl text-xl">
            {t("careersLanding.beenbo.description.part1")}
            <span className="size-9 bg-[#6F161C] inline-grid place-content-center rounded-full mx-2">
              <RobotIcon className="size-5" />
            </span>
            {t("careersLanding.beenbo.description.part2")}
            <span className="size-9 bg-[#376C53] inline-grid place-content-center rounded-full mx-2">
              <HeartHandIcon className="size-5" />
            </span>
            {t("careersLanding.beenbo.description.part3")}
          </p>
        </div>

        <div className="flex items-center gap-1 text-beenbo md:text-3xl text-2xl md:my-8 my-6 font-pofak font-medium">
          <h4 className="-rotate-10">
            {t("careersLanding.beenbo.example.for")}
          </h4>
          <h4 className="rotate-10">
            {t("careersLanding.beenbo.example.example")}
          </h4>
          <h4 className="-rotate-10 px-2">
            {t("careersLanding.beenbo.example.dots")}
          </h4>
        </div>

        <ul className="flex flex-col gap-10">
          <li className="flex items-center md:gap-6 gap-4">
            <span className="md:text-4xl text-2xl font-pofak text-schemes-outline font-semibold">
              1
            </span>
            <div className="md:text-2xl text-xl">
              {t("careersLanding.beenbo.example1.part1")}
              <span className="size-9 instagram-gradient inline-grid place-content-center rounded-full mx-2">
                <InstagramIcon className="size-5" />
              </span>
              {t("careersLanding.beenbo.example1.part2")}
              <span className="size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full mx-2">
                <RobotIcon className="size-5" />
              </span>{" "}
              {t("careersLanding.beenbo.example1.part3")}{" "}
              <div className="inline-flex relative w-[115px] h-[38px] translate-y-2.5">
                <span className="absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <LikeIcon className="size-5" />
                </span>
                <span className="rtl:-translate-x-6 ltr:translate-x-6 absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <CommentIcon className="size-5" />
                </span>
                <span className="rtl:-translate-x-12 ltr:translate-x-12 absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <ViewIcon className="size-5" />
                </span>
                <span className="rtl:-translate-x-18 ltr:translate-x-18 absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <ShareIcon className="size-5" />
                </span>
              </div>
              {t("careersLanding.beenbo.example1.part4")}
            </div>
          </li>

          <li className="flex items-center md:gap-6 gap-4">
            <span className="md:text-4xl text-2xl font-pofak text-schemes-outline font-semibold">
              2
            </span>
            <div className="md:text-2xl text-xl">
              {t("careersLanding.beenbo.example2.part1")}
              <span className="size-9 bg-[#781919] inline-grid place-content-center rounded-full mx-2">
                <YoutubeIcon className="size-5" />
              </span>
              {t("careersLanding.beenbo.example2.part2")}
              <span className="size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full mx-2">
                <UsersIcon className="size-5" />
              </span>{" "}
              {t("careersLanding.beenbo.example2.part3")}{" "}
              <div className="inline-flex relative w-[85px] h-[38px] translate-y-2.5">
                <span className="absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <LikeIcon className="size-5" />
                </span>
                <span className="rtl:-translate-x-6 ltr:translate-x-6 absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <CommentIcon className="size-5" />
                </span>
                <span className="rtl:-translate-x-12 ltr:translate-x-12 absolute size-9 bg-[#4E4E4E] inline-grid place-content-center rounded-full border border-background">
                  <ViewIcon className="size-5" />
                </span>
              </div>{" "}
              {t("careersLanding.beenbo.example2.part4")}
            </div>
          </li>
        </ul>
      </div>

      <div className="lg:w-[450px] w-full lg:h-[550px] h-[300px] shrink-0">
        <MediaVideo
          className="w-full h-full object-cover rounded-xl"
          autoPlay
          loop
          muted
          playsInline
          src="/careers/section-1.mp4"
        />
      </div>
    </section>
  );
}
