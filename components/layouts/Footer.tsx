import { getTranslate } from "@/tolgee/server";
import Link from "next/link";
import { FaApple, FaGooglePlay, FaInstagram, FaYoutube } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import ChangeLanguageOption from "../ui/ChangeLanguageOption";

export default async function Footer() {
  const t = await getTranslate();
  return (
    <footer className="bg-[#101010]">
      <div className="section-container flex flex-col gap-6 py-8">
        <section className="mt-8">
          <Link href={"/"} className="flex items-center gap-1">
            <span className="text-beenbo text-lg font-bold">
              {t("layouts.header.brandName")}
            </span>
          </Link>
        </section>

        <section className="flex lg:flex-row flex-col gap-5 mt-6">
          <div className="grid md:grid-cols-3 gap-5 w-full">
            <ul className="flex flex-col gap-4 text-schemes-outline font-light">
              <li className="text-on-surface font-semibold test-lg">
                {t("layouts.footer.services.title")}
              </li>
              <li className="border-b border-border-600"></li>
              <li className="hover:text-beenbo transition">
                {t("layouts.footer.services.instagramCampaign")}
              </li>
              <li className="hover:text-beenbo transition">
                {t("layouts.footer.services.youtubeCampaign")}
              </li>
            </ul>

            <ul className="flex flex-col gap-4 text-schemes-outline font-light">
              <li className="text-on-surface font-semibold test-lg">
                {t("layouts.footer.company.title")}
              </li>
              <li className="border-b border-border-600"></li>
              <li className="hover:text-beenbo transition">
                <Link href={"#about-beenbo"}>
                  {t("layouts.footer.company.about")}
                </Link>
              </li>
              <li className="hover:text-beenbo transition">
                <Link href={"/careers"}>
                  {t("layouts.footer.company.jobs")}
                </Link>
              </li>
              <li className="hover:text-beenbo transition">
                {t("layouts.footer.company.support")}
              </li>
            </ul>

            <ul className="flex flex-col gap-4 text-schemes-outline font-light">
              <li className="text-on-surface font-semibold test-lg">
                {t("layouts.footer.more.title")}
              </li>
              <li className="border-b border-border-600"></li>
              <li className="hover:text-beenbo transition">
                <Link href={"#test"}>
                  {t("layouts.footer.more.testServices")}
                </Link>
              </li>
              <li className="hover:text-beenbo transition">
                <Link href={"#calculator"}>
                  {t("layouts.footer.more.prices")}
                </Link>
              </li>
              <li className="hover:text-beenbo transition">
                <a target="_blank" href={process.env.NEXT_PUBLIC_PANEL_URL}>
                  {t("layouts.footer.more.loginRegister")}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 shrink-0 sm:w-100">
            <h3 className="text-on-surface font-semibold test-lg">
              {t("layouts.footer.newsletter.title")}
            </h3>
            <p className="text-schemes-outline">
              {t("layouts.footer.newsletter.description")}
            </p>
            <div className="focus-within:shadow-2xl shadow-beenbo/20 focus-within:scale-105 focus-within:border-beenbo transition duration-500 flex items-center p-2 bg-background-700 border rounded-full border-schemes-surface-container-high">
              <input
                className="outline-none w-full h-full px-3 peer md:text-base text-sm"
                placeholder={t("layouts.footer.newsletter.placeholder")}
              />
              <button className="text-schemes-outline border md:text-base text-sm rounded-full py-2 px-3 shrink-0 peer-focus:bg-beenbo peer-focus:text-surface transition duration-500 cursor-pointer hover:scale-95">
                {t("layouts.footer.newsletter.button")}
              </button>
            </div>
          </div>
        </section>

        <section className="py-4 border-y border-border-600 flex md:flex-row flex-col gap-6 items-center justify-between">
          <div className="flex md:items-center md:flex-row flex-col md:gap-10 gap-6">
            <span className="font-bold text-center">
              {t("layouts.footer.followUs.title")}
            </span>
            <div className="flex items-center md:gap-6 gap-4">
              <a className="text-xl cursor-pointer">
                <FaInstagram />
              </a>

              <a className="text-xl cursor-pointer">
                <FaYoutube />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex hover:shadow-lg shadow-beenbo/20 hover:border-beenbo cursor-pointer transition duration-300 items-center gap-3 text-xs rounded-full border border-border-600 px-5 py-2.5">
              <FaGooglePlay className="text-base" />
              <span>{t("layouts.footer.followUs.googlePlay")}</span>
            </button>
            <button className="flex hover:shadow-lg shadow-beenbo/20 hover:border-beenbo cursor-pointer transition duration-300 items-center gap-3 text-xs rounded-full border border-border-600 px-5 py-2.5">
              <FaApple className="text-base scale-120" />
              <span>{t("layouts.footer.followUs.appleStore")}</span>
            </button>
          </div>
        </section>

        <section className="flex md:flex-row flex-col md:items-center justify-between gap-6">
          <button className="flex items-center gap-2 text-schemes-outline">
            <span className="text-2xl">
              <TbWorld />
            </span>
            <ChangeLanguageOption />
          </button>

          <div className="flex md:flex-row flex-col md:items-center md:gap-8 gap-6 text-schemes-outline">
            <span className="hover:text-beenbo transition">
              {t("layouts.footer.bottom.rights")}
            </span>
            <span className="hover:text-beenbo transition">
              {t("layouts.footer.bottom.siteMap")}
            </span>
            <span className="hover:text-beenbo transition">
              {t("layouts.footer.bottom.rules")}
            </span>
            <span className="hover:text-beenbo transition">
              {t("layouts.footer.bottom.privacy")}
            </span>
          </div>
        </section>
      </div>
    </footer>
  );
}
